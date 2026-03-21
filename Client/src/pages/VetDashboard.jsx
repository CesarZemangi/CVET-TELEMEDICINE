import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function VetDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    incomingCases: 0,
    appointmentsToday: 0,
    ongoingTreatments: 0,
    reportsSubmitted: 0,
    totalConsultations: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [paymentInsights, setPaymentInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVetData = async () => {
      try {
        const [res, activityRes, paymentRes] = await Promise.allSettled([
          api.get("/vet/dashboard"),
          api.get("/vet/dashboard/activity"),
          api.get("/ml/payment-insights")
        ]);
        const payload = res.status === "fulfilled" ? res.value?.data?.data || res.value?.data || {} : {};
        setMetrics(prev => ({ ...prev, ...payload }));
        const activityPayload = activityRes.status === "fulfilled" ? activityRes.value?.data?.data || activityRes.value?.data || [] : [];
        setRecentActivity(Array.isArray(activityPayload) ? activityPayload : []);
        setPaymentInsights(paymentRes.status === "fulfilled" ? paymentRes.value?.data?.data || null : null);
        if (paymentRes.status === "rejected") {
          console.warn("Vet payment AI endpoint unavailable:", paymentRes.reason?.response?.data || paymentRes.reason?.message || paymentRes.reason);
        }
      } catch (err) {
        console.error("Vet Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVetData();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 text-primary">
      <div className="spinner-border" role="status"></div>
    </div>
  );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="mb-4">
        <h3 className="fw-bold text-dark">Veterinary Dashboard</h3>
        <p className="text-muted small text-uppercase tracking-wider">Comprehensive overview of your clinical cases and activities.</p>
      </div>

      <div className="row g-3 mb-5">
        <div className="col-md-3">
          <div 
            className="card border-0 shadow-sm p-4 bg-white h-100"
            onClick={() => navigate("/vetdashboard/cases")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-bold">Active Cases</span>
              <i className="bi bi-clipboard2-pulse text-primary fs-4"></i>
            </div>
            <h2 className="fw-bold mb-0">{metrics.incomingCases}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="card border-0 shadow-sm p-4 bg-white h-100"
            onClick={() => navigate("/vetdashboard/consultations")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-bold">Consultations</span>
              <i className="bi bi-calendar-event text-success fs-4"></i>
            </div>
            <h2 className="fw-bold mb-0">{metrics.appointmentsToday}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="card border-0 shadow-sm p-4 bg-white h-100"
            onClick={() => navigate("/vetdashboard/cases")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-bold">Ongoing Treatments</span>
              <i className="bi bi-capsule text-warning fs-4"></i>
            </div>
            <h2 className="fw-bold mb-0">{metrics.ongoingTreatments}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="card border-0 shadow-sm p-4 bg-white h-100"
            onClick={() => navigate("/vetdashboard/diagnostics/lab-results")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-bold">Lab Reports</span>
              <i className="bi bi-file-earmark-medical text-info fs-4"></i>
            </div>
            <h2 className="fw-bold mb-0">{metrics.reportsSubmitted}</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Recent Activity Logs</h6>
              <button 
                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                onClick={() => navigate("/vetdashboard/communication/notifications")}
              >
                View All
              </button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Activity Description</th>
                      <th className="text-end pe-4">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.length > 0 ? (
                      recentActivity.map((act, idx) => (
                        <tr key={idx}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <div className="bg-light p-2 rounded-circle me-3">
                                <i className="bi bi-lightning-charge text-primary small"></i>
                              </div>
                              <span className="fw-medium text-dark">{act.message}</span>
                            </div>
                          </td>
                          <td className="text-end pe-4 text-muted small">
                            {new Date(act.date).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center py-4 text-muted">No recent activity recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h6 className="fw-bold mb-3">AI Revenue Forecast</h6>
            <div className="small text-muted mb-2">Predicted next period earnings</div>
            <div className="h3 fw-bold text-success mb-3">
              USD {Number(paymentInsights?.earnings_prediction?.predicted_next_period_earnings || 0).toFixed(2)}
            </div>
            <div className="small text-muted mb-1">Recommended payment method</div>
            <div className="fw-semibold mb-2">{paymentInsights?.payment_success?.recommended_method || "N/A"}</div>
            <div className="small text-muted mb-1">Busiest consultation day</div>
            <div className="fw-semibold">{paymentInsights?.demand_forecast?.busiest_day || "N/A"}</div>
          </div>

          <div className="card border-0 shadow-sm p-4 h-100">
            <h6 className="fw-bold mb-4">Quick Actions</h6>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={() => navigate("/vetdashboard/consultations")}
              >
                <i className="bi bi-plus-circle"></i> New Consultation
              </button>
              <button 
                className="btn btn-light d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={() => navigate("/vetdashboard/diagnostics/lab-requests")}
              >
                <i className="bi bi-file-earmark-plus"></i> Submit Lab Report
              </button>
              <hr />
              <button 
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={() => navigate("/vetdashboard/communication/video-sessions")}
              >
                <i className="bi bi-person-video3"></i> Join Video Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
