import os
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification

# Global variables to store processor and model loaded once
processor = None
model = None

def load_model():
    global processor, model
    if processor is None or model is None:
        # Resolve the absolute path to the local model folder
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.abspath(os.path.join(current_dir, "../../model"))
        
        # Load processor
        processor = AutoImageProcessor.from_pretrained(model_path)
        # Load model
        model = AutoModelForImageClassification.from_pretrained(model_path)
        
        # Set to evaluation mode
        model.eval()

        # Send model to device
        device = "cuda" if torch.cuda.is_available() else "cpu"
        model.to(device)
        
    else:
        # If already loaded, determine device to return
        device = "cuda" if torch.cuda.is_available() else "cpu"
        
    return processor, model, device
