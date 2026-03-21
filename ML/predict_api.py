import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

DISEASE_MODEL_PATH = os.path.join("ML", "artifacts", "disease_model.pkl")
PAYMENT_MODEL_PATH = os.path.join("ML", "artifacts", "payment_model.pkl")

app = FastAPI(title="CVET Prediction API")


class PredictRequest(BaseModel):
    symptoms: str


class PaymentInsightRecord(BaseModel):
    farmer_id: int | None = None
    vet_id: int | None = None
    amount: float | int | None = None
    payment_method: str | None = None
    payment_provider: str | None = None
    payment_status: str | None = None
    appointment_status: str | None = None
    created_at: str | None = None
    appointment_date: str | None = None


class PaymentInsightRequest(BaseModel):
    records: list[PaymentInsightRecord] = Field(default_factory=list)
    vet_id: int | None = None


class VetRecommendationVet(BaseModel):
    vet_id: int
    user_id: int | None = None
    vet_name: str | None = None
    specialization: str | None = None
    average_rating: float | None = None
    review_count: int | None = None


class VetRecommendationPayment(BaseModel):
    farmer_id: int | None = None
    vet_id: int | None = None
    amount: float | int | None = None
    payment_method: str | None = None
    payment_provider: str | None = None
    payment_status: str | None = None
    appointment_status: str | None = None
    created_at: str | None = None


class VetRecommendationRequest(BaseModel):
    farmer_id: int
    payments: list[VetRecommendationPayment] = Field(default_factory=list)
    vets: list[VetRecommendationVet] = Field(default_factory=list)


def load_optional_model(path):
    if not os.path.exists(path):
        return None
    return joblib.load(path)


disease_model = None
payment_artifact = None


@app.on_event("startup")
def startup_event():
    global disease_model, payment_artifact
    disease_model = load_optional_model(DISEASE_MODEL_PATH)
    payment_artifact = load_optional_model(PAYMENT_MODEL_PATH)


@app.post("/predict")
def predict(payload: PredictRequest):
    global disease_model
    if not payload.symptoms.strip():
        raise HTTPException(status_code=400, detail="symptoms must not be empty")
    if disease_model is None:
        raise HTTPException(status_code=503, detail="Disease model not available")

    pred = disease_model.predict([payload.symptoms])[0]
    confidence = None
    if hasattr(disease_model, "predict_proba"):
        probs = disease_model.predict_proba([payload.symptoms])[0]
        confidence = float(max(probs))

    return {
        "predicted_disease": pred,
        "confidence": confidence,
        "recommended_tests": ["CBC", "Urinalysis", "Basic metabolic panel"]
    }


def _prepare_payment_dataframe(records):
    df = pd.DataFrame(records)
    if df.empty:
        return df

    df["created_at"] = pd.to_datetime(df.get("created_at"), errors="coerce")
    df["appointment_date"] = pd.to_datetime(df.get("appointment_date"), errors="coerce")
    df["amount"] = pd.to_numeric(df.get("amount"), errors="coerce").fillna(0)
    df["payment_method"] = df.get("payment_method", pd.Series(dtype="object")).fillna("unknown")
    df["payment_provider"] = df.get("payment_provider", pd.Series(dtype="object")).fillna("unknown")
    df["appointment_status"] = df.get("appointment_status", pd.Series(dtype="object")).fillna("unknown")
    df["payment_status"] = df.get("payment_status", pd.Series(dtype="object")).fillna("unknown")
    df["day_of_week"] = df["created_at"].dt.day_name().fillna("Unknown")
    df["month_name"] = df["created_at"].dt.month_name().fillna("Unknown")
    df["month"] = df["created_at"].dt.month.fillna(0).astype(int)
    df["hour"] = df["created_at"].dt.hour.fillna(0).astype(int)
    return df


def _predict_success_rates(df):
    if df.empty:
        return {"recommended_method": None, "recommended_provider": None, "average_probability": None}

    artifact = payment_artifact or {}
    model = artifact.get("model") if isinstance(artifact, dict) else None
    metadata = artifact.get("metadata", {}) if isinstance(artifact, dict) else {}

    feature_frame = df[["amount", "payment_method", "payment_provider", "appointment_status", "day_of_week", "month", "hour"]].copy()

    if model is not None:
        probabilities = model.predict_proba(feature_frame)[:, 1]
        df = df.copy()
        df["success_probability"] = probabilities
    else:
        method_rates = metadata.get("success_rate_by_method", {})
        provider_rates = metadata.get("success_rate_by_provider", {})
        df = df.copy()
        df["success_probability"] = df.apply(
            lambda row: float(
                provider_rates.get(row["payment_provider"])
                or method_rates.get(row["payment_method"])
                or 0.5
            ),
            axis=1
        )

    provider_summary = (
        df.groupby("payment_provider", dropna=False)["success_probability"]
        .mean()
        .sort_values(ascending=False)
    )
    method_summary = (
        df.groupby("payment_method", dropna=False)["success_probability"]
        .mean()
        .sort_values(ascending=False)
    )

    return {
        "average_probability": float(df["success_probability"].mean()),
        "recommended_method": method_summary.index[0] if not method_summary.empty else None,
        "recommended_provider": provider_summary.index[0] if not provider_summary.empty else None,
        "by_method": [
            {"payment_method": str(name), "success_probability": float(value)}
            for name, value in method_summary.head(5).items()
        ],
        "by_provider": [
            {"payment_provider": str(name), "success_probability": float(value)}
            for name, value in provider_summary.head(5).items()
        ]
    }


def _build_insights(records, vet_id=None):
    df = _prepare_payment_dataframe(records)
    if df.empty:
        return {
            "demand_forecast": {"busiest_day": None, "busiest_month": None, "top_vets": [], "frequent_farmers": [], "expected_next_period_consultations": 0},
            "payment_success": {"recommended_method": None, "recommended_provider": None, "average_probability": None, "by_method": [], "by_provider": []},
            "earnings_prediction": {"vet_id": vet_id, "predicted_next_period_earnings": 0, "recent_paid_total": 0},
            "farmer_segments": []
        }

    demand_frame = df.copy()
    if vet_id is not None:
        demand_frame = demand_frame[demand_frame["vet_id"] == vet_id]

    day_counts = demand_frame["day_of_week"].value_counts()
    month_counts = demand_frame["month_name"].value_counts()
    top_vets = (
        df.groupby("vet_id", dropna=False)
        .size()
        .sort_values(ascending=False)
        .head(5)
    )
    frequent_farmers = (
        df.groupby("farmer_id", dropna=False)
        .size()
        .sort_values(ascending=False)
        .head(5)
    )

    paid_df = df[df["payment_status"].astype(str).str.lower() == "paid"].copy()
    if vet_id is not None:
        paid_df = paid_df[paid_df["vet_id"] == vet_id]

    monthly_paid = (
        paid_df.assign(month_period=paid_df["created_at"].dt.to_period("M").astype(str))
        .groupby("month_period", dropna=False)["amount"]
        .sum()
        .sort_index()
    )
    predicted_earnings = float(monthly_paid.tail(3).mean()) if not monthly_paid.empty else 0.0
    expected_consultations = int(round(demand_frame.groupby(demand_frame["created_at"].dt.to_period("M")).size().tail(3).mean())) if not demand_frame.empty else 0

    farmer_summary = (
        df.groupby("farmer_id", dropna=False)
        .agg(total_payments=("payment_status", "size"), paid_payments=("payment_status", lambda values: int((values.astype(str).str.lower() == "paid").sum())))
        .reset_index()
    )
    farmer_summary["segment"] = farmer_summary.apply(
        lambda row: "frequent" if row["total_payments"] >= 5 else ("occasional" if row["total_payments"] >= 2 else "inactive"),
        axis=1
    )

    return {
        "demand_forecast": {
            "busiest_day": day_counts.index[0] if not day_counts.empty else None,
            "busiest_month": month_counts.index[0] if not month_counts.empty else None,
            "top_vets": [{"vet_id": None if pd.isna(key) else int(key), "consultation_count": int(value)} for key, value in top_vets.items()],
            "frequent_farmers": [{"farmer_id": None if pd.isna(key) else int(key), "payment_count": int(value)} for key, value in frequent_farmers.items()],
            "expected_next_period_consultations": expected_consultations
        },
        "payment_success": _predict_success_rates(df),
        "earnings_prediction": {
            "vet_id": vet_id,
            "predicted_next_period_earnings": round(predicted_earnings, 2),
            "recent_paid_total": round(float(paid_df["amount"].sum()) if not paid_df.empty else 0.0, 2)
        },
        "farmer_segments": farmer_summary[["farmer_id", "segment", "total_payments", "paid_payments"]].to_dict(orient="records")
    }


@app.post("/payments/insights")
def payment_insights(payload: PaymentInsightRequest):
    return _build_insights([record.model_dump() for record in payload.records], payload.vet_id)


@app.post("/payments/recommend-vets")
def recommend_vets(payload: VetRecommendationRequest):
    payment_df = pd.DataFrame([payment.model_dump() for payment in payload.payments])
    vet_df = pd.DataFrame([vet.model_dump() for vet in payload.vets])

    if vet_df.empty:
        return []

    if payment_df.empty:
        payment_df = pd.DataFrame(columns=["farmer_id", "vet_id", "payment_status", "payment_method", "payment_provider"])

    farmer_paid = payment_df[
        (payment_df.get("farmer_id") == payload.farmer_id)
        & (payment_df.get("payment_status", pd.Series(dtype="object")).astype(str).str.lower() == "paid")
    ].copy()

    paid_counts = farmer_paid.groupby("vet_id").size().to_dict() if not farmer_paid.empty else {}
    favorite_provider = None
    favorite_method = None
    if not farmer_paid.empty:
        provider_counts = farmer_paid.groupby("payment_provider").size().sort_values(ascending=False)
        method_counts = farmer_paid.groupby("payment_method").size().sort_values(ascending=False)
        favorite_provider = provider_counts.index[0] if not provider_counts.empty else None
        favorite_method = method_counts.index[0] if not method_counts.empty else None

    recommendations = []
    for vet in payload.vets:
        prior_paid = int(paid_counts.get(vet.vet_id, 0))
        average_rating = float(vet.average_rating or 0)
        review_count = int(vet.review_count or 0)
        score = prior_paid * 4 + average_rating * 2 + min(review_count, 5) * 0.25
        reasons = []
        if prior_paid > 0:
            reasons.append(f"You have {prior_paid} paid consultation(s) with this vet.")
        if average_rating > 0:
            reasons.append(f"Rated {average_rating:.1f}/5 by farmers.")
        if vet.specialization:
            reasons.append(f"Specialization: {vet.specialization}.")
        if favorite_provider:
            reasons.append(f"Aligned with your common payment preference: {favorite_provider}{f' via {favorite_method}' if favorite_method else ''}.")

        recommendations.append({
            "vet_id": vet.vet_id,
            "user_id": vet.user_id,
            "vet_name": vet.vet_name,
            "specialization": vet.specialization,
            "average_rating": average_rating or None,
            "review_count": review_count,
            "prior_paid_consultations": prior_paid,
            "score": round(score, 2),
            "reasons": reasons[:3]
        })

    recommendations.sort(key=lambda item: item["score"], reverse=True)
    return recommendations[:5]
