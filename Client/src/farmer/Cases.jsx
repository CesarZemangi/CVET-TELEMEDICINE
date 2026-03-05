import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCases, addCase } from "./services/farmer.cases.service";
import api from "../services/api";
import { predictDiagnosis } from "../services/aiPrediction.service";
import CaseDetailsModal from "../components/dashboard/CaseDetailsModal";
import FormModalWrapper from "../components/common/FormModalWrapper";

export default function Cases() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [selectedVetReviews, setSelectedVetReviews] = useState([]);
  const [loadingVetReviews, setLoadingVetReviews] = useState(false);
  
  const [formData, setFormData] = useState({
    animal_id: "",
    vet_id: "",
    title: "",
    description: "",
    symptoms: "",
    priority: "medium"
  });

  const selectedVet = vets.find((vet) => String(vet.id) === String(formData.vet_id));

  const formatVetRating = (vet) => {
    const average = Number(vet?.average_rating);
    const reviewCount = Number(vet?.review_count) || 0;

    if (!Number.isFinite(average) || reviewCount === 0) {
      return "No ratings yet";
    }

    return `Rating ${average.toFixed(2)}/5 (${reviewCount} review${reviewCount === 1 ? "" : "s"})`;
  };

  const renderRatingStars = (rating) => {
    const safeRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return (
      <span className="text-warning">
        {[1, 2, 3, 4, 5].map((n) => (
          <i
            key={`star-${n}`}
            className={`bi ${n <= safeRating ? "bi-star-fill" : "bi-star"} me-1`}
          ></i>
        ))}
      </span>
    );
  };

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await getCases();
      const casesArray = data?.data || data?.rows || (Array.isArray(data) ? data : []);
      setCases(casesArray);
    } catch (err) {
      console.error("Error fetching farmer cases:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimals = async () => {
    try {
      const res = await api.get("/farmer/animals");
      const result = res.data?.data;
      setAnimals(Array.isArray(result?.data) ? result.data : (Array.isArray(result) ? result : []));
    } catch (err) {
      console.error("Error fetching animals:", err);
    }
  };

  const fetchVets = async () => {
    try {
      const res = await api.get("/vets");
      const result = res.data?.data;
      setVets(Array.isArray(result) ? result : (Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error("Error fetching vets:", err);
    }
  };

  const fetchVetReviews = async (vetId) => {
    if (!vetId) {
      setSelectedVetReviews([]);
      return;
    }

    try {
      setLoadingVetReviews(true);
      const res = await api.get(`/vets/${vetId}/reviews`);
      const reviews = res.data?.data?.reviews;
      setSelectedVetReviews(Array.isArray(reviews) ? reviews : []);
    } catch (err) {
      console.error("Error fetching vet reviews:", err);
      setSelectedVetReviews([]);
    } finally {
      setLoadingVetReviews(false);
    }
  };

  useEffect(() => {
    fetchCases();
    fetchAnimals();
    fetchVets();
  }, []);

  useEffect(() => {
    fetchVetReviews(selectedVet?.id);
  }, [selectedVet?.id]);

  const handleViewCase = (caseData) => {
    setSelectedCase(caseData);
    setIsModalOpen(true);
  };

  const handleMessageVet = (c) => {
    if (!c.vet_id || !c.vet) {
      alert("No vet assigned to this case.");
      return;
    }
    navigate("/farmerdashboard/communication/messages", { 
      state: { 
        initialPartner: {
          id: c.vet.user_id,
          name: c.vet.name,
          role: 'vet'
        },
        initialCaseId: c.id 
      } 
    });
  };

  const handleAddCase = async (e) => {
    e.preventDefault();
    try {
      await addCase(formData);
      setShowAddModal(false);
      setFormData({
        animal_id: "",
        vet_id: "",
        title: "",
        description: "",
        symptoms: "",
        priority: "medium"
      });
      setAiResult(null);
      setAiError("");
      setTimeout(() => {
        fetchCases();
      }, 500);
      alert("Case reported successfully!");
    } catch (err) {
      alert("Failed to report case: " + (err.response?.data?.error || err.message));
    }
  };

  const handlePredict = async () => {
    const symptomsText = String(formData.symptoms || formData.description || "").trim();
    if (!symptomsText) {
      setAiError("Please enter symptoms first.");
      setAiResult(null);
      return;
    }

    setAiLoading(true);
    setAiError("");
    setAiResult(null);
    try {
      const prediction = await predictDiagnosis(symptomsText);
      setAiResult(prediction);
    } catch (err) {
      setAiError(err.response?.data?.error || err.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="container-fluid px-4 py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-1">Health Cases</h4>
          <small className="text-muted">
            Report animal health issues and select a veterinarian for care
          </small>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Report New Case
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Title</th>
                    <th>Animal</th>
                    <th>Assigned Vet</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {cases.length > 0 ? cases.map(c => (
                    <tr key={c.id}>
                      <td className="ps-4 fw-medium">{c.title}</td>
                      <td>{c.Animal?.tag_number || c.animal_id}</td>
                      <td>{c.vet?.name || "N/A"}</td>
                      <td>
                        <span className={`badge ${
                          c.priority === 'critical' ? 'bg-danger' : 
                          c.priority === 'high' ? 'bg-warning text-dark' : 
                          c.priority === 'medium' ? 'bg-info text-dark' : 'bg-secondary'
                        }`}>
                          {c.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${c.status === 'open' ? 'bg-warning text-dark' : 'bg-success'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        {c.vet_id && (
                          <button 
                            className="btn btn-sm btn-outline-brown me-2"
                            onClick={() => handleMessageVet(c)}
                          >
                            <i className="bi bi-chat-dots me-1"></i>
                            Message Vet
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewCase(c)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" className="text-center py-4 text-muted">No cases found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      <CaseDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        caseData={selectedCase} 
      />

      {/* Report Case Modal */}
      <FormModalWrapper
        show={showAddModal}
        title="Report New Health Case"
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCase}
        submitLabel="Submit Case"
      >
        <div className="mb-3">
          <label className="form-label small fw-bold">Select Animal</label>
          <select
            className="form-select"
            required
            value={formData.animal_id}
            onChange={e => setFormData({...formData, animal_id: e.target.value})}
          >
            <option value="">Choose an animal...</option>
            {animals.map(animal => (
              <option key={animal.id} value={animal.id}>
                {animal.tag_number} ({animal.species})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Select Veterinarian</label>
          <select
            className="form-select"
            required
            value={formData.vet_id}
            onChange={e => setFormData({...formData, vet_id: e.target.value})}
          >
            <option value="">Choose a vet...</option>
            {vets.map(vet => (
              <option key={vet.id} value={vet.id}>
                Dr. {vet.name} - {formatVetRating(vet)}
              </option>
            ))}
          </select>
        </div>

        {selectedVet && (
          <div className="mb-3 border rounded-3 p-3 bg-light">
            <div className="fw-bold mb-1">Selected Vet Profile</div>
            <div className="small text-muted mb-2">
              Dr. {selectedVet.name} | {formatVetRating(selectedVet)}
            </div>
            <div className="small mb-2 d-flex align-items-center gap-2">
              {renderRatingStars(selectedVet.average_rating)}
              <span className="text-muted">({selectedVet.review_count || 0} reviews)</span>
            </div>
            {loadingVetReviews ? (
              <div className="small text-muted">Loading reviews...</div>
            ) : Array.isArray(selectedVetReviews) && selectedVetReviews.length > 0 ? (
              <div>
                <div className="small fw-semibold mb-1">Comments</div>
                {selectedVetReviews.map((item, index) => (
                  <div key={`${selectedVet.id}-comment-${index}`} className="small mb-1">
                    <span className="me-2">{renderRatingStars(item.rating)}</span>
                    "{item.comment}"
                  </div>
                ))}
              </div>
            ) : (
              <div className="small text-muted">No comments available yet.</div>
            )}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label small fw-bold">Case Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Short summary of the issue"
            required
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Detailed Description</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Provide more details about the problem"
            required
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Symptoms</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="e.g. fever, reduced appetite, swollen udder"
            value={formData.symptoms}
            onChange={e => setFormData({...formData, symptoms: e.target.value})}
          ></textarea>
          <small className="text-muted">Used for AI advisory diagnosis support.</small>
        </div>

        <div className="mb-3">
          <button type="button" className="btn btn-outline-primary" onClick={handlePredict} disabled={aiLoading}>
            {aiLoading ? "Predicting..." : "Predict Diagnosis"}
          </button>
        </div>

        {aiError && (
          <div className="alert alert-danger py-2">{aiError}</div>
        )}

        {aiResult && (
          <div className="border rounded p-3 mb-3 bg-light">
            <h6 className="fw-bold mb-2">AI Prediction</h6>
            <p className="mb-1"><strong>Predicted Disease:</strong> {aiResult.predicted_disease || "N/A"}</p>
            <p className="mb-1"><strong>Confidence:</strong> {aiResult.confidence != null ? `${(aiResult.confidence * 100).toFixed(1)}%` : "N/A"}</p>
            <p className="mb-1"><strong>Suggested Tests:</strong></p>
            <ul className="mb-2">
              {(aiResult.suggested_tests || aiResult.recommended_tests || []).map((test, idx) => (
                <li key={`case-ai-test-${idx}`}>{test}</li>
              ))}
            </ul>
            <p className="mb-2"><strong>Suggested Medication:</strong> {aiResult.suggested_medication || "N/A"}</p>
            <div className="alert alert-warning mb-0 py-2">
              Advisory only. This does not replace vet clinical judgment and is not auto-saved.
            </div>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label small fw-bold">Priority Level</label>
          <select
            className="form-select"
            value={formData.priority}
            onChange={e => setFormData({...formData, priority: e.target.value})}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </FormModalWrapper>
    </div>
  );
}
