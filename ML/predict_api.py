import os
import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

MODEL_PATH = os.path.join("ML", "artifacts", "disease_model.pkl")

app = FastAPI(title="CVET Disease Prediction API")


class PredictRequest(BaseModel):
    symptoms: str


def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Train the model first.")
    return joblib.load(MODEL_PATH)


model = None


@app.on_event("startup")
def startup_event():
    global model
    model = load_model()


@app.post("/predict")
def predict(payload: PredictRequest):
    global model
    if not payload.symptoms.strip():
        raise HTTPException(status_code=400, detail="symptoms must not be empty")

    pred = model.predict([payload.symptoms])[0]
    confidence = None
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba([payload.symptoms])[0]
        confidence = float(max(probs))

    # Prototype recommended tests map
    recommendations = [
        "CBC",
        "Urinalysis",
        "Basic metabolic panel"
    ]

    return {
        "predicted_disease": pred,
        "confidence": confidence,
        "recommended_tests": recommendations
    }
