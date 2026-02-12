import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import api from "../../services/api";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TreatmentStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/farmer/analytics/treatment-stats")
      .then(res => {
        setStats(res.data?.data || []);
      })
      .catch(err => console.error("Treatment Stats Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const total = stats.reduce((acc, curr) => acc + curr.count, 0);

  const chartData = {
    labels: stats.map(s => s.status.toUpperCase()),
    datasets: [{
      data: stats.map(s => s.count),
      backgroundColor: ["#228B22", "#1E90FF", "#FFD700", "#DC3545", "#6c757d"],
      borderWidth: 0
    }]
  };

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h4 className="fw-bold">Treatment Analytics</h4>
        <p className="text-muted small">Monitoring recovery rates and treatment statuses</p>
      </div>

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card border-0 shadow-sm p-4 dashboard-card h-100">
            <h6 className="fw-bold mb-4">Outcome Distribution</h6>
            <div style={{ height: "250px" }}>
              <Doughnut data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
            <div className="text-center mt-4">
              <h2 className="fw-bold mb-0">{total}</h2>
              <p className="text-muted small text-uppercase">Total Treatments</p>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="row g-3">
            {stats.map((s, idx) => (
              <div key={idx} className="col-sm-6">
                <div className="card border-0 shadow-sm p-3 h-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted small mb-1 text-uppercase">{s.status}</p>
                      <h4 className="fw-bold mb-0">{s.count}</h4>
                    </div>
                    <div className="text-primary opacity-25">
                      <i className="bi bi-activity fs-2"></i>
                    </div>
                  </div>
                  <div className="progress mt-3" style={{ height: "4px" }}>
                    <div 
                      className="progress-bar bg-primary" 
                      style={{ width: `${(s.count/total)*100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
            {stats.length === 0 && (
              <div className="col-12 text-center py-5 bg-white rounded shadow-sm">
                <p className="text-muted">No treatment statistics available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
