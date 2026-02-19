import { useState, useEffect } from "react";
import MetricCard from "../components/dashboard/MetricCard";
import ChartWrapper from "../components/dashboard/ChartWrapper";
import api from "../services/api";

export default function VetDashboard() {
  const [metrics, setMetrics] = useState({
    incomingCases: 0,
    appointmentsToday: 0,
    ongoingTreatments: 0,
    reportsSubmitted: 0,
    statusDistribution: [],
    weeklyActivity: []
  });

  const [caseData, setCaseData] = useState({
    labels: ["No Data"],
    datasets: [{
      data: [1],
      backgroundColor: ["#f0f0f0"]
    }]
  });

  const [performanceData, setPerformanceData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Cases Handled",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "#1E90FF"
    }]
  });

  useEffect(() => {
    const fetchVetData = async () => {
      try {
        const res = await api.get("/vet/dashboard");
        const data = res.data;
        setMetrics(data);

        // Update Case Status Chart
        if (data.statusDistribution && data.statusDistribution.length > 0) {
          setCaseData({
            labels: data.statusDistribution.map(s => s.status),
            datasets: [{
              data: data.statusDistribution.map(s => s.count),
              backgroundColor: ["#1E90FF", "#FFD700", "#228B22", "#DC3545"]
            }]
          });
        }

        // Update Performance Chart
        if (data.weeklyActivity && data.weeklyActivity.length > 0) {
          setPerformanceData({
            labels: data.weeklyActivity.map(a => a.day),
            datasets: [{
              label: "Consultations Completed",
              data: data.weeklyActivity.map(a => a.count),
              backgroundColor: "#1E90FF"
            }]
          });
        }
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
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            label="Appointments" 
            value={metrics.appointmentsToday} 
            icon="bi-calendar-check" 
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
            <h5 className="fw-bold mb-4">Weekly Consultation Activity</h5>
            <div style={{ height: "300px" }}>
              <ChartWrapper 
                type="bar" 
                data={performanceData} 
                options={{ maintainAspectRatio: false }} 
              />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 dashboard-card h-100">
            <h5 className="fw-bold mb-4">Case Status distribution</h5>
            <div style={{ height: "250px" }}>
              <ChartWrapper type="doughnut" data={caseData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
