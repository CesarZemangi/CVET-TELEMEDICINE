import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import DashboardSection from "../../components/dashboard/DashboardSection";
import FormModalWrapper from "../../components/common/FormModalWrapper";

const INITIAL_FORM = {
  vet_id: "",
  rating_value: 5,
  comment: ""
};

const renderStars = (rating) => {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  return [...Array(5)].map((_, index) => (
    <i
      key={index}
      className={`bi ${index < safeRating ? "bi-star-fill text-warning" : "bi-star text-muted"}`}
    />
  ));
};

export default function Feedback() {
  const [vets, setVets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const existingReviewByVetId = useMemo(
    () => new Map(reviews.map((review) => [String(review.vet_id), review])),
    [reviews]
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vetsRes, reviewsRes] = await Promise.all([
        api.get("/vets"),
        api.get("/vets/my/submitted-reviews")
      ]);

      const vetRows = vetsRes.data?.data || vetsRes.data || [];
      const reviewRows = reviewsRes.data?.data || reviewsRes.data || [];
      setVets(Array.isArray(vetRows) ? vetRows : []);
      setReviews(Array.isArray(reviewRows) ? reviewRows : []);
    } catch (error) {
      console.error("Error fetching vet ratings data:", error);
      setVets([]);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVetChange = (event) => {
    const vetId = event.target.value;
    const existing = existingReviewByVetId.get(vetId);

    setFormData({
      vet_id: vetId,
      rating_value: existing?.rating || 5,
      comment: existing?.comment || ""
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.vet_id) {
      alert("Select a vet first.");
      return;
    }

    try {
      setSaving(true);
      await api.post(`/vets/${formData.vet_id}/reviews`, {
        rating_value: formData.rating_value,
        comment: formData.comment
      });
      setShowModal(false);
      setFormData(INITIAL_FORM);
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || "Failed to submit rating.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardSection title="Vet Ratings">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0 text-muted">Rate veterinarians you have worked with and update your comments any time.</p>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-star-fill me-1" />
          Rate a Vet
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="row g-4">
          {reviews.length === 0 ? (
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body py-5 text-center text-muted">
                  No vet ratings submitted yet.
                </div>
              </div>
            </div>
          ) : reviews.map((review) => (
            <div key={review.id} className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold mb-1">{review.vet_name}</h6>
                      <div className="d-flex gap-1">{renderStars(review.rating)}</div>
                    </div>
                    <span className="badge bg-light text-dark border">Your rating</span>
                  </div>
                  <p className="text-muted mb-3">{review.comment}</p>
                  <small className="text-muted">
                    {review.created_at ? new Date(review.created_at).toLocaleString() : ""}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModalWrapper
        show={showModal}
        title="Rate Veterinarian"
        onClose={() => {
          setShowModal(false);
          setFormData(INITIAL_FORM);
        }}
        onSubmit={handleSubmit}
        submitLabel={saving ? "Saving..." : "Save Rating"}
      >
        <div className="mb-3">
          <label className="form-label fw-bold small">Veterinarian</label>
          <select className="form-select" value={formData.vet_id} onChange={handleVetChange} required>
            <option value="">Choose a vet...</option>
            {vets.map((vet) => (
              <option key={vet.id} value={vet.id}>
                {vet.name} {vet.specialization ? `- ${vet.specialization}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold small">Rating</label>
          <div className="d-flex gap-3 flex-wrap">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="form-check-label d-flex align-items-center gap-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="rating_value"
                  checked={Number(formData.rating_value) === value}
                  onChange={() => setFormData((current) => ({ ...current, rating_value: value }))}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold small">Comment</label>
          <textarea
            className="form-control"
            rows="4"
            value={formData.comment}
            onChange={(event) => setFormData((current) => ({ ...current, comment: event.target.value }))}
            placeholder="Describe your experience with this vet."
            required
          />
        </div>
      </FormModalWrapper>
    </DashboardSection>
  );
}
