#!/usr/bin/env python
"""Test script to verify model loading, balanced inference, and safe overrides."""

import os
import sys
import tempfile

from PIL import Image

# Add project root to path for imports
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(project_root))

from backend.config import HAM10000_CLASS_ORDER, HUMAN_READABLE_LABELS, NO_SIGNIFICANT_PREDICTION


def allowed_predictions():
    return set(HUMAN_READABLE_LABELS.values()) | {NO_SIGNIFICANT_PREDICTION}


def _save_temp_image(image: Image.Image) -> str:
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        image.save(tmp.name)
        return tmp.name


def test_model_loading():
    """Test that the model loads correctly."""
    print("=" * 60)
    print("TEST 1: Model Loading")
    print("=" * 60)

    try:
        from backend.model_loader import load_model

        print("OK Imports successful")
        transforms, model, device = load_model()
        print("OK Model loaded successfully")
        print(f"  - Device: {device}")
        print(f"  - Model type: {type(model).__name__}")
        print(f"  - Transforms: {type(transforms).__name__}")
        return True

    except Exception as exc:
        print(f"FAIL Failed to load model: {exc}")
        import traceback

        traceback.print_exc()
        return False


def test_prediction():
    """Test that prediction returns a compatible response structure."""
    print("\n" + "=" * 60)
    print("TEST 2: Prediction API")
    print("=" * 60)

    try:
        from backend.predict import predict_image

        lesion_path = os.path.join(
            os.path.dirname(project_root),
            "SkinDisease",
            "test",
            "SkinCancer",
            "basal-cell-carcinoma-lesion-54.jpeg",
        )
        result = predict_image(lesion_path)

        required_keys = {"prediction", "confidence", "top3"}
        if not required_keys.issubset(result.keys()):
            raise ValueError(f"Missing keys: {required_keys - set(result.keys())}")

        if not isinstance(result["top3"], list) or len(result["top3"]) not in {0, 3}:
            raise ValueError(f"top3 should be a list with 0 or 3 items, got {len(result['top3'])}")

        if result["prediction"] not in allowed_predictions():
            raise ValueError(f"Unexpected prediction label: {result['prediction']}")

        for pred in result["top3"]:
            if pred["label"] not in HUMAN_READABLE_LABELS.values():
                raise ValueError(f"Unexpected top3 label: {pred['label']}")

        if result["prediction"] == NO_SIGNIFICANT_PREDICTION:
            raise ValueError("Real lesion sample was rejected as no significant lesion")

        print("OK Prediction successful")
        print(f"  - Top prediction: {result['prediction']}")
        print(f"  - Confidence: {result['confidence']}%")
        print(f"  - Top 3 count: {len(result['top3'])}")
        for index, pred in enumerate(result["top3"], 1):
            print(f"    {index}. {pred['label']}: {pred['confidence']}%")

        return True

    except Exception as exc:
        print(f"FAIL Prediction failed: {exc}")
        import traceback

        traceback.print_exc()
        return False


def test_label_mapping():
    """Test that label mapping is correctly configured."""
    print("\n" + "=" * 60)
    print("TEST 3: Label Mapping")
    print("=" * 60)

    try:
        from backend.config import LABEL_MAP, NUM_CLASSES

        print("OK Label mapping loaded")
        print(f"  - Number of classes: {NUM_CLASSES}")
        print("  - Class labels:")
        for class_id, label in LABEL_MAP.items():
            print(f"    {class_id}: {label}")

        if len(LABEL_MAP) != NUM_CLASSES:
            raise ValueError(f"Label count mismatch: {len(LABEL_MAP)} != {NUM_CLASSES}")

        if tuple(LABEL_MAP[index] for index in range(NUM_CLASSES)) != HAM10000_CLASS_ORDER:
            raise ValueError("HAM10000 class order does not match the configured label map")

        return True

    except Exception as exc:
        print(f"FAIL Label mapping failed: {exc}")
        import traceback

        traceback.print_exc()
        return False


def test_balanced_overrides():
    """Test real lesion acceptance and safe rejection for non-lesion inputs."""
    print("\n" + "=" * 60)
    print("TEST 4: Balanced Decision Logic")
    print("=" * 60)

    try:
        from backend.predict import predict_image

        lesion_samples = [
            os.path.join(
                os.path.dirname(project_root),
                "SkinDisease",
                "test",
                "SkinCancer",
                "basal-cell-carcinoma-lesion-54.jpeg",
            ),
            os.path.join(
                os.path.dirname(project_root),
                "SkinDisease",
                "test",
                "SkinCancer",
                "basal-cell-carcinoma-face-42.jpeg",
            ),
        ]

        for lesion_path in lesion_samples:
            result = predict_image(lesion_path)
            print(f"  - lesion {os.path.basename(lesion_path)}: {result['prediction']} ({result['confidence']}%)")
            if result["prediction"] == NO_SIGNIFICANT_PREDICTION:
                raise ValueError(f"Real lesion was rejected: {lesion_path}")

        clear_skin_path = _save_temp_image(Image.new("RGB", (224, 224), color=(219, 187, 165)))
        try:
            clear_result = predict_image(clear_skin_path)
            print(f"  - clear_skin: {clear_result['prediction']} ({clear_result['confidence']}%)")
            if clear_result["prediction"] != NO_SIGNIFICANT_PREDICTION:
                raise ValueError("Clear skin was not rejected safely")
        finally:
            os.unlink(clear_skin_path)

        noise_path = _save_temp_image(Image.effect_noise((224, 224), 100).convert("RGB"))
        try:
            noise_result = predict_image(noise_path)
            print(f"  - random_noise: {noise_result['prediction']} ({noise_result['confidence']}%)")
            if noise_result["prediction"] != NO_SIGNIFICANT_PREDICTION:
                raise ValueError("Random image was not rejected safely")
        finally:
            os.unlink(noise_path)

        face_asset = os.path.join(os.path.dirname(project_root), "frontend", "src", "assets", "man.webp")
        if os.path.exists(face_asset):
            face_result = predict_image(face_asset)
            print(f"  - face_asset: {face_result['prediction']} ({face_result['confidence']}%)")
            if face_result["prediction"] != NO_SIGNIFICANT_PREDICTION:
                raise ValueError(f"Face asset produced unsafe prediction: {face_result['prediction']}")
        else:
            print("  - face_asset: SKIPPED (asset not found)")

        return True

    except Exception as exc:
        print(f"FAIL Balanced override test failed: {exc}")
        import traceback

        traceback.print_exc()
        return False


if __name__ == "__main__":
    os.chdir(project_root)

    results = []
    results.append(("Model Loading", test_model_loading()))
    results.append(("Label Mapping", test_label_mapping()))
    results.append(("Prediction", test_prediction()))
    results.append(("Balanced Decision Logic", test_balanced_overrides()))

    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)

    for test_name, passed in results:
        status = "PASS" if passed else "FAIL"
        print(f"{status}: {test_name}")

    if all(result[1] for result in results):
        print("\nAll tests passed!")
        sys.exit(0)

    print("\nSome tests failed")
    sys.exit(1)
