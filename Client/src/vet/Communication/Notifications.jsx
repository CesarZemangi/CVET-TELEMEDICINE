import React, { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";
import api from "../../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/communication/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [])

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
      <p className="mb-3">Veterinary notifications and case updates:</p>
      <ul className="list-group">
        {loading ? (
           <li className="list-group-item text-center py-4">Loading notifications...</li>
        ) : notifications.length > 0 ? (
          notifications.map(note => (
            <li key={note.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{note.title}:</strong> {note.message}
              </div>
              <div>
                <span className={getPriorityClass(note.type)}>{note.type}</span>
                <small className="text-muted ms-2">{new Date(note.created_at).toLocaleDateString()}</small>
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">No notifications found.</li>
        )}
      </ul>
    </DashboardSection>
  )
}
