import React, { useState, useEffect } from "react"
import api from "../../services/api"
import DashboardSection from "../../components/dashboard/DashboardSection"

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
    try {
      setLoading(true)
      const feedbackRes = await api.get("/farmer/feedback/my")
      setFeedbackList(feedbackRes.data?.data || feedbackRes.data || [])
      const casesRes = await api.get("/farmer/cases")
      setCases(casesRes.data?.data || casesRes.data || [])
    } catch (err) {
      console.error("Error fetching feedback data:", err)
    } finally {
      setLoading(false)
    }
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
      fetchData()
    } catch (err) {
      alert("Failed to submit feedback: " + (err.response?.data?.error || err.message))
    }
  }

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
                  <p className="small text-muted mb-3">"{f.comments}"</p>
                  <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                    <small className="text-muted">
                      {new Date(f.created_at).toLocaleDateString()}
                    </small>
                    <small className="fw-medium text-primary">
                      Vet: {f.Case?.vet?.name || "Assigned Vet"}
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

      {showAddModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Submit Feedback</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
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
                          {c.title} ({c.Animal?.tag_number})
                        </option>
                      ))}
                    </select>
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
                            onChange={() => setFormData({...formData, rating: num})}
                          />
                          <label className="form-check-label" htmlFor={`rating-${num}`}>
                            {num}⭐
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
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardSection>
  )
}
