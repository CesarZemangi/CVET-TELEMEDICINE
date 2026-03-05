import { useEffect, useState } from "react";
import { predictDiagnosis } from "../../services/aiPrediction.service";
import { getCasesForDropdown } from "../services/vet.cases.service";
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function AiPredictor() {
  const [symptoms, setSymptoms] = useState("");
  const [caseId, setCaseId] = useState("");
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await getCasesForDropdown();
        const caseList = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
        setCases(caseList);
      } catch (err) {
        console.error("Failed to load vet cases for AI predictor:", err);
      }
    };
    fetchCases();
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!symptoms.trim()) {
      setError("Please enter symptoms.");
      return;
    }
    setLoading(true);
    try {
      const prediction = await predictDiagnosis({
        symptoms,
        case_id: caseId ? Number(caseId) : null
      });
      setResult(prediction);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardSection title="AI Disease Predictor">
      <p className="text-muted">
        Enter symptoms to get an advisory prediction. Final diagnosis must be made by the veterinarian.
      </p>
      <form onSubmit={handlePredict} className="card border-0 shadow-sm p-3">
        <label className="form-label small fw-bold">Symptoms</label>
        <textarea
          className="form-control mb-3"
          rows="4"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g. fever, loss of appetite, nasal discharge..."
        />
        <label className="form-label small fw-bold">Select Case</label>
        <select
          className="form-select mb-3"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
        >
          <option value="">Choose case ID...</option>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              #{c.id} {c.title ? `- ${c.title}` : ""}
            </option>
          ))}
        </select>
        <button className="btn btn-primary align-self-start" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {result && (
        <div className="card border-0 shadow-sm mt-3 p-3">
          <h6 className="fw-bold mb-2">AI Prediction</h6>
          <p className="mb-1"><strong>Predicted Disease:</strong> {result.predicted_disease || "N/A"}</p>
          <p className="mb-1"><strong>Confidence:</strong> {result.confidence != null ? `${(result.confidence * 100).toFixed(1)}%` : "N/A"}</p>
          <p className="mb-1"><strong>Suggested Tests:</strong></p>
          <ul className="mb-2">
            {(result.suggested_tests || result.recommended_tests || []).map((t, i) => <li key={`test-${i}`}>{t}</li>)}
          </ul>
          <p className="mb-2"><strong>Suggested Medication:</strong> {result.suggested_medication || "N/A"}</p>
          <div className="alert alert-warning mb-0 py-2">
            Advisory only. This prediction does not replace veterinary clinical judgment.
          </div>
        </div>
      )}
    </DashboardSection>
  );
}
