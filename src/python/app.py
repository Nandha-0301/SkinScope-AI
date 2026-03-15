import os
import shutil
import uuid
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .predict import predict_image
from .model_loader import load_model

app = FastAPI(title="SkinScope AI - Skin Disease Detection")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Pre-load model on application startup
    print("Loading model...")
    load_model()
    print("Model loaded successfully.")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Endpoint that accepts an image, temporarily saves it with a UUID,
    runs the Hugging Face vit-skin-disease model using predict.py,
    and returns the prediction, confidence, and top3 as JSON.
    """
    if not file.content_type.startswith("image/"):
        return JSONResponse(status_code=400, content={"error": "Invalid image file"})
    
    # Generate UUID filename
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    tmp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}{file_ext}")
    
    try:
        # Save uploaded file temporarily 
        with open(tmp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Run inference (returns a dict now)
        prediction_result = predict_image(tmp_path)
        
        return JSONResponse(content=prediction_result)
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Inference error: Internal Server Error"})
        
    finally:
        # Secure file deletion
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass

# This ensures that app.py can be run locally for debugging
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.python.app:app", host="0.0.0.0", port=8000, reload=True)
