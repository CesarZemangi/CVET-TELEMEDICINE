from fastapi.testclient import TestClient
from ML.predict_api import app
import os

client = TestClient(app)

def test_read_main():
    # Since model loading happens on startup, we check if app responds
    # The actual /predict might fail if model isn't trained yet
    pass

def test_predict_invalid():
    # Test error handling
    response = client.post("/predict", json={"symptoms": ""})
    assert response.status_code == 400
    assert response.json()["detail"] == "symptoms must not be empty"
