import React, { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";
import api from "../../services/api";
import { getCases } from "../services/vet.cases.service";

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    case_id: "",
    title: "",
    message: "",
    type: "update"
  })

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/vet/notifications/sent");
      setNotifications(res.data?.data || res.data || []);
      const casesData = await getCases();
      setCases(casesData?.data || casesData || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/vet/notifications/send", formData);
      setShowAddModal(false);
      setFormData({ case_id: "", title: "", message: "", type: "update" });
      fetchData();
    } catch (err) {
      alert("Failed to send notification: " + (err.response?.data?.error || err.message));
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case "critical": return "badge bg-danger"
      case "update": return "badge bg-primary"
      case "reminder": return "badge bg-warning text-dark"
      default: return "badge bg-secondary"
    }
  }

  return (
    <DashboardSection title="Notifications">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0 text-muted">Send updates and alerts to farmers regarding their cases.</p>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-send me-1"></i> Send Notification
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <ul className="list-group list-group-flush">
            {loading ? (
              <li className="list-group-item text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </li>
            ) : notifications.length > 0 ? (
              notifications.map(note => (
                <li key={note.id} className="list-group-item p-3">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="fw-bold mb-0">{note.title}</h6>
                    <span className={getTypeClass(note.type)}>{note.type}</span>
                  </div>
                  <p className="small text-muted mb-2">{note.message}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      To: {note.User?.name || "Farmer"} | Case: {note.Case?.title || "N/A"}
                    </small>
                    <small className="text-muted">
                      {new Date(note.created_at).toLocaleString()}
                    </small>
                  </div>
                </li>
              ))
            ) : (
              <li className="list-group-item text-center py-5 text-muted">No notifications sent yet.</li>
            )}
          </ul>
        </div>
      </div>

      {showAddModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">New Notification</h5>
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
                    <label className="form-label small fw-bold">Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      placeholder="e.g. Lab results ready"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Message</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      required
                      placeholder="Enter the notification message..."
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Type</label>
                    <select 
                      className="form-select" 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="update">Update</option>
                      <option value="reminder">Reminder</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Send</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardSection>
  )
}
