import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
} from "chart.js";
import { Pie, Doughnut, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  useEffect(() => {
    // Fetch dashboard data from backend
    fetch("http://localhost:5000/api/farmer/dashboard") // replace with your API
      .then(res => res.json())
      .then(data => setDashboard(data))
      .catch(err => console.error(err));
  }, []);

  if (!dashboard) return <p>Loading dashboard...</p>;

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Farm Health Dashboard</h4>
        <button className="btn btn-outline-danger btn-sm" onClick={logout}>
          Logout
        </button>
      </div>

      {/* 1. Top Summary Cards */}
      <div className="row g-4 mb-4">
        {[
          { label: "Total Cases Raised", value: dashboard.totalCases },
          { label: "Pending Consultations", value: dashboard.pendingConsultations },
          { label: "Vet Responses", value: dashboard.vetResponses },
          { label: "Healthy Animals", value: dashboard.healthyAnimals }
        ].map((item, i) => (
          <div className="col-md-3" key={i}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <p className="text-muted mb-1">{item.label}</p>
                <h4 className="fw-bold text-brown">{item.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Case Status Distribution */}
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Case Status Distribution</h6>
              <Pie
                data={{
                  labels: dashboard.caseStatus.labels,
                  datasets: [
                    {
                      data: dashboard.caseStatus.values,
                      backgroundColor: ["#198754", "#ffc107", "#dc3545"]
                    }
                  ]
                }}
              />
            </div>
          </div>
        </div>

        {/* 3. Livestock Health Coverage */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Livestock Health Coverage</h6>
              <Doughnut
                data={{
                  labels: dashboard.healthCoverage.labels,
                  datasets: [
                    {
                      data: dashboard.healthCoverage.values,
                      backgroundColor: ["#198754", "#ffc107", "#dc3545"]
                    }
                  ]
                }}
              />
            </div>
          </div>
        </div>

        {/* 4. Consultation Trend */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Consultation Trend</h6>
              <Line
                data={{
                  labels: dashboard.consultationTrend.labels,
                  datasets: [
                    {
                      label: "Consultations",
                      data: dashboard.consultationTrend.values,
                      borderColor: "#A0522D",
                      backgroundColor: "#F5F5DC"
                    }
                  ]
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional sections like Performance Targets, Recent Activity, Reports */}
      {/* Use dashboard.performanceTargets, dashboard.recentActivity, dashboard.monthlyReports */}
      
    </div>
  );
}
