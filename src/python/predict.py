from PIL import Image
import torch
from .model_loader import load_model

def predict_image(image_path: str) -> dict:
    try:
        # Load model and processor instances
        processor, model, device = load_model()
        
        # Open image and convert to RGB
        image = Image.open(image_path).convert("RGB")
        
        # Process image and map to device
        inputs = processor(images=image, return_tensors="pt")
        inputs = {k: v.to(device) for k, v in inputs.items()}
        
        # Run inference using torch.no_grad()
        with torch.no_grad():
            outputs = model(**inputs)
            
        # Extract logits and compute probabilities using softmax
        logits = outputs.logits
        probabilities = torch.nn.functional.softmax(logits, dim=-1)[0]
        
        # Get top 3 predictions
        topk_probs, topk_indices = torch.topk(probabilities, 3)
        
        # Format the top 3 results
        top3_results = []
        for prob, idx in zip(topk_probs, topk_indices):
            label = model.config.id2label[idx.item()]
            confidence = round(prob.item() * 100, 2)
            top3_results.append({"label": label, "confidence": confidence})
            
        # Extract top 1 prediction
        best_prediction = top3_results[0]["label"]
        best_confidence = top3_results[0]["confidence"]
        
        return {
            "prediction": best_prediction,
            "confidence": best_confidence,
            "top3": top3_results
        }
    except Exception as e:
        raise Exception(f"Prediction failed: {str(e)}")
