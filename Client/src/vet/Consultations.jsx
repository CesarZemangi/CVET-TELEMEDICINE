import React, { useState, useEffect } from "react";
import { getVetConsultations, createConsultation } from "../services/consultation";
import { getCasesForDropdown } from "./services/vet.cases.service";
import FormModalWrapper from "../components/common/FormModalWrapper";
import { predictDiagnosis } from "../services/aiPrediction.service";

export default function VetConsultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cases, setCases] = useState([]);
  const [formData, setFormData] = useState({
    case_id: "",
    mode: "chat",
    notes: ""
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiResult, setAiResult] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const [consRes, casesRes] = await Promise.allSettled([
      getVetConsultations(),
      getCasesForDropdown()
    ]);

    if (consRes.status === "fulfilled") {
      const consData = consRes.value;
      setConsultations(consData?.data || consData || []);
    } else {
      setConsultations([]);
      console.error("Error fetching consultations:", consRes.reason);
    }

    if (casesRes.status === "fulfilled") {
      const casesDropdown = casesRes.value;
      setCases(Array.isArray(casesDropdown?.data) ? casesDropdown.data : (Array.isArray(casesDropdown) ? casesDropdown : []));
    } else {
      setCases([]);
      console.error("Error fetching cases for consultations:", casesRes.reason);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartConsultation = async (e) => {
    e.preventDefault();
    try {
      await createConsultation(formData);
      setShowModal(false);
      setFormData({ case_id: "", mode: "chat", notes: "" });
      setAiError("");
      setAiResult(null);
      fetchData();
    } catch (err) {
      alert("Failed to start consultation: " + (err.response?.data?.error || err.message));
    }
  };

  const handlePredictDiagnosis = async () => {
    const symptomsText = String(formData.notes || "").trim();
    if (!symptomsText) {
      setAiError("Enter notes/symptoms first.");
      setAiResult(null);
      return;
    }

    setAiLoading(true);
    setAiError("");
    setAiResult(null);
    try {
      const prediction = await predictDiagnosis({
        symptoms: symptomsText,
        case_id: formData.case_id || null
      });
      setAiResult(prediction);
    } catch (err) {
      setAiError(err.response?.data?.error || err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const getCaseOptionLabel = (c) => {
    const shortDesc = c?.description ? String(c.description).trim().slice(0, 50) : "";
    const descriptionPart = shortDesc ? ` - ${shortDesc}${shortDesc.length === 50 ? "..." : ""}` : "";
    return `#${c.id} ${c.title || "Untitled Case"}${descriptionPart} (Status: ${c.status || "n/a"})`;
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-1">Consultations</h4>
          <small className="text-muted">Ongoing animal health consultations</small>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-2"></i> Start Consultation
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Case ID</th>
                  <th>Farmer</th>
                  <th>Animal</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4"><div className="spinner-border text-primary"></div></td></tr>
                ) : consultations.length > 0 ? consultations.map(c => (
                  <tr key={c.id}>
                    <td className="ps-4 fw-bold">#C{c.case_id}</td>
                    <td>{c.Case?.farmer?.name || 'N/A'}</td>
                    <td>{c.Case?.animal?.species || 'N/A'}</td>
                    <td className="text-capitalize">{c.mode}</td>
                    <td><span className="badge bg-success">Active</span></td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-primary me-2">Continue</button>
                      <button className="btn btn-sm btn-outline-secondary">Notes</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-4 text-muted">No active consultations</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FormModalWrapper
        show={showModal}
        title="Start New Consultation"
        onClose={() => setShowModal(false)}
        onSubmit={handleStartConsultation}
        submitLabel="Start"
      >
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Assigned Case</label>
                    <select 
                      className="form-select" 
                      required 
                      value={formData.case_id}
                      onChange={e => setFormData({...formData, case_id: e.target.value})}
                    >
                      <option value="">Select a case</option>
                      {cases.map(c => (
                        <option key={c.id} value={c.id}>
                          {getCaseOptionLabel(c)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Consultation Mode</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="mode" id="chat" value="chat" checked={formData.mode === 'chat'} onChange={e => setFormData({...formData, mode: e.target.value})} />
                        <label className="form-check-label" htmlFor="chat">Chat</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="mode" id="video" value="video" checked={formData.mode === 'video'} onChange={e => setFormData({...formData, mode: e.target.value})} />
                        <label className="form-check-label" htmlFor="video">Video</label>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Initial Notes (Optional)</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                      placeholder="Enter preliminary observations..."
                    ></textarea>
                    <small className="text-muted">Use notes as symptoms for AI advisory prediction.</small>
                  </div>
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={handlePredictDiagnosis}
                      disabled={aiLoading}
                    >
                      {aiLoading ? "Predicting..." : "Predict Diagnosis"}
                    </button>
                  </div>
                  {aiError && <div className="alert alert-danger py-2">{aiError}</div>}
                  {aiResult && (
                    <div className="border rounded p-3 mb-3 bg-light">
                      <h6 className="fw-bold mb-2">AI Prediction</h6>
                      <p className="mb-1"><strong>Predicted Disease:</strong> {aiResult.predicted_disease || "N/A"}</p>
                      <p className="mb-1"><strong>Confidence:</strong> {aiResult.confidence != null ? `${(aiResult.confidence * 100).toFixed(1)}%` : "N/A"}</p>
                      <p className="mb-1"><strong>Suggested Tests:</strong></p>
                      <ul className="mb-2">
                        {(aiResult.suggested_tests || aiResult.recommended_tests || []).map((test, idx) => (
                          <li key={`consult-ai-test-${idx}`}>{test}</li>
                        ))}
                      </ul>
                      <p className="mb-2"><strong>Suggested Medication:</strong> {aiResult.suggested_medication || "N/A"}</p>
                      <div className="alert alert-warning mb-0 py-2">
                        Advisory only. This does not replace veterinary clinical judgment and is not auto-saved.
                      </div>
                    </div>
                  )}
      </FormModalWrapper>
    </div>
  );
}
