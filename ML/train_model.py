import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier

DATA_PATH = os.path.join("ML", "data", "cases_export.csv")
MODEL_DIR = os.path.join("ML", "artifacts")
MODEL_PATH = os.path.join(MODEL_DIR, "disease_model.pkl")


def build_label(row):
    # Placeholder target for prototype:
    # map status + priority into a pseudo disease class.
    status = str(row.get("status", "")).strip().lower()
    priority = str(row.get("priority", "")).strip().lower()
    return f"{status}_{priority}" if status or priority else "unknown"


def main():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found: {DATA_PATH}")

    df = pd.read_csv(DATA_PATH).fillna("")
    df["symptom_text"] = (
        df["symptoms"].astype(str) + " " +
        df["description"].astype(str) + " " +
        df["lab_result"].astype(str) + " " +
        df["medicine"].astype(str)
    )
    df["label"] = df.apply(build_label, axis=1)

    X = df["symptom_text"]
    y = df["label"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    dt_pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(max_features=5000)),
        ("model", DecisionTreeClassifier(random_state=42))
    ])
    dt_pipeline.fit(X_train, y_train)
    dt_pred = dt_pipeline.predict(X_test)
    dt_acc = accuracy_score(y_test, dt_pred)

    rf_pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(max_features=5000)),
        ("model", RandomForestClassifier(n_estimators=200, random_state=42))
    ])
    rf_pipeline.fit(X_train, y_train)
    rf_pred = rf_pipeline.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_pred)

    best_model = rf_pipeline if rf_acc >= dt_acc else dt_pipeline
    best_name = "random_forest" if rf_acc >= dt_acc else "decision_tree"
    best_pred = rf_pred if rf_acc >= dt_acc else dt_pred

    print(f"Decision Tree accuracy: {dt_acc:.4f}")
    print(f"Random Forest accuracy: {rf_acc:.4f}")
    print(f"Selected model: {best_name}")
    print(classification_report(y_test, best_pred))

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(best_model, MODEL_PATH)
    print(f"Saved model to {MODEL_PATH}")


if __name__ == "__main__":
    main()
