# Configuration for HAM10000 skin lesion inference.

# HAM10000 class order must match the training order used by the checkpoint.
HAM10000_CLASS_ORDER = (
    "akiec",
    "bcc",
    "bkl",
    "df",
    "mel",
    "nv",
    "vasc",
)

LABEL_MAP = {index: label for index, label in enumerate(HAM10000_CLASS_ORDER)}

HUMAN_READABLE_LABELS = {
    "akiec": "Actinic Keratoses",
    "bcc": "Basal Cell Carcinoma",
    "bkl": "Benign Keratosis",
    "df": "Dermatofibroma",
    "mel": "Melanoma",
    "nv": "Melanocytic Nevus",
    "vasc": "Vascular Lesion",
}

LABEL_TO_ID = {label: index for index, label in LABEL_MAP.items()}

NUM_CLASSES = len(LABEL_MAP)

NO_SIGNIFICANT_PREDICTION = "No Significant Skin Lesion Detected"
UNCERTAIN_PREDICTION = "Uncertain - Please consult a dermatologist"
LOW_CONFIDENCE_PREDICTION = NO_SIGNIFICANT_PREDICTION

# Final balanced inference thresholds.
MIN_PREDICTION_CONFIDENCE = 0.50
HIGH_CONFIDENCE_ACCEPT = 0.80
TEXTURED_IMAGE_VARIANCE_THRESHOLD = 0.005

# Lightweight image heuristics.
HEURISTIC_IMAGE_SIZE = 256
SMOOTH_SKIN_VARIANCE_THRESHOLD = 0.001
SMOOTH_SKIN_EDGE_DENSITY_THRESHOLD = 0.01
NOISY_IMAGE_EDGE_DENSITY_THRESHOLD = 0.55
NOISY_IMAGE_SKIN_RATIO_THRESHOLD = 0.10
FACE_LIKE_SKIN_RATIO_THRESHOLD = 0.20
FACE_LIKE_EDGE_DENSITY_THRESHOLD = 0.10
FACE_LIKE_CENTER_CONTRAST_THRESHOLD = 0.18
FACE_LIKE_DARK_RATIO_THRESHOLD = 0.25

IMAGE_SIZE = 224
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]

MODEL_CHECKPOINT_PATH = "model/Skin_Cancer_Masterpiece_80_80.pth"
