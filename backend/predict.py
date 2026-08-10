from PIL import Image, ImageOps
import torch
from torchvision.transforms.functional import pil_to_tensor

from .config import (
    FACE_LIKE_CENTER_CONTRAST_THRESHOLD,
    FACE_LIKE_DARK_RATIO_THRESHOLD,
    FACE_LIKE_EDGE_DENSITY_THRESHOLD,
    FACE_LIKE_SKIN_RATIO_THRESHOLD,
    HEURISTIC_IMAGE_SIZE,
    HIGH_CONFIDENCE_ACCEPT,
    HUMAN_READABLE_LABELS,
    LABEL_MAP,
    MIN_PREDICTION_CONFIDENCE,
    NOISY_IMAGE_EDGE_DENSITY_THRESHOLD,
    NOISY_IMAGE_SKIN_RATIO_THRESHOLD,
    NO_SIGNIFICANT_PREDICTION,
    SMOOTH_SKIN_EDGE_DENSITY_THRESHOLD,
    SMOOTH_SKIN_VARIANCE_THRESHOLD,
    TEXTURED_IMAGE_VARIANCE_THRESHOLD,
)
from .model_loader import load_model


def _display_label(class_id: int) -> str:
    canonical_label = LABEL_MAP[class_id]
    return HUMAN_READABLE_LABELS.get(canonical_label, canonical_label)


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


def _to_percent(value: float) -> float:
    return round(_clamp01(value) * 100, 2)


def _build_response(prediction: str, confidence: float, top3: list[dict]) -> dict:
    return {
        "prediction": prediction,
        "confidence": round(confidence, 2),
        "top3": top3,
    }


def _skin_mask_ratio(rgb_image: torch.Tensor) -> float:
    rgb_255 = rgb_image * 255.0
    red, green, blue = rgb_255[0], rgb_255[1], rgb_255[2]
    max_channel = torch.maximum(red, torch.maximum(green, blue))
    min_channel = torch.minimum(red, torch.minimum(green, blue))
    skin_mask = (
        (red > 95)
        & (green > 40)
        & (blue > 20)
        & ((max_channel - min_channel) > 15)
        & (torch.abs(red - green) > 15)
        & (red > green)
        & (red > blue)
    )
    return skin_mask.float().mean().item()


def _image_heuristics(image: Image.Image) -> dict:
    working = image.resize((HEURISTIC_IMAGE_SIZE, HEURISTIC_IMAGE_SIZE))
    rgb_tensor = pil_to_tensor(working).float() / 255.0
    gray_tensor = 0.2989 * rgb_tensor[0] + 0.5870 * rgb_tensor[1] + 0.1140 * rgb_tensor[2]

    variance = gray_tensor.var().item()
    dx = torch.abs(gray_tensor[:, 1:] - gray_tensor[:, :-1])
    dy = torch.abs(gray_tensor[1:, :] - gray_tensor[:-1, :])
    edge_values = torch.cat((dx.flatten(), dy.flatten()))
    edge_density = (edge_values > 0.08).float().mean().item()
    skin_ratio = _skin_mask_ratio(rgb_tensor)

    height, width = gray_tensor.shape
    center = gray_tensor[height // 4 : (3 * height) // 4, width // 4 : (3 * width) // 4]
    border_h = max(1, height // 8)
    border_w = max(1, width // 8)
    border = torch.cat(
        (
            gray_tensor[:border_h, :].flatten(),
            gray_tensor[-border_h:, :].flatten(),
            gray_tensor[:, :border_w].flatten(),
            gray_tensor[:, -border_w:].flatten(),
        )
    )
    center_contrast = abs(center.mean().item() - border.mean().item())
    dark_ratio = (gray_tensor < 0.28).float().mean().item()

    smooth_skin = (
        variance < SMOOTH_SKIN_VARIANCE_THRESHOLD
        and edge_density < SMOOTH_SKIN_EDGE_DENSITY_THRESHOLD
    )
    extreme_noise = (
        edge_density > NOISY_IMAGE_EDGE_DENSITY_THRESHOLD
        and skin_ratio < NOISY_IMAGE_SKIN_RATIO_THRESHOLD
    )
    face_like_pattern = (
        skin_ratio > FACE_LIKE_SKIN_RATIO_THRESHOLD
        and edge_density < FACE_LIKE_EDGE_DENSITY_THRESHOLD
        and center_contrast > FACE_LIKE_CENTER_CONTRAST_THRESHOLD
        and dark_ratio > FACE_LIKE_DARK_RATIO_THRESHOLD
    )

    return {
        "variance": variance,
        "edge_density": edge_density,
        "skin_ratio": skin_ratio,
        "center_contrast": center_contrast,
        "dark_ratio": dark_ratio,
        "smooth_skin": smooth_skin,
        "extreme_noise": extreme_noise,
        "face_like_pattern": face_like_pattern,
    }


def _format_top3(probabilities: torch.Tensor) -> tuple[list[dict], int, float]:
    topk_count = min(3, probabilities.shape[0])
    topk_probs, topk_indices = torch.topk(probabilities, k=topk_count)

    top3_results = []
    for prob, idx in zip(topk_probs, topk_indices):
        class_id = idx.item()
        top3_results.append(
            {
                "label": _display_label(class_id),
                "confidence": round(prob.item() * 100, 2),
            }
        )

    return top3_results, topk_indices[0].item(), topk_probs[0].item()


def _log_prediction_debug(
    image_path: str,
    heuristic_signals: dict,
    logits: torch.Tensor | None = None,
    probabilities: torch.Tensor | None = None,
    predicted_index: int | None = None,
) -> None:
    print(f"[predict] image={image_path}")
    print(
        "[predict] heuristics "
        f"variance={heuristic_signals['variance']:.6f} "
        f"edge_density={heuristic_signals['edge_density']:.4f} "
        f"skin_ratio={heuristic_signals['skin_ratio']:.4f} "
        f"smooth_skin={heuristic_signals['smooth_skin']} "
        f"face_like={heuristic_signals['face_like_pattern']} "
        f"extreme_noise={heuristic_signals['extreme_noise']}"
    )
    if logits is not None and probabilities is not None and predicted_index is not None:
        print(f"[predict] predicted_index={predicted_index}")
        print(f"[predict] raw_logits={[round(value, 4) for value in logits.tolist()]}")
        print(f"[predict] probabilities={[round(value * 100, 2) for value in probabilities.tolist()]}")


def predict_image(image_path: str) -> dict:
    """
    Predict skin disease from an image using the PyTorch model.

    Args:
        image_path (str): Path to the image file

    Returns:
        dict: Prediction results with keys:
            - prediction: Top 1 predicted class label or safe override
            - confidence: Confidence percentage for the returned prediction
            - top3: List of dicts with top 3 lesion predictions

    Raises:
        Exception: If prediction fails for any reason
    """
    try:
        image_transforms, model, device = load_model()

        with Image.open(image_path) as image_file:
            image = ImageOps.exif_transpose(image_file).convert("RGB")

        heuristic_signals = _image_heuristics(image)
        if heuristic_signals["smooth_skin"]:
            _log_prediction_debug(image_path, heuristic_signals)
            return _build_response(
                prediction=NO_SIGNIFICANT_PREDICTION,
                confidence=_to_percent(0.98),
                top3=[],
            )

        if heuristic_signals["face_like_pattern"]:
            _log_prediction_debug(image_path, heuristic_signals)
            return _build_response(
                prediction=NO_SIGNIFICANT_PREDICTION,
                confidence=_to_percent(max(0.72, heuristic_signals["skin_ratio"])),
                top3=[],
            )

        if heuristic_signals["extreme_noise"]:
            _log_prediction_debug(image_path, heuristic_signals)
            return _build_response(
                prediction=NO_SIGNIFICANT_PREDICTION,
                confidence=_to_percent(max(0.80, 1.0 - heuristic_signals["skin_ratio"])),
                top3=[],
            )

        image_tensor = image_transforms(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(image_tensor)

        logits = outputs[0].detach().cpu()
        probabilities = torch.nn.functional.softmax(logits, dim=0)
        top3_results, predicted_index, top1_probability = _format_top3(probabilities)
        _log_prediction_debug(image_path, heuristic_signals, logits, probabilities, predicted_index)

        if top1_probability < MIN_PREDICTION_CONFIDENCE:
            return _build_response(
                prediction=NO_SIGNIFICANT_PREDICTION,
                confidence=_to_percent(max(1.0 - top1_probability, MIN_PREDICTION_CONFIDENCE)),
                top3=top3_results,
            )

        if top1_probability > HIGH_CONFIDENCE_ACCEPT and heuristic_signals["variance"] >= TEXTURED_IMAGE_VARIANCE_THRESHOLD:
            return _build_response(
                prediction=_display_label(predicted_index),
                confidence=round(top1_probability * 100, 2),
                top3=top3_results,
            )

        return _build_response(
            prediction=_display_label(predicted_index),
            confidence=round(top1_probability * 100, 2),
            top3=top3_results,
        )

    except Exception as exc:
        raise Exception(f"Prediction failed: {str(exc)}") from exc
