import os
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

DATA_PATH = os.path.join("ML", "data", "payments_export.csv")
MODEL_DIR = os.path.join("ML", "artifacts")
MODEL_PATH = os.path.join(MODEL_DIR, "payment_model.pkl")


def _safe_mode(series, default_value):
    if series.empty:
        return default_value
    mode = series.mode(dropna=True)
    if mode.empty:
        return default_value
    return mode.iloc[0]


def main():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found: {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    if df.empty:
      raise ValueError("payments_export.csv is empty")

    df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")
    df["appointment_date"] = pd.to_datetime(df["appointment_date"], errors="coerce")
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
    df["payment_method"] = df["payment_method"].fillna("unknown")
    df["payment_provider"] = df["payment_provider"].fillna("unknown")
    df["appointment_status"] = df["appointment_status"].fillna("unknown")
    df["day_of_week"] = df["created_at"].dt.day_name().fillna("Unknown")
    df["month"] = df["created_at"].dt.month.fillna(0).astype(int)
    df["hour"] = df["created_at"].dt.hour.fillna(0).astype(int)
    df["target"] = (df["payment_status"].astype(str).str.lower() == "paid").astype(int)

    features = ["amount", "payment_method", "payment_provider", "appointment_status", "day_of_week", "month", "hour"]
    X = df[features]
    y = df["target"]

    numerical_features = ["amount", "month", "hour"]
    categorical_features = ["payment_method", "payment_provider", "appointment_status", "day_of_week"]

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "num",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="median")),
                        ("scaler", StandardScaler())
                    ]
                ),
                numerical_features
            ),
            (
                "cat",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="most_frequent")),
                        ("encoder", OneHotEncoder(handle_unknown="ignore"))
                    ]
                ),
                categorical_features
            )
        ]
    )

    model = None
    accuracy = None
    if y.nunique() > 1 and len(df) >= 8:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.25, random_state=42, stratify=y
        )
        model = Pipeline(
            steps=[
                ("preprocessor", preprocessor),
                ("classifier", LogisticRegression(max_iter=1000))
            ]
        )
        model.fit(X_train, y_train)
        accuracy = float(accuracy_score(y_test, model.predict(X_test)))

    paid_df = df[df["target"] == 1].copy()
    monthly_revenue = (
        paid_df.assign(month_period=paid_df["created_at"].dt.to_period("M").astype(str))
        .groupby(["vet_id", "month_period"], dropna=False)["amount"]
        .sum()
        .reset_index()
    )

    revenue_by_vet = {}
    if not monthly_revenue.empty:
        revenue_by_vet = (
            monthly_revenue.groupby("vet_id")["amount"]
            .mean()
            .round(2)
            .to_dict()
        )

    artifact = {
        "model": model,
        "metadata": {
            "trained_at": pd.Timestamp.utcnow().isoformat(),
            "rows": int(len(df)),
            "accuracy": accuracy,
            "default_amount": float(df["amount"].median()) if not df["amount"].empty else 0.0,
            "default_method": _safe_mode(df["payment_method"], "unknown"),
            "default_provider": _safe_mode(df["payment_provider"], "unknown"),
            "default_status": _safe_mode(df["appointment_status"], "unknown"),
            "default_day_of_week": _safe_mode(df["day_of_week"], "Unknown"),
            "revenue_by_vet": revenue_by_vet,
            "success_rate_by_method": (
                df.groupby("payment_method")["target"].mean().round(4).to_dict()
            ),
            "success_rate_by_provider": (
                df.groupby("payment_provider")["target"].mean().round(4).to_dict()
            )
        }
    }

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(artifact, MODEL_PATH)
    print(f"Saved payment artifact to {MODEL_PATH}")
    print(f"Rows: {len(df)}")
    print(f"Accuracy: {accuracy if accuracy is not None else 'insufficient class variety'}")


if __name__ == "__main__":
    main()
