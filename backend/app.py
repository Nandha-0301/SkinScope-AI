import os
import shutil
import tempfile
import uuid

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .model_loader import load_model
from .predict import predict_image

app = FastAPI(title="SkinScope AI - Skin Disease Detection")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Pre-load the model so first inference is faster."""
    print("Loading skin disease model...")
    try:
        load_model()
        print("Model loaded successfully on startup")
    except Exception as exc:
        print(f"Model preload failed: {exc}")
        print("Model will be loaded on first request")


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accept an image, run inference, and return prediction JSON.
    """
    if not file.content_type.startswith("image/"):
        return JSONResponse(status_code=400, content={"error": "Invalid image file"})

    file_ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    tmp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}{file_ext}")

    try:
        with open(tmp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        prediction_result = predict_image(tmp_path)
        return JSONResponse(content=prediction_result)

    except Exception:
        return JSONResponse(status_code=500, content={"error": "Inference error: Internal Server Error"})

    finally:
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)
