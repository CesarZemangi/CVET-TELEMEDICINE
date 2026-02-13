import React, { useState, useEffect } from "react";
import MetricCard from "../components/dashboard/MetricCard";
import api from "../services/api";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    total_users: 0,
    total_farmers: 0,
    total_vets: 0,
    total_cases: 0,
    open_cases: 0,
    closed_cases: 0,
    pending_lab_requests: 0,
    total_consultations: 0
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get("/admin/overview");
        setMetrics(res.data);
      } catch (err) {
        console.error("Admin Dashboard Fetch Error:", err);
      }
    };
    fetchOverview();
  }, []);

  return (
    <div className="container-fluid px-0 py-2">
      <div className="mb-4">
        <h3 className="fw-bold mb-1" style={{ color: "var(--text-dark)" }}>Admin Control Center</h3>
        <p className="text-muted">System-wide overview and management.</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <MetricCard label="Total Users" value={metrics.total_users} icon="bi-people" />
        </div>
        <div className="col-md-3">
          <MetricCard label="Farmers" value={metrics.total_farmers} icon="bi-person-badge" />
        </div>
        <div className="col-md-3">
          <MetricCard label="Veterinarians" value={metrics.total_vets} icon="bi-shield-check" />
        </div>
        <div className="col-md-3">
          <MetricCard label="Total Cases" value={metrics.total_cases} icon="bi-clipboard-data" />
        </div>
        <div className="col-md-3">
          <MetricCard label="Open Cases" value={metrics.open_cases} icon="bi-folder2-open" />
        </div>
        <div className="col-md-3">
          <MetricCard label="Closed Cases" value={metrics.closed_cases} icon="bi-folder-check" />
        </div>
        <div className="col-md-3">
          <MetricCard label="Lab Requests" value={metrics.pending_lab_requests} icon="bi-file-earmark-medical" />
        </div>
        <div className="col-md-3">
          <MetricCard label="Consultations" value={metrics.total_consultations} icon="bi-chat-dots" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '15px' }}>
            <h5 className="fw-bold mb-4">Recent Cases</h5>
            <div className="list-group list-group-flush">
              {metrics.recent_cases?.map(c => (
                <div key={c.id} className="list-group-item px-0 border-0 mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0 fw-bold">{c.title}</h6>
                      <small className="text-muted">{new Date(c.created_at).toLocaleDateString()}</small>
                    </div>
                    <span className="badge bg-success bg-opacity-10 text-success">ID: #{c.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '15px' }}>
            <h5 className="fw-bold mb-4">New Users</h5>
            <div className="list-group list-group-flush">
              {metrics.recent_users?.map(u => (
                <div key={u.id} className="list-group-item px-0 border-0 mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0 fw-bold">{u.name}</h6>
                      <small className="text-muted text-capitalize">{u.role}</small>
                    </div>
                    <small className="text-muted">{new Date(u.created_at).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
