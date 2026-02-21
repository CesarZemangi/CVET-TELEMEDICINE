import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import api from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function HealthTrends() {
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    api.get("/farmer/analytics/health-trends")
      .then(res => {
        setHealthData(res.data?.data || []);
      })
      .catch(err => console.error("Health Trends Fetch Error:", err));
  }, []);

  const barData = {
    labels: healthData.length > 0 ? healthData.map(item => new Date(item.date).toLocaleDateString()) : ["No Data"],
    datasets: [
      {
        label: "Metric Value",
        data: healthData.length > 0 ? healthData.map(item => item.value) : [0],
        backgroundColor: "rgba(34, 139, 34, 0.6)",
        borderRadius: 8
      }
    ]
  };

  const lineData = {
    labels: healthData.length > 0 ? healthData.map(item => new Date(item.date).toLocaleDateString()) : ["No Data"],
    datasets: [
      {
        label: "Health Trend",
        data: healthData.length > 0 ? healthData.map(item => item.value) : [0],
        borderColor: "#1E90FF",
        backgroundColor: "rgba(30, 144, 255, 0.1)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" }
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h4 className="fw-bold">Health Trends</h4>
        <p className="text-muted small">Visualizing livestock health metrics over time</p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 dashboard-card">
            <h6 className="fw-bold mb-4">Health Metric Comparison</h6>
            <div style={{ height: "300px" }}>
              <Bar data={barData} options={options} />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 dashboard-card">
            <h6 className="fw-bold mb-4">Long-term Progress</h6>
            <div style={{ height: "300px" }}>
              <Line data={lineData} options={options} />
            </div>
          </div>
        </div>

        <div className="col-12 mt-4">
          <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white py-3 border-0">
              <h6 className="fw-bold mb-0">Detailed Health Logs</h6>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3 border-0 small text-uppercase">Date</th>
                    <th className="px-4 py-3 border-0 small text-uppercase">Metric</th>
                    <th className="px-4 py-3 border-0 small text-uppercase">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {healthData.length > 0 ? healthData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3">{new Date(row.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{row.metric}</td>
                      <td className="px-4 py-3 fw-bold">{row.value}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="text-center py-5 text-muted">No health data recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
