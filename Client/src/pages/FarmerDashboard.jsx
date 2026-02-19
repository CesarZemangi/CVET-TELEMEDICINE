import { useState, useEffect } from "react";
import MetricCard from "../components/dashboard/MetricCard";
import ChartWrapper from "../components/dashboard/ChartWrapper";
import api from "../services/api";

export default function FarmerDashboard() {
  const [metrics, setMetrics] = useState({
    totalAnimals: 0,
    activeCases: 0,
    pendingConsultations: 0,
    healthAlerts: 0,
    statusDistribution: [],
    monthlyActivity: []
  });

  const [chartData, setChartData] = useState({
    labels: ["No Data"],
    datasets: [
      {
        label: "Case Activity",
        data: [0],
        borderColor: "#228B22",
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(34, 139, 34, 0.1)"
      }
    ]
  });

  const [donutData, setDonutData] = useState({
    labels: ["No Data"],
    datasets: [{
      data: [1],
      backgroundColor: ["#f0f0f0"]
    }]
  });

  useEffect(() => {
    // Fetch real metrics from API
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/farmer/dashboard");
        const data = res.data;
        setMetrics(data);

        // Update line chart
        if (data.monthlyActivity && data.monthlyActivity.length > 0) {
          setChartData({
            labels: data.monthlyActivity.map(m => m.month),
            datasets: [{
              label: "Case Activity",
              data: data.monthlyActivity.map(m => m.count),
              borderColor: "#228B22",
              tension: 0.4,
              fill: true,
              backgroundColor: "rgba(34, 139, 34, 0.1)"
            }]
          });
        }

        // Update donut chart
        if (data.statusDistribution && data.statusDistribution.length > 0) {
          setDonutData({
            labels: data.statusDistribution.map(s => s.status),
            datasets: [{
              data: data.statusDistribution.map(s => s.count),
              backgroundColor: ["#228B22", "#FFD700", "#DC3545", "#1E90FF"]
            }]
          });
        }
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
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            label="Active Medical Cases" 
            value={metrics.activeCases} 
            icon="bi-clipboard-pulse" 
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
            <h5 className="fw-bold mb-4">Case Activity Trends</h5>
            <div style={{ height: "300px" }}>
              <ChartWrapper type="line" data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 dashboard-card h-100">
            <h5 className="fw-bold mb-4">Case Status Distribution</h5>
            <div style={{ height: "250px" }}>
              <ChartWrapper 
                type="doughnut" 
                data={donutData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
