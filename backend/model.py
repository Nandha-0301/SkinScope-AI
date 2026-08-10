# Model architecture definition for ResNet-based skin disease classifier
import os
import torch
import torch.nn as nn
from torchvision import models

def create_model(num_classes=7):
    """
    Create a ResNet-50 model with the specified number of output classes.
    The model uses a multi-layer fully connected head matching the checkpoint structure.
    
    Args:
        num_classes (int): Number of classes for the classifier head
        
    Returns:
        torch.nn.Module: Model with custom classification head
    """
    # Load ResNet50 backbone (without pre-trained weights)
    model = models.resnet50(weights=None)
    
    # Get the number of input features from the backbone
    num_ftrs = model.fc.in_features  # Usually 2048 for ResNet50
    
    # Replace the final fully connected layer with a multi-layer head
    # This matches the checkpoint structure with fc.0, fc.1, fc.2, fc.3
    # fc.0: Linear layer
    # fc.1: ReLU activation
    # fc.2: Dropout or similar
    # fc.3: Output layer
    hidden_size = 512  # Intermediate layer size
    model.fc = nn.Sequential(
        nn.Linear(num_ftrs, hidden_size),      # fc.0
        nn.ReLU(inplace=True),                  # fc.1 (activation, no params)
        nn.Dropout(p=0.5),                      # fc.2 (dropout, no params)
        nn.Linear(hidden_size, num_classes)     # fc.3
    )
    
    return model


class SkinDiseaseClassifier(nn.Module):
    """
    Wrapper around ResNet50 for skin disease classification.
    """
    def __init__(self, num_classes=7):
        super(SkinDiseaseClassifier, self).__init__()
        self.model = create_model(num_classes)
        self.num_classes = num_classes
    
    def forward(self, x):
        """Forward pass through the model"""
        return self.model(x)


def load_checkpoint(model, checkpoint_path, device="cpu"):
    """
    Load a trained model checkpoint (state_dict) into the model.
    
    Args:
        model (torch.nn.Module): Model to load weights into
        checkpoint_path (str): Path to the .pth checkpoint file
        device (str): Device to load on ('cpu' or 'cuda')
        
    Returns:
        torch.nn.Module: Model with loaded weights
        
    Raises:
        FileNotFoundError: If checkpoint path doesn't exist
        RuntimeError: If checkpoint is incompatible with model architecture
    """
    if not os.path.exists(checkpoint_path):
        raise FileNotFoundError(f"Checkpoint not found at {checkpoint_path}")
    
    # Load the state dictionary
    checkpoint = torch.load(checkpoint_path, map_location=device)
    
    # Handle different checkpoint formats
    if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
        # Checkpoint saved with training metadata
        state_dict = checkpoint['model_state_dict']
    elif isinstance(checkpoint, dict):
        # Raw state dict
        state_dict = checkpoint
    else:
        raise ValueError("Checkpoint format not recognized")
    
    # Load state dict into model
    model.load_state_dict(state_dict)
    model = model.to(device)
    model.eval()
    
    return model


import os
