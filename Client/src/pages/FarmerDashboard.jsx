import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalAnimals: 0,
    activeCases: 0,
    pendingConsultations: 0,
    healthAlerts: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/farmer/dashboard");
        const payload = res?.data?.data || res?.data || {};
        setMetrics(prev => ({ ...prev, ...payload }));
        
        const activityRes = await api.get("/farmer/dashboard/activity");
        const activityPayload = activityRes?.data?.data || activityRes?.data || [];
        setRecentActivity(Array.isArray(activityPayload) ? activityPayload : []);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 text-success">
      <div className="spinner-border" role="status"></div>
    </div>
  );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="mb-4">
        <h3 className="fw-bold text-dark">Farmer Dashboard</h3>
        <p className="text-muted small text-uppercase tracking-wider">Monitor your livestock health and consultation progress.</p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div 
            className="card border-0 shadow-sm p-4 bg-white h-100"
            onClick={() => navigate("/farmerdashboard/animals")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-bold">Total Livestock</span>
              <i className="bi bi-piggy-bank text-success fs-4"></i>
            </div>
            <h2 className="fw-bold mb-0">{metrics.totalAnimals}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="card border-0 shadow-sm p-4 bg-white h-100"
            onClick={() => navigate("/farmerdashboard/cases")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-bold">Active Cases</span>
              <i className="bi bi-activity text-danger fs-4"></i>
            </div>
            <h2 className="fw-bold mb-0">{metrics.activeCases}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="card border-0 shadow-sm p-4 bg-white h-100"
            onClick={() => navigate("/farmerdashboard/consultations")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-bold">Consultations</span>
              <i className="bi bi-chat-left-text text-primary fs-4"></i>
            </div>
            <h2 className="fw-bold mb-0">{metrics.pendingConsultations}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="card border-0 shadow-sm p-4 bg-white h-100"
            onClick={() => navigate("/farmerdashboard/diagnostics/lab-results")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-bold">Health Alerts</span>
              <i className="bi bi-exclamation-triangle text-warning fs-4"></i>
            </div>
            <h2 className="fw-bold mb-0">{metrics.healthAlerts}</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Recent Farm Activity</h6>
              <button className="btn btn-sm btn-link text-decoration-none" onClick={() => navigate("/farmerdashboard/cases")}>View All</button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Activity</th>
                      <th className="text-end pe-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.length > 0 ? (
                      recentActivity.map((act, idx) => (
                        <tr key={idx}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <div className="bg-light-success p-2 rounded-circle me-3">
                                <i className="bi bi-check-circle text-success small"></i>
                              </div>
                              <span className="text-dark">{act.message}</span>
                            </div>
                          </td>
                          <td className="text-end pe-4 text-muted small">
                            {new Date(act.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center py-4 text-muted">No recent activity.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 h-100 bg-white">
            <h6 className="fw-bold mb-4">Quick Links</h6>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-success d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={() => navigate("/farmerdashboard/animals")}
              >
                <i className="bi bi-plus-lg"></i> Register New Animal
              </button>
              <button 
                className="btn btn-outline-success d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={() => navigate("/farmerdashboard/cases")}
              >
                <i className="bi bi-file-earmark-plus"></i> Report a Case
              </button>
              <button 
                className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={() => navigate("/farmerdashboard/communication/messages")}
              >
                <i className="bi bi-chat-dots"></i> Message a Vet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
