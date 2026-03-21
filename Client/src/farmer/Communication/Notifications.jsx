import React, { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
import api from "../../services/api";

export default function Notifications() {
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1)
  const perPage = 10
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          perPage,
          ...(categoryFilter === "All" ? {} : { category: categoryFilter })
        };
        const res = await api.get(`/farmer/notifications`, { params });
        const data = res.data?.notifications || res.data?.data || res.data || [];
        setNotifications(Array.isArray(data) ? data : []);
        setTotal(res.data?.total || data.length || 0);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [categoryFilter, page])

  const getPriorityClass = (type) => {
    switch (type) {
      case "critical": return "badge bg-danger"
      case "message": return "badge bg-primary"
      case "reminder": return "badge bg-warning text-dark"
      default: return "badge bg-secondary"
    }
  }

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      try {
        await api.delete("/communication/notifications/clear/all");
        setNotifications([]);
      } catch (err) {
        console.error("Error clearing notifications:", err);
      }
    }
  };

  return (
    <DashboardSection title="Notifications">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0 text-muted">Recent alerts and updates regarding your animals and consultations.</p>
        {notifications.length > 0 && (
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={handleClearAll}
          >
            <i className="bi bi-trash me-1"></i>Clear All
          </button>
        )}
      </div>

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

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Title</th>
                <th>Message</th>
                <th>Sender</th>
                <th>Date</th>
                <th className="pe-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
              ) : notifications.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No notifications found.</td></tr>
              ) : (
                notifications.map(note => (
                  <tr key={note.id}>
                    <td className="ps-3">{note.title || "No Title"}</td>
                    <td>{note.message || "No Message"}</td>
                    <td>{note.sender?.name || "Unknown"}</td>
                    <td>{note.created_at ? new Date(note.created_at).toLocaleString() : "-"}</td>
                    <td className="pe-3">
                      <span className={`${getPriorityClass(note.type)} text-uppercase small`}>
                        {note.is_read ? "Read" : "Unread"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted small">
          Page {page} of {Math.max(1, Math.ceil((total || 0) / perPage))}
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <button className="btn btn-outline-secondary btn-sm" disabled={page >= Math.ceil((total || 0) / perPage)} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </DashboardSection>
  )
}
