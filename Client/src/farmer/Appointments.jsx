import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  getFarmerAppointments,
  createAppointmentRequest,
  cancelAppointment,
  getCasesForAppointments,
  getVetsForAppointments,
  joinAppointmentSession
} from "./services/farmer.appointments.service";
import FormModalWrapper from "../components/common/FormModalWrapper";
import { getFarmerVetRecommendations } from "../services/payment";

export default function Appointments() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [appointments, setAppointments] = useState([]);
  const [vets, setVets] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVetReviews, setSelectedVetReviews] = useState([]);
  const [loadingVetReviews, setLoadingVetReviews] = useState(false);
  const [recommendedVets, setRecommendedVets] = useState([]);
  const initialForm = {
    case_id: "",
    vet_id: "",
    appointment_date: "",
    appointment_time: "",
    notes: ""
  };
  const [formData, setFormData] = useState(initialForm);

  const selectedVet = vets.find((vet) => String(vet.id) === String(formData.vet_id));

  const fetchData = async () => {
    setLoading(true);
    setLoadError("");

    const [apptRes, vetsRes, casesRes, recsRes] = await Promise.allSettled([
      getFarmerAppointments({ includeDeleted: showArchived }),
      getVetsForAppointments(),
      getCasesForAppointments(),
      getFarmerVetRecommendations()
    ]);

    if (apptRes.status === "fulfilled") {
      setAppointments(Array.isArray(apptRes.value) ? apptRes.value : []);
    } else {
      setAppointments([]);
      console.error("Error fetching appointments:", apptRes.reason);
      setLoadError("Appointments could not be loaded. You can still create a new request below.");
    }

    if (vetsRes.status === "fulfilled") {
      setVets(Array.isArray(vetsRes.value) ? vetsRes.value : []);
    } else {
      setVets([]);
      console.error("Error fetching vets:", vetsRes.reason);
      setLoadError("Vet list failed to load. Refresh or sign in again.");
    }

    if (casesRes.status === "fulfilled") {
      setCases(Array.isArray(casesRes.value) ? casesRes.value : []);
    } else {
      setCases([]);
      console.error("Error fetching cases:", casesRes.reason);
      setLoadError("Case list failed to load. Ensure you have at least one case.");
    }

    if (recsRes.status === "fulfilled") {
      setRecommendedVets(Array.isArray(recsRes.value) ? recsRes.value : []);
    } else {
      setRecommendedVets([]);
      console.error("Error fetching vet recommendations:", recsRes.reason);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [showArchived]);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
    if (!formData.case_id || !formData.appointment_date || !formData.appointment_time) {
      alert("Please fill in all required fields");
      return;
    }
      const response = await createAppointmentRequest(formData);
      const appointmentId = response?.data?.id || response?.id;
      setShowAddModal(false);
      setFormData(initialForm);
      fetchData();
      if (appointmentId) {
        navigate(`/farmerdashboard/payments/${appointmentId}`);
        return;
      }
      alert("Appointment request created successfully!");
    } catch (err) {
      alert("Failed to create appointment: " + (err.response?.data?.error || err.message));
    }
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(id);
        fetchData();
        alert("Appointment cancelled successfully!");
      } catch (err) {
        alert("Failed to cancel appointment: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleJoinAppointment = async (id) => {
    try {
      const res = await joinAppointmentSession(id);
      const meetingId = res?.meeting_id;
      if (!meetingId) {
        alert("Meeting is not ready yet.");
        return;
      }
      const url = `https://meet.jit.si/cvet-${encodeURIComponent(meetingId)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      alert("Unable to join now: " + (err.response?.data?.error || err.message));
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "badge bg-warning text-dark";
      case "approved":
        return "badge bg-success";
      case "rejected":
        return "badge bg-danger";
      case "completed":
        return "badge bg-info";
      case "cancelled":
        return "badge bg-secondary";
      default:
        return "badge bg-secondary";
    }
  };

  const getCaseOptionLabel = (c) => {
    const shortDesc = c?.description ? String(c.description).trim().slice(0, 50) : "";
    const descriptionPart = shortDesc ? ` - ${shortDesc}${shortDesc.length === 50 ? "..." : ""}` : "";
    const vetName = c?.vet?.User?.name || c?.vet?.name ? ` (Vet: ${c?.vet?.User?.name || c?.vet?.name})` : "";
    return `#${c.id} ${c.title || "Untitled Case"}${descriptionPart}${vetName}`;
  };

  const getVetDisplayName = (vet) => vet?.User?.name || vet?.name || "Unknown";
  const getPaymentStatus = (appointment) => appointment?.Payment?.payment_status || "unpaid";
  const getDisplayStatus = (appointment) => {
    if (appointment?.status === "pending" && getPaymentStatus(appointment) !== "paid") {
      return "pending";
    }
    return appointment?.status || "pending";
  };
  const recommendedVetById = new Map(recommendedVets.map((item) => [String(item.vet_id), item]));

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
    fetchVetReviews(selectedVet?.id);
  }, [selectedVet?.id]);

  // When a case is selected, auto-bind the vet linked to that case
  useEffect(() => {
    const selectedCase = cases.find((c) => String(c.id) === String(formData.case_id));
    if (selectedCase) {
      const autoVetId = selectedCase.vet_id || selectedCase?.vet?.id;
      if (autoVetId && String(formData.vet_id) !== String(autoVetId)) {
        setFormData((prev) => ({ ...prev, vet_id: String(autoVetId) }));
      }
    } else if (formData.vet_id) {
      setFormData((prev) => ({ ...prev, vet_id: "" }));
    }
  }, [formData.case_id, cases]);

  const recommendedSelectedVet = selectedVet ? recommendedVetById.get(String(selectedVet.id)) : null;

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-1">Appointments</h4>
          <small className="text-muted">Schedule and manage veterinary appointments</small>
          <div className="small text-muted mt-1">
            SMS fallback: {user?.sms_opt_in && user?.phone ? "Enabled" : "Disabled"} {user?.phone ? "" : "(add phone in Settings)"}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Request Appointment
        </button>
      </div>

      <div className="d-flex align-items-center gap-3 mb-3">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="toggle-archived-appointments"
            checked={showArchived}
            onChange={() => setShowArchived((prev) => !prev)}
          />
          <label className="form-check-label small" htmlFor="toggle-archived-appointments">
            Show archived (soft-deleted/cancelled) appointments
          </label>
        </div>
      </div>

      {recommendedVets.length > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 className="fw-semibold mb-1">Recommended Vets</h6>
                <small className="text-muted">Based on your paid consultations, payment patterns, and vet ratings.</small>
              </div>
            </div>
            <div className="row g-3">
              {recommendedVets.slice(0, 3).map((item) => (
                <div className="col-lg-4" key={`recommended-vet-${item.vet_id}`}>
                  <div className="border rounded-3 p-3 h-100 bg-light-subtle">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <div className="fw-bold">Dr. {item.vet_name}</div>
                        <div className="small text-muted">{item.specialization || "General practice"}</div>
                      </div>
                      <span className="badge bg-success-subtle text-success">AI Match</span>
                    </div>
                    <div className="small mb-2">
                      {renderRatingStars(item.average_rating)}
                      <span className="text-muted ms-2">{item.average_rating ? `${Number(item.average_rating).toFixed(1)}/5` : "No rating yet"}</span>
                    </div>
                    <ul className="small text-muted ps-3 mb-3">
                      {(item.reasons || []).map((reason, index) => (
                        <li key={`recommended-reason-${item.vet_id}-${index}`}>{reason}</li>
                      ))}
                    </ul>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setFormData((current) => ({ ...current, vet_id: String(item.vet_id) }));
                        setShowAddModal(true);
                      }}
                    >
                      Choose This Vet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loadError && (
            <div className="alert alert-warning m-3 mb-0 py-2">
              {loadError}
            </div>
          )}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Case</th>
                    <th>Animal</th>
                    <th>Vet</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map(appt => (
                      <tr key={appt.id}>
                        <td className="ps-4 fw-medium">{appt.Case?.title}</td>
                        <td>
                          {appt.Case?.Animal?.tag_number} ({appt.Case?.Animal?.species})
                        </td>
                        <td>{appt.vet?.User?.name || "N/A"}</td>
                        <td>
                          {new Date(appt.appointment_date).toLocaleDateString()} at{" "}
                          {appt.appointment_time}
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            <span className={getStatusClass(getDisplayStatus(appt))}>{getDisplayStatus(appt)}</span>
                            <div className="small text-muted">Payment: {getPaymentStatus(appt)}</div>
                            {appt.deleted_at && (
                              <span className="badge bg-secondary">Archived</span>
                            )}
                          </div>
                        </td>
                        <td className="text-end pe-4">
                          {appt.status === "pending" && (
                            <>
                              <button
                                className="btn btn-sm btn-outline-danger me-2"
                                onClick={() => handleCancelAppointment(appt.id)}
                              >
                                <i className="bi bi-x-circle me-1"></i>
                                Cancel
                              </button>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => navigate(`/farmerdashboard/payments/${appt.id}`)}
                              >
                                <i className="bi bi-credit-card me-1"></i>
                                Pay
                              </button>
                            </>
                          )}
                          {appt.status === "approved" && (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleJoinAppointment(appt.id)}
                            >
                              <i className="bi bi-camera-video me-1"></i>
                              Join
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No appointments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <FormModalWrapper
        show={showAddModal}
        title="Request Appointment"
        onClose={() => {
          setShowAddModal(false);
          setFormData(initialForm);
        }}
        onSubmit={handleAddAppointment}
        submitLabel="Request Appointment"
      >
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Case</label>
                    <select
                      className="form-select"
                      required
                      disabled={cases.length === 0}
                      value={formData.case_id}
                      onChange={e => setFormData(prev => ({ ...prev, case_id: e.target.value }))}
                    >
                      <option value="">Choose a case...</option>
                      {cases.map(c => (
                        <option key={c.id} value={c.id}>
                          {getCaseOptionLabel(c)}
                        </option>
                      ))}
                    </select>
                    {cases.length === 0 && (
                      <small className="text-danger">No cases available. Create a case first.</small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Assigned Vet</label>
                    <input
                      className="form-control"
                      value={
                        selectedVet
                          ? `Dr. ${getVetDisplayName(selectedVet)}`
                          : "Select a case to auto-assign the linked vet"
                      }
                      disabled
                      readOnly
                    />
                  </div>

                  {selectedVet && (
                    <div className="mb-3 border rounded-3 p-3 bg-light">
                      <div className="fw-bold mb-1">Selected Vet Profile</div>
                      <div className="small text-muted mb-2">
                        Dr. {getVetDisplayName(selectedVet)} | {formatVetRating(selectedVet)}
                      </div>
                      {recommendedSelectedVet && (
                        <div className="alert alert-success py-2 small">
                          <div className="fw-semibold mb-1">AI Recommendation</div>
                          {(recommendedSelectedVet.reasons || []).map((reason, index) => (
                            <div key={`selected-vet-reason-${index}`}>{reason}</div>
                          ))}
                        </div>
                      )}
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

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={formData.appointment_date}
                        onChange={e =>
                          setFormData(prev => ({ ...prev, appointment_date: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Time</label>
                      <input
                        type="time"
                        className="form-control"
                        required
                        value={formData.appointment_time}
                        onChange={e =>
                          setFormData(prev => ({ ...prev, appointment_time: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Notes (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.notes}
                      onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add any additional notes..."
                    ></textarea>
                  </div>
      </FormModalWrapper>
    </div>
  );
}
