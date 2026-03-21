import React, { useEffect, useMemo, useState } from "react";
import DashboardSection from "../../components/dashboard/DashboardSection";
import api from "../../services/api";

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
  const [payload, setPayload] = useState({ vet: null, summary: null, reviews: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await api.get("/vets/my/reviews");
        setPayload(response.data?.data || { vet: null, summary: null, reviews: [] });
      } catch (error) {
        console.error("Error fetching vet ratings:", error);
        setPayload({ vet: null, summary: null, reviews: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    return (payload.reviews || []).filter((review) => {
      const rating = Number(review.rating) || 0;
      if (filter === "positive") return rating >= 4;
      if (filter === "critical") return rating <= 3;
      return true;
    });
  }, [filter, payload.reviews]);

  return (
    <DashboardSection title="Vet Ratings">
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <small className="text-uppercase text-muted">Average Rating</small>
              <h3 className="fw-bold mt-2 mb-2">
                {payload.summary?.average_rating ? Number(payload.summary.average_rating).toFixed(1) : "-"}
              </h3>
              <div className="d-flex gap-1">{renderStars(Math.round(Number(payload.summary?.average_rating) || 0))}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <small className="text-uppercase text-muted">Total Reviews</small>
              <h3 className="fw-bold mt-2 mb-0">{payload.summary?.review_count || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <small className="text-uppercase text-muted">Veterinarian</small>
              <h5 className="fw-bold mt-2 mb-0">{payload.vet?.name || "Unknown Vet"}</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 d-flex gap-2">
        <button className={`btn btn-sm ${filter === "all" ? "btn-brown" : "btn-outline-brown"}`} onClick={() => setFilter("all")}>All</button>
        <button className={`btn btn-sm ${filter === "positive" ? "btn-brown" : "btn-outline-brown"}`} onClick={() => setFilter("positive")}>Positive</button>
        <button className={`btn btn-sm ${filter === "critical" ? "btn-brown" : "btn-outline-brown"}`} onClick={() => setFilter("critical")}>Critical</button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="row g-4">
          {filteredReviews.length === 0 ? (
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body py-5 text-center text-muted">No ratings found.</div>
              </div>
            </div>
          ) : filteredReviews.map((review) => (
            <div key={review.id} className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <strong>{review.farmer_name || "Anonymous user"}</strong>
                    <div className="d-flex gap-1">{renderStars(review.rating)}</div>
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
    </DashboardSection>
  );
}
