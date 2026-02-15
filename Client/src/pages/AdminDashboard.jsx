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
    recent_cases: [],
    monthlyCases: [],
    casesByStatus: [],
    casesByPriority: []
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
    labels: metrics.monthlyCases.length > 0 ? metrics.monthlyCases.map(m => m.month) : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Cases",
        data: metrics.monthlyCases.length > 0 ? metrics.monthlyCases.map(m => m.count) : [0, 0, 0, 0, 0, 0],
        borderColor: "var(--primary-green)",
        backgroundColor: "rgba(34, 139, 34, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const donutData = {
    labels: ["Farmers", "Vets", "Admin"],
    datasets: [{
      data: [
        metrics.total_farmers || 0, 
        metrics.total_vets || 0, 
        Math.max(0, (metrics.total_users || 0) - ((metrics.total_farmers || 0) + (metrics.total_vets || 0)))
      ],
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
      <div className="mb-4">
        <h3 className="fw-bold text-dark">System Administrator Dashboard</h3>
        <p className="text-muted">Comprehensive system performance and user management metrics.</p>
      </div>

      {/* Top Info Boxes */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-white p-0 h-100 overflow-hidden" style={{backgroundColor: 'var(--primary-blue)'}}>
            <div className="d-flex align-items-center p-3">
              <div className="flex-grow-1">
                <h3 className="fw-bold mb-0">{metrics.total_users}</h3>
                <p className="mb-0 opacity-75 small fw-bold text-uppercase">Total Users</p>
              </div>
              <div className="opacity-25"><i className="bi bi-people-fill" style={{fontSize: '3rem'}}></i></div>
            </div>
            <a href="/admindashboard/users" className="bg-dark bg-opacity-10 py-1 text-center small text-white text-decoration-none">
              Manage Users <i className="bi bi-arrow-right-circle ms-1"></i>
            </a>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-white p-0 h-100 overflow-hidden" style={{backgroundColor: 'var(--primary-green)'}}>
            <div className="d-flex align-items-center p-3">
              <div className="flex-grow-1">
                <h3 className="fw-bold mb-0">{metrics.total_cases}</h3>
                <p className="mb-0 opacity-75 small fw-bold text-uppercase">Total Cases</p>
              </div>
              <div className="opacity-25"><i className="bi bi-clipboard2-pulse-fill" style={{fontSize: '3rem'}}></i></div>
            </div>
            <a href="/admindashboard/cases" className="bg-dark bg-opacity-10 py-1 text-center small text-white text-decoration-none">
              View Cases <i className="bi bi-arrow-right-circle ms-1"></i>
            </a>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-white p-0 h-100 overflow-hidden" style={{backgroundColor: '#FF851B'}}>
            <div className="d-flex align-items-center p-3">
              <div className="flex-grow-1">
                <h3 className="fw-bold mb-0">{metrics.total_consultations}</h3>
                <p className="mb-0 opacity-75 small fw-bold text-uppercase">Consultations</p>
              </div>
              <div className="opacity-25"><i className="bi bi-chat-dots-fill" style={{fontSize: '3rem'}}></i></div>
            </div>
            <a href="/admindashboard/consultations" className="bg-dark bg-opacity-10 py-1 text-center small text-white text-decoration-none">
              Details <i className="bi bi-arrow-right-circle ms-1"></i>
            </a>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-white p-0 h-100 overflow-hidden" style={{backgroundColor: '#FF4136'}}>
            <div className="d-flex align-items-center p-3">
              <div className="flex-grow-1">
                <h3 className="fw-bold mb-0">{metrics.pending_lab_requests}</h3>
                <p className="mb-0 opacity-75 small fw-bold text-uppercase">Pending Labs</p>
              </div>
              <div className="opacity-25"><i className="bi bi-droplet-fill" style={{fontSize: '3rem'}}></i></div>
            </div>
            <div className="bg-dark bg-opacity-10 py-1 text-center small">
              Needs Attention <i className="bi bi-exclamation-triangle ms-1"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Recap Row */}
      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Monthly Case Trends</h6>
            </div>
            <div className="card-body p-4">
              <div style={{ height: "300px" }}>
                <ChartWrapper type="line" data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Case Progress</h6>
            </div>
            <div className="card-body p-4">
              <div className="mb-4 text-center">
                 <h2 className="fw-bold text-success mb-0">{Math.round((metrics.closed_cases / (metrics.total_cases || 1)) * 100)}%</h2>
                 <p className="text-muted small">Overall Resolution Rate</p>
              </div>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1 small">
                  <span>Open Cases</span>
                  <span className="fw-bold">{metrics.open_cases}</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div className="progress-bar bg-warning" style={{ width: `${(metrics.open_cases / (metrics.total_cases || 1)) * 100}%` }}></div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1 small">
                  <span>Closed Cases</span>
                  <span className="fw-bold">{metrics.closed_cases}</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div className="progress-bar bg-success" style={{ width: `${(metrics.closed_cases / (metrics.total_cases || 1)) * 100}%` }}></div>
                </div>
              </div>

              <div className="mt-auto">
                <h6 className="fw-bold small mb-2 text-uppercase opacity-50">Priority Alerts</h6>
                <div className="d-flex gap-2">
                  <div className="flex-grow-1 p-2 bg-danger bg-opacity-10 rounded text-center">
                    <div className="fw-bold text-danger h5 mb-0">{metrics.critical_priority_cases || 0}</div>
                    <div className="small text-danger" style={{fontSize: '0.6rem'}}>CRITICAL</div>
                  </div>
                  <div className="flex-grow-1 p-2 bg-warning bg-opacity-10 rounded text-center">
                    <div className="fw-bold text-warning h5 mb-0">{metrics.high_priority_cases || 0}</div>
                    <div className="small text-warning" style={{fontSize: '0.6rem'}}>HIGH</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Latest Members</h6>
              <span className="badge bg-primary px-2">{metrics.recent_users?.length} New</span>
            </div>
            <div className="card-body p-3">
              <ul className="list-unstyled d-flex flex-wrap justify-content-start gap-3 mb-0 ps-2">
                {metrics.recent_users?.map(user => (
                  <li key={user.id} className="text-center" style={{ width: '65px' }}>
                    <ProfileImage size="50px" role={user.role} src={user.profile_pic} className="mx-auto mb-1 border-primary shadow-sm" />
                    <div className="text-truncate fw-bold" style={{ fontSize: '0.7rem' }} title={user.name}>{user.name.split(' ')[0]}</div>
                    <div className="text-muted" style={{ fontSize: '0.6rem' }}>{user.role}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer bg-white border-0 text-center py-3">
              <a href="/admindashboard/users" className="text-primary small fw-bold text-decoration-none">View All Users</a>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">User Distribution</h6>
            </div>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <div style={{ height: "200px", width: "100%" }}>
                <ChartWrapper type="doughnut" data={donutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Recent Cases</h6>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {metrics.recent_cases?.map(c => (
                  <div key={c.id} className="list-group-item px-3 py-3 border-0 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary">
                        <i className="bi bi-file-earmark-medical"></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0 small fw-bold">Case #{c.id}</h6>
                        <div className="text-truncate text-muted small" style={{maxWidth: '180px'}}>{c.description}</div>
                      </div>
                      <span className={`badge ${c.status === 'open' ? 'bg-warning text-dark' : 'bg-success'} bg-opacity-10`} style={{ fontSize: '0.6rem' }}>{c.status.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
                {metrics.recent_cases?.length === 0 && (
                   <div className="p-4 text-center text-muted small">No recent cases</div>
                )}
              </div>
            </div>
            <div className="card-footer bg-white border-0 text-center py-3">
              <a href="/admindashboard/cases" className="text-primary small fw-bold text-decoration-none">View All Cases</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
