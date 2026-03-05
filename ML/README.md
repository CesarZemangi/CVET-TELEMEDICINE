# CVET ML Prototype

## Phase 1 - Data Preparation
1. Export data from DB:
   - `node Server/scripts/exportCasesDataset.js`
2. Output CSV:
   - `ML/data/cases_export.csv`

## Phase 2 - Model Training
1. Install dependencies:
   - `pip install -r ML/requirements.txt`
2. Train:
   - `python ML/train_model.py`
3. Artifact:
   - `ML/artifacts/disease_model.pkl`

## Phase 3 - Prediction API
1. Start Python API:
   - `uvicorn ML.predict_api:app --host 0.0.0.0 --port 8001 --reload`
2. Node backend proxy endpoint:
   - `POST /api/v1/ml/predict`
   - Body: `{ "symptoms": "..." }`

## Frontend
- Vet page path:
  - `/vetdashboard/diagnostics/ai-predictor`
- Shows:
  - Predicted disease
  - Confidence
  - Recommended tests
  - Advisory disclaimer
