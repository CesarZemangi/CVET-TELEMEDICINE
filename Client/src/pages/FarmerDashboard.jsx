import { useState, useEffect } from "react";
import MetricCard from "../components/dashboard/MetricCard";
import ChartWrapper from "../components/dashboard/ChartWrapper";
import api from "../services/api";

export default function FarmerDashboard() {
  const [metrics, setMetrics] = useState({
    totalAnimals: 0,
    activeCases: 0,
    pendingConsultations: 0,
    healthAlerts: 0
  });

  const [chartData, setChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Health Score",
        data: [85, 88, 82, 90, 85, 89],
        borderColor: "#228B22",
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(34, 139, 34, 0.1)"
      }
    ]
  });

  useEffect(() => {
    // Fetch real metrics from API
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/farmer/dashboard");
        setMetrics(res.data);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container-fluid px-0 py-2">
      <div className="mb-4">
        <h3 className="fw-bold mb-1" style={{ color: "var(--text-dark)" }}>Farmer Insights</h3>
        <p className="text-muted">Monitor your livestock health and consultation progress.</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <MetricCard 
            label="Total Livestock" 
            value={metrics.totalAnimals} 
            icon="bi-piggy-bank" 
            trend="+12%"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            label="Active Medical Cases" 
            value={metrics.activeCases} 
            icon="bi-clipboard-pulse" 
            trend="-2"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            label="Consultations" 
            value={metrics.pendingConsultations} 
            icon="bi-chat-dots" 
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            label="Health Alerts" 
            value={metrics.healthAlerts} 
            icon="bi-exclamation-triangle" 
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm p-4 dashboard-card h-100">
            <h5 className="fw-bold mb-4">Livestock Health Trends</h5>
            <div style={{ height: "300px" }}>
              <ChartWrapper type="line" data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 dashboard-card h-100">
            <h5 className="fw-bold mb-4">Distribution</h5>
            <div style={{ height: "250px" }}>
              <ChartWrapper 
                type="doughnut" 
                data={{
                  labels: ["Healthy", "Monitoring", "Critical"],
                  datasets: [{
                    data: [70, 20, 10],
                    backgroundColor: ["#228B22", "#FFD700", "#DC3545"]
                  }]
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
