import { useState, useEffect } from "react";
import MetricCard from "../components/dashboard/MetricCard";
import ChartWrapper from "../components/dashboard/ChartWrapper";
import api from "../services/api";

export default function VetDashboard() {
  const [metrics, setMetrics] = useState({
    incomingCases: 0,
    appointmentsToday: 0,
    ongoingTreatments: 0,
    reportsSubmitted: 0
  });

  const [caseData, setCaseData] = useState({
    labels: ["New", "Pending", "Resolved"],
    datasets: [{
      data: [12, 19, 3],
      backgroundColor: ["#1E90FF", "#FFD700", "#228B22"]
    }]
  });

  useEffect(() => {
    const fetchVetData = async () => {
      try {
        const res = await api.get("/vet/dashboard");
        setMetrics(res.data);
      } catch (err) {
        console.error("Vet Dashboard Error:", err);
      }
    };

    fetchVetData();
  }, []);

  return (
    <div className="container-fluid px-0 py-2">
      <div className="mb-4">
        <h3 className="fw-bold mb-1" style={{ color: "var(--text-dark)" }}>Veterinary Overview</h3>
        <p className="text-muted">Manage your clinical cases and upcoming consultations efficiently.</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <MetricCard 
            label="Active Cases" 
            value={metrics.incomingCases} 
            icon="bi-clipboard2-pulse" 
            trend="+5"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            label="Appointments" 
            value={metrics.appointmentsToday} 
            icon="bi-calendar-check" 
            trend="Today"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            label="In Treatment" 
            value={metrics.ongoingTreatments} 
            icon="bi-capsule" 
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            label="Lab Reports" 
            value={metrics.reportsSubmitted} 
            icon="bi-file-earmark-medical" 
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 dashboard-card h-100">
            <h5 className="fw-bold mb-4">Clinical Performance</h5>
            <div style={{ height: "300px" }}>
              <ChartWrapper 
                type="bar" 
                data={{
                  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  datasets: [{
                    label: "Cases Handled",
                    data: [5, 8, 4, 10, 6, 3, 2],
                    backgroundColor: "#1E90FF"
                  }]
                }} 
                options={{ maintainAspectRatio: false }} 
              />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 dashboard-card h-100">
            <h5 className="fw-bold mb-4">Case Status</h5>
            <div style={{ height: "250px" }}>
              <ChartWrapper type="doughnut" data={caseData} />
            </div>
            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="small text-muted">Success Rate</span>
                <span className="small fw-bold">92%</span>
              </div>
              <div className="progress" style={{ height: "6px" }}>
                <div className="progress-bar bg-success" style={{ width: "92%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
