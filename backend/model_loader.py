import os
import torch
from torchvision import transforms
from .model import create_model, load_checkpoint
from .config import IMAGE_SIZE, MEAN, STD, MODEL_CHECKPOINT_PATH, NUM_CLASSES

# Global variables to store model and transforms loaded once
model = None
image_transforms = None

def load_model():
    """
    Load the PyTorch skin disease model and preprocessing transforms.
    
    Returns:
        tuple: (image_transforms, model, device)
            - image_transforms: torchvision.transforms composition for preprocessing
            - model: PyTorch model loaded from checkpoint
            - device: 'cuda' or 'cpu' based on availability
    """
    global model, image_transforms
    
    if model is None or image_transforms is None:
        try:
            # Determine device
            device = "cuda" if torch.cuda.is_available() else "cpu"
            
            # Resolve checkpoint path
            current_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.abspath(os.path.join(current_dir, ".."))
            candidate_paths = [
                os.path.join(project_root, MODEL_CHECKPOINT_PATH),
                os.path.join(project_root, "Model", "Skin_Cancer_Masterpiece_80_80.pth"),
            ]
            checkpoint_path = next((path for path in candidate_paths if os.path.exists(path)), None)

            if checkpoint_path is None:
                raise FileNotFoundError(
                    "Model checkpoint not found. Tried: "
                    + ", ".join(candidate_paths)
                )
            
            # Create model architecture
            model = create_model(num_classes=NUM_CLASSES)
            
            # Load checkpoint weights into model
            model = load_checkpoint(model, checkpoint_path, device=device)
            
            # Define image preprocessing transforms
            # These transforms prepare images the same way the model was trained on
            image_transforms = transforms.Compose([
                transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
                transforms.ToTensor(),
                transforms.Normalize(mean=MEAN, std=STD),
            ])
            
            print(f"Model loaded successfully from {checkpoint_path}")
            print(f"Using device: {device}")
            print(f"Number of classes: {NUM_CLASSES}")
            
        except Exception as e:
            raise RuntimeError(
                f"Failed to load model: {str(e)}. "
                "Please verify the checkpoint file exists and PyTorch is properly installed."
            ) from e
    else:
        # If already loaded, determine device to return
        device = "cuda" if torch.cuda.is_available() else "cpu"
    
    return image_transforms, model, device
