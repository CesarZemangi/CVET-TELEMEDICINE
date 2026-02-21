import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import api from "../../services/api";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function CaseStatistics() {
  const [caseStats, setCaseStats] = useState([]);

  useEffect(() => {
    api.get("/vet/analytics/case-statistics")
      .then(res => {
        setCaseStats(res.data || []);
      })
      .catch(err => console.error("Vet Case Stats Error:", err));
  }, []);

  const pieData = {
    labels: caseStats.length > 0 ? caseStats.map(s => s.status.toUpperCase()) : ["No Data"],
    datasets: [
      {
        data: caseStats.length > 0 ? caseStats.map(s => s.count) : [1],
        backgroundColor: ["#1E90FF", "#228B22", "#FFD700", "#DC3545", "#6c757d"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  };

  const barData = {
    labels: caseStats.length > 0 ? caseStats.map(s => s.status.toUpperCase()) : ["No Data"],
    datasets: [
      {
        label: "Case Count",
        data: caseStats.length > 0 ? caseStats.map(s => s.count) : [0],
        backgroundColor: "rgba(30, 144, 255, 0.7)",
        borderRadius: 5
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
        <h4 className="fw-bold">Case Analytics</h4>
        <p className="text-muted small">Deep dive into clinical case distribution and outcomes</p>
      </div>

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card border-0 shadow-sm p-4 dashboard-card h-100">
            <h6 className="fw-bold mb-4">Status Distribution</h6>
            <div style={{ height: "300px" }}>
              <Pie data={pieData} options={options} />
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card border-0 shadow-sm p-4 dashboard-card h-100">
            <h6 className="fw-bold mb-4">Volume by Status</h6>
            <div style={{ height: "300px" }}>
              <Bar data={barData} options={options} />
            </div>
          </div>
        </div>

        <div className="col-12 mt-4">
          <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white py-3 border-0">
              <h6 className="fw-bold mb-0">Metrics Overview</h6>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3 border-0 small text-uppercase">Status</th>
                    <th className="px-4 py-3 border-0 small text-uppercase text-end">Case Count</th>
                    <th className="px-4 py-3 border-0 small text-uppercase text-end">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {caseStats.length > 0 ? (
                    (() => {
                      const total = caseStats.reduce((sum, s) => sum + s.count, 0);
                      return caseStats.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 fw-600">{row.status.toUpperCase()}</td>
                          <td className="px-4 py-3 text-end fw-bold">{row.count}</td>
                          <td className="px-4 py-3 text-end">
                            <span className="badge bg-primary bg-opacity-10 text-primary">
                              {((row.count / total) * 100).toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ));
                    })()
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-5 text-muted">No case data available.</td>
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
