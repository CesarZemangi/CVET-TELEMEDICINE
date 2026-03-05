import React, { useEffect, useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
import api from "../../services/api"

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true)
        const res = await api.get("/vet/feedback/consultations")
        const data = res.data?.data || res.data || []
        setFeedbacks(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching feedback:", err)
        setFeedbacks([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  const filteredFeedbacks = feedbacks.filter((f) => {
    const rating = Number(f.rating) || 0
    if (filter === "all") return true
    if (filter === "positive") return rating >= 4
    if (filter === "critical") return rating <= 3
    return true
  })

  return (
    <DashboardSection title="Farmer Feedback">
      <p className="mb-3">View and manage feedback submitted after consultations:</p>

      <div className="mb-3 d-flex gap-2">
        <button
          className={`btn btn-sm ${filter === "all" ? "btn-brown" : "btn-outline-brown"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn btn-sm ${filter === "positive" ? "btn-brown" : "btn-outline-brown"}`}
          onClick={() => setFilter("positive")}
        >
          Positive (4-5)
        </button>
        <button
          className={`btn btn-sm ${filter === "critical" ? "btn-brown" : "btn-outline-brown"}`}
          onClick={() => setFilter("critical")}
        >
          Critical (1-3)
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <ul className="list-group">
          {filteredFeedbacks.map((f) => (
            <li key={f.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                {(f.farmer?.name || "Farmer")} - {(f.Case?.title || `Case #${f.case_id}`)} - {f.comments}
              </span>
              <small className="text-muted">
                {`Rating ${Number(f.rating) || 0} - ${f.created_at ? new Date(f.created_at).toLocaleDateString() : ""}`}
              </small>
            </li>
          ))}
          {filteredFeedbacks.length === 0 && (
            <li className="list-group-item text-muted">No feedback found.</li>
          )}
        </ul>
      )}
    </DashboardSection>
  )
}
