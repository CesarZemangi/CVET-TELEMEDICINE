import React, { useState, useEffect } from "react";
import api from "../services/api";
import ChartWrapper from "../components/dashboard/ChartWrapper";
import ProfileImage from "../components/common/ProfileImage";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    total_users: 0,
    total_farmers: 0,
    total_vets: 0,
    total_cases: 0,
    open_cases: 0,
    closed_cases: 0,
    pending_lab_requests: 0,
    total_consultations: 0,
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

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Total Cases",
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: "var(--primary-green)",
        backgroundColor: "rgba(34, 139, 34, 0.1)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Consultations",
        data: [8, 15, 12, 20, 18, 25, 24],
        borderColor: "var(--primary-blue)",
        backgroundColor: "rgba(30, 144, 255, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const donutData = {
    labels: ["Farmers", "Vets", "Admin"],
    datasets: [{
      data: [metrics.total_farmers, metrics.total_vets, metrics.total_users - (metrics.total_farmers + metrics.total_vets)],
      backgroundColor: ["#228B22", "#1E90FF", "#001F3F"]
    }]
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      {/* Page Heading */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark">System Administrator Dashboard</h3>
        <p className="text-muted">Comprehensive system performance and user management metrics.</p>
      </div>

      {/* Top Info Boxes (4 columns) */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-white p-0 h-100 overflow-hidden" style={{backgroundColor: 'var(--primary-blue)'}}>
            <div className="d-flex align-items-center p-3">
              <div className="flex-grow-1">
                <h3 className="fw-bold mb-0">{metrics.total_users}</h3>
                <p className="mb-0 opacity-75 small fw-bold">TOTAL USERS</p>
              </div>
              <div className="opacity-25"><i className="bi bi-people-fill" style={{fontSize: '3rem'}}></i></div>
            </div>
            <div className="bg-dark bg-opacity-10 py-1 text-center small cursor-pointer">
              More info <i className="bi bi-arrow-right-circle ms-1"></i>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-white p-0 h-100 overflow-hidden" style={{backgroundColor: 'var(--primary-green)'}}>
            <div className="d-flex align-items-center p-3">
              <div className="flex-grow-1">
                <h3 className="fw-bold mb-0">{metrics.total_cases}</h3>
                <p className="mb-0 opacity-75 small fw-bold">TOTAL CASES</p>
              </div>
              <div className="opacity-25"><i className="bi bi-clipboard2-pulse-fill" style={{fontSize: '3rem'}}></i></div>
            </div>
            <div className="bg-dark bg-opacity-10 py-1 text-center small cursor-pointer">
              More info <i className="bi bi-arrow-right-circle ms-1"></i>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-white p-0 h-100 overflow-hidden" style={{backgroundColor: '#FF851B'}}>
            <div className="d-flex align-items-center p-3">
              <div className="flex-grow-1">
                <h3 className="fw-bold mb-0">{metrics.total_consultations}</h3>
                <p className="mb-0 opacity-75 small fw-bold">CONSULTATIONS</p>
              </div>
              <div className="opacity-25"><i className="bi bi-chat-dots-fill" style={{fontSize: '3rem'}}></i></div>
            </div>
            <div className="bg-dark bg-opacity-10 py-1 text-center small cursor-pointer">
              More info <i className="bi bi-arrow-right-circle ms-1"></i>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-white p-0 h-100 overflow-hidden" style={{backgroundColor: '#FF4136'}}>
            <div className="d-flex align-items-center p-3">
              <div className="flex-grow-1">
                <h3 className="fw-bold mb-0">{metrics.pending_lab_requests}</h3>
                <p className="mb-0 opacity-75 small fw-bold">PENDING LABS</p>
              </div>
              <div className="opacity-25"><i className="bi bi-droplet-fill" style={{fontSize: '3rem'}}></i></div>
            </div>
            <div className="bg-dark bg-opacity-10 py-1 text-center small cursor-pointer">
              More info <i className="bi bi-arrow-right-circle ms-1"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Recap Row */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">System Activity Recap</h6>
            </div>
            <div className="card-body p-0">
              <div className="row g-0">
                <div className="col-lg-8 p-4 border-end">
                  <div style={{ height: "300px" }}>
                    <ChartWrapper type="line" data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                  </div>
                </div>
                <div className="col-lg-4 p-4 bg-light bg-opacity-50">
                  <h6 className="fw-bold mb-4">Goal Completions</h6>
                  
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1 small">
                      <span>Resolved Cases</span>
                      <span className="fw-bold">{Math.round((metrics.closed_cases / (metrics.total_cases || 1)) * 100)}%</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-success" style={{ width: `${(metrics.closed_cases / (metrics.total_cases || 1)) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1 small">
                      <span>Farmers Registered</span>
                      <span className="fw-bold">{Math.round((metrics.total_farmers / (metrics.total_users || 1)) * 100)}%</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-primary" style={{ width: `${(metrics.total_farmers / (metrics.total_users || 1)) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1 small">
                      <span>Vets Verified</span>
                      <span className="fw-bold">{Math.round((metrics.total_vets / (metrics.total_users || 1)) * 100)}%</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-warning" style={{ width: `${(metrics.total_vets / (metrics.total_users || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="row g-4">
        {/* Latest Members */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Latest Members</h6>
              <span className="badge bg-danger">{metrics.recent_users?.length} New</span>
            </div>
            <div className="card-body p-3">
              <ul className="list-unstyled d-flex flex-wrap justify-content-center gap-3 mb-0">
                {metrics.recent_users?.map(user => (
                  <li key={user.id} className="text-center" style={{ width: '70px' }}>
                    <ProfileImage size="50px" role={user.role} src={user.profile_pic} className="mx-auto mb-1 border-primary" />
                    <div className="text-truncate fw-bold" style={{ fontSize: '0.7rem' }} title={user.name}>{user.name.split(' ')[0]}</div>
                    <div className="text-muted" style={{ fontSize: '0.6rem' }}>{new Date(user.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer bg-white border-0 text-center py-3">
              <a href="/admindashboard/users" className="text-primary small fw-bold text-decoration-none">View All Users</a>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">User Distribution</h6>
            </div>
            <div className="card-body">
              <div style={{ height: "200px" }}>
                <ChartWrapper type="doughnut" data={donutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent System Activity */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Recent Cases</h6>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {metrics.recent_cases?.map(c => (
                  <div key={c.id} className="list-group-item px-3 py-2 border-0 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary">
                        <i className="bi bi-file-earmark-medical"></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0 small fw-bold">Case #{c.id} Report</h6>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>Created on {new Date(c.created_at).toLocaleDateString()}</small>
                      </div>
                      <span className="badge bg-success bg-opacity-10 text-success" style={{ fontSize: '0.6rem' }}>ACTIVE</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
