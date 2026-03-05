import React, { useState, useEffect } from "react"
import api from "../../services/api"
import DashboardSection from "../../components/dashboard/DashboardSection"
import FormModalWrapper from "../../components/common/FormModalWrapper"

export default function Feedback() {
  const [feedbackList, setFeedbackList] = useState([])
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    case_id: "",
    rating: 5,
    comments: ""
  })

  const fetchData = async () => {
    setLoading(true)

    const [feedbackRes, casesRes] = await Promise.allSettled([
      api.get("/farmer/feedback/my"),
      api.get("/farmer/cases")
    ])

    if (feedbackRes.status === "fulfilled") {
      const feedbackData = feedbackRes.value?.data?.data || feedbackRes.value?.data || []
      setFeedbackList(Array.isArray(feedbackData) ? feedbackData : [])
    } else {
      setFeedbackList([])
      console.error("Error fetching feedback data:", feedbackRes.reason)
    }

    if (casesRes.status === "fulfilled") {
      const raw = casesRes.value?.data
      const caseRows = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : [])
      setCases(caseRows)
    } else {
      setCases([])
      console.error("Error fetching cases for feedback:", casesRes.reason)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post("/farmer/feedback", formData)
      setShowAddModal(false)
      setFormData({ case_id: "", rating: 5, comments: "" })
      await fetchData()
    } catch (err) {
      alert("Failed to submit feedback: " + (err.response?.data?.error || err.message))
    }
  }

  const getCaseOptionLabel = (c) => {
    const shortDesc = c?.description ? String(c.description).trim().slice(0, 40) : ""
    const desc = shortDesc ? ` - ${shortDesc}${shortDesc.length === 40 ? "..." : ""}` : ""
    return `#${c.id} ${c.title || "Untitled Case"}${desc}`
  }

  const getVetName = (item) =>
    item?.vet?.User?.name ||
    item?.vet?.name ||
    item?.Case?.vet?.User?.name ||
    item?.Case?.vet?.name ||
    "Assigned Vet"

  return (
    <DashboardSection title="My Feedback">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0 text-muted">Share your experience with our veterinary services.</p>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-chat-left-heart me-1"></i> Give Feedback
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {feedbackList.length > 0 ? feedbackList.map(f => (
            <div key={f.id} className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0 text-brown">{f.Case?.title || "Case Feedback"}</h6>
                    <div className="text-warning">
                      {[...Array(f.rating)].map((_, i) => <i key={i} className="bi bi-star-fill small"></i>)}
                    </div>
                  </div>
                  <small className="text-muted d-block mb-2">Case ID: #{f.case_id || f.Case?.id || "N/A"}</small>
                  <p className="small text-muted mb-3">"{f.comments}"</p>
                  <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                    <small className="text-muted">
                      {new Date(f.created_at).toLocaleDateString()}
                    </small>
                    <small className="fw-medium text-primary">
                      Vet: {getVetName(f)}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-12 text-center py-5 text-muted">
              No feedback submitted yet.
            </div>
          )}
        </div>
      )}

      <FormModalWrapper
        show={showAddModal}
        title="Submit Feedback"
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmit}
        submitLabel="Submit"
        contentClassName="border-0"
        bodyClassName=""
        footerClassName="border-0"
      >
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Case</label>
                    <select 
                      className="form-select" 
                      required 
                      value={formData.case_id} 
                      onChange={e => setFormData({...formData, case_id: e.target.value})}
                    >
                      <option value="">Choose a case...</option>
                      {cases.map(c => (
                        <option key={c.id} value={c.id}>
                          {getCaseOptionLabel(c)}
                        </option>
                      ))}
                    </select>
                    {cases.length === 0 && (
                      <small className="text-danger">No cases found. Create a case first.</small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Rating</label>
                    <div className="d-flex gap-3">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num} className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="rating"
                            id={`rating-${num}`}
                            value={num}
                            checked={formData.rating === num}
                            onChange={() => setFormData({ ...formData, rating: num })}
                          />
                          <label className="form-check-label" htmlFor={`rating-${num}`}>
                            {num} <i className="bi bi-star-fill text-warning"></i>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Comments</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      required
                      placeholder="Tell us about your experience..."
                      value={formData.comments}
                      onChange={e => setFormData({...formData, comments: e.target.value})}
                    ></textarea>
                  </div>
      </FormModalWrapper>
    </DashboardSection>
  )
}

