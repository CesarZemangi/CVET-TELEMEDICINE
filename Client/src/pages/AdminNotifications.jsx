import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await api.get("/communication/notifications");
        const notifs = res.data?.data || res.data || [];
        setNotifications(notifs);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

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

  const getPriorityClass = (type) => {
    switch (type) {
      case "critical": return "badge bg-danger";
      case "message": return "badge bg-primary";
      case "reminder": return "badge bg-warning text-dark";
      case "chat": return "badge bg-info text-dark";
      default: return "badge bg-secondary";
    }
  };

  const categories = ["all", "message", "chat", "reminder", "system"];
  const filteredNotifications = categoryFilter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === categoryFilter);

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-1">Notifications</h4>
          <small className="text-muted">View and manage system notifications</small>
        </div>
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
        {categories.map(cat => (
          <button
            key={cat}
            className={`btn btn-sm rounded-pill px-3 ${
              categoryFilter === cat
                ? "btn-primary"
                : "btn-outline-secondary"
            }`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted mb-0">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="list-group list-group-flush">
              {filteredNotifications.map(note => (
                <div
                  key={note.id}
                  className="list-group-item d-flex justify-content-between align-items-start p-3"
                >
                  <div className="flex-grow-1">
                    <div className="fw-bold text-dark">{note.title}</div>
                    <div className="small text-muted mt-1">{note.message}</div>
                  </div>
                  <div className="text-end ms-3">
                    <span className={`${getPriorityClass(note.type)} mb-1 d-block`}>
                      {note.type}
                    </span>
                    <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>
                      {new Date(note.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="text-muted mb-2">
                <i className="bi bi-bell-slash" style={{fontSize: '2rem'}}></i>
              </div>
              <p className="mb-0 text-muted">
                No {categoryFilter !== 'all' ? categoryFilter : ''} notifications found.
              </p>
            </div>
          )}
        </div>
        {filteredNotifications.length > 0 && (
          <div className="card-footer bg-white border-0 py-3 text-center">
            <small className="text-muted">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </small>
          </div>
        )}
      </div>
    </div>
  );
}
