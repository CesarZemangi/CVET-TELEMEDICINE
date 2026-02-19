import React, { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
import api from "../../services/api";

export default function Notifications() {
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/farmer/notifications?category=${categoryFilter}`);
        setNotifications(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [categoryFilter])

  const getPriorityClass = (type) => {
    switch (type) {
      case "critical": return "badge bg-danger"
      case "message": return "badge bg-primary"
      case "reminder": return "badge bg-warning text-dark"
      default: return "badge bg-secondary"
    }
  }

  return (
    <DashboardSection title="Notifications">
      <p className="mb-3">Recent alerts and updates regarding your animals and consultations.</p>

      <div className="mb-4 d-flex gap-2 flex-wrap">
        {[
          "All",
          "message",
          "reminder",
          "system",
          "treatment",
          "diagnostic"
        ].map(cat => (
          <button
            key={cat}
            className={`btn btn-sm rounded-pill px-3 ${
              categoryFilter === cat
                ? "btn-brown"
                : "btn-outline-brown"
            }`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="list-group shadow-sm">
        {loading ? (
          <div className="list-group-item text-center py-5">
            <div className="spinner-border text-brown" role="status"></div>
            <p className="mt-2 text-muted mb-0">Checking for updates...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map(note => (
            <li
              key={note.id}
              className="list-group-item d-flex justify-content-between align-items-center p-3"
            >
              <div>
                <div className="fw-bold text-dark">{note.title}</div>
                <div className="small text-muted">{note.message}</div>
              </div>
              <div className="text-end">
                <span className={`${getPriorityClass(note.type)} mb-1 d-block`}>{note.type}</span>
                <small className="text-muted d-block" style={{fontSize: '0.7rem'}}>{new Date(note.created_at).toLocaleDateString()}</small>
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item text-center py-5">
            <div className="text-muted mb-2">
              <i className="bi bi-bell-slash" style={{fontSize: '2rem'}}></i>
            </div>
            <p className="mb-0 text-muted">No {categoryFilter !== 'All' ? categoryFilter : ''} notifications found.</p>
          </li>
        )}
      </div>
    </DashboardSection>
  )
}
