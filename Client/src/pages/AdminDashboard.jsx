import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    total_users: 0,
    total_farmers: 0,
    total_vets: 0,
    total_animals: 0,
    total_cases: 0,
    active_cases: 0,
    open_cases: 0,
    closed_cases: 0,
    total_consultations: 0,
    total_appointments: 0,
    pending_appointments: 0,
    approved_appointments: 0,
    completed_appointments: 0,
    cancelled_appointments: 0,
    total_feed_items: 0,
    low_stock_items: 0,
    pending_lab_requests: 0,
    scheduled_reminders: 0,
    unread_notifications: 0,
    total_emails_sent: 0,
    total_sms_sent: 0,
    active_video_sessions: 0,
    completed_video_sessions: 0,
    recent_users: [],
    recent_cases: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get("/admin/overview");
        setMetrics(res.data);
      } catch (err) {
        console.error("Admin Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h3>System Overview</h3>
        <p className="text-muted">General statistics and recent activity across the platform.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div 
            className="card shadow-sm border-0 bg-primary text-white p-3 cursor-pointer"
            onClick={() => navigate("/admindashboard/users")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="small text-uppercase mb-1">Total Users</h6>
                <h3 className="fw-bold mb-0">{metrics.total_users}</h3>
              </div>
              <i className="bi bi-people fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="card shadow-sm border-0 bg-success text-white p-3"
            onClick={() => navigate("/admindashboard/cases")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="small text-uppercase mb-1">Total Cases</h6>
                <h3 className="fw-bold mb-0">{metrics.total_cases}</h3>
              </div>
              <i className="bi bi-clipboard-pulse fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="card shadow-sm border-0 bg-warning text-dark p-3"
            onClick={() => navigate("/admindashboard/consultations")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="small text-uppercase mb-1">Consultations</h6>
                <h3 className="fw-bold mb-0">{metrics.total_consultations}</h3>
              </div>
              <i className="bi bi-chat-dots fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="card shadow-sm border-0 bg-info text-white p-3"
            onClick={() => navigate("/admindashboard/appointments")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="small text-uppercase mb-1">Appointments</h6>
                <h3 className="fw-bold mb-0">{metrics.total_appointments}</h3>
              </div>
              <i className="bi bi-calendar-check fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="small text-uppercase mb-1 text-muted">Farmers</h6>
            <h3 className="fw-bold mb-0">{metrics.total_farmers}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="small text-uppercase mb-1 text-muted">Vets</h6>
            <h3 className="fw-bold mb-0">{metrics.total_vets}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="small text-uppercase mb-1 text-muted">Animals</h6>
            <h3 className="fw-bold mb-0">{metrics.total_animals}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="small text-uppercase mb-1 text-muted">Active Cases</h6>
            <h3 className="fw-bold mb-0">{metrics.active_cases}</h3>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div 
            className="card shadow-sm border-0 p-3 h-100"
            onClick={() => navigate("/admindashboard/cases")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center gap-3">
              <div className="bg-light-danger p-3 rounded-3 text-danger">
                <i className="bi bi-exclamation-triangle fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted small mb-1">Pending Lab Requests</h6>
                <h4 className="fw-bold mb-0">{metrics.pending_lab_requests}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div 
            className="card shadow-sm border-0 p-3 h-100"
            onClick={() => navigate("/admindashboard/reminders")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center gap-3">
              <div className="bg-light-primary p-3 rounded-3 text-primary">
                <i className="bi bi-alarm fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted small mb-1">Scheduled Reminders</h6>
                <h4 className="fw-bold mb-0">{metrics.scheduled_reminders}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div 
            className="card shadow-sm border-0 p-3 h-100"
            onClick={() => navigate("/admindashboard/communication/notifications")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center gap-3">
              <div className="bg-light-warning p-3 rounded-3 text-warning">
                <i className="bi bi-bell fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted small mb-1">Unread Notifications</h6>
                <h4 className="fw-bold mb-0">{metrics.unread_notifications}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold mb-3">Appointment Summary</h6>
            <div className="row text-center g-2">
              <div className="col-3">
                <div className="small text-muted">Pending</div>
                <div className="fw-bold">{metrics.pending_appointments}</div>
              </div>
              <div className="col-3">
                <div className="small text-muted">Approved</div>
                <div className="fw-bold">{metrics.approved_appointments}</div>
              </div>
              <div className="col-3">
                <div className="small text-muted">Completed</div>
                <div className="fw-bold">{metrics.completed_appointments}</div>
              </div>
              <div className="col-3">
                <div className="small text-muted">Cancelled</div>
                <div className="fw-bold">{metrics.cancelled_appointments}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold mb-3">Inventory Summary</h6>
            <div className="row text-center">
              <div className="col-6 border-end">
                <h4 className="fw-bold mb-1">{metrics.total_feed_items}</h4>
                <span className="text-muted small">Feed Items</span>
              </div>
              <div className="col-6">
                <h4 className="fw-bold mb-1">{metrics.low_stock_items}</h4>
                <span className="text-muted small">Low Stock</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold mb-3">Communication Overview</h6>
            <div className="row text-center">
              <div className="col-6 border-end">
                <h4 className="fw-bold text-primary mb-1">{metrics.total_emails_sent}</h4>
                <span className="text-muted small">Emails Sent</span>
              </div>
              <div className="col-6">
                <h4 className="fw-bold text-success mb-1">{metrics.total_sms_sent}</h4>
                <span className="text-muted small">SMS Sent</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold mb-3">Video Sessions</h6>
            <div className="row text-center">
              <div className="col-6 border-end">
                <h4 className="fw-bold text-info mb-1">{metrics.active_video_sessions}</h4>
                <span className="text-muted small">Active Sessions</span>
              </div>
              <div className="col-6">
                <h4 className="fw-bold text-secondary mb-1">{metrics.completed_video_sessions}</h4>
                <span className="text-muted small">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Recent Users</h6>
              <button className="btn btn-sm btn-link text-decoration-none" onClick={() => navigate("/admindashboard/users")}>View All</button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Name</th>
                      <th>Role</th>
                      <th className="text-end pe-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.recent_users?.map(u => (
                      <tr key={u.id} className="cursor-pointer" onClick={() => navigate("/admindashboard/users")} style={{ cursor: "pointer" }}>
                        <td className="ps-4 fw-bold">{u.name}</td>
                        <td><span className="badge bg-light text-dark">{u.role}</span></td>
                        <td className="text-end pe-4 small text-muted">{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Recent Cases</h6>
              <button className="btn btn-sm btn-link text-decoration-none" onClick={() => navigate("/admindashboard/cases")}>View All</button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.recent_cases?.map(c => (
                      <tr key={c.id} className="cursor-pointer" onClick={() => navigate("/admindashboard/cases")} style={{ cursor: "pointer" }}>
                        <td className="ps-4 fw-bold">#{c.id}</td>
                        <td className="text-truncate" style={{maxWidth: '200px'}}>{c.description}</td>
                        <td>
                          <span className={`badge ${c.status === 'open' ? 'bg-warning text-dark' : 'bg-success'}`}>
                            {c.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
