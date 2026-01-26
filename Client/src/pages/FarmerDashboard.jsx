import React from "react"
import { useNavigate } from "react-router-dom"
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
} from "chart.js"
import { Pie, Doughnut, Line, Bar } from "react-chartjs-2"

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
)

export default function FarmerDashboard() {
  const navigate = useNavigate()

  function logout() {
    localStorage.clear()
    navigate("/")
  }

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
          { label: "Total Cases Raised", value: 24 },
          { label: "Pending Consultations", value: 6 },
          { label: "Vet Responses", value: 18 },
          { label: "Healthy Animals", value: 42 }
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
                  labels: ["Resolved", "Pending", "Critical"],
                  datasets: [
                    {
                      data: [65, 25, 10],
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
                  labels: ["Healthy", "Under Treatment", "Attention Needed"],
                  datasets: [
                    {
                      data: [72, 20, 8],
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
                  labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
                  datasets: [
                    {
                      label: "Consultations",
                      data: [4, 6, 5, 8, 7, 10],
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

      {/* 5. Performance Targets */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Performance Targets</h6>

              <p className="mb-1">Consultation Completion</p>
              <div className="progress mb-3">
                <div className="progress-bar bg-success" style={{ width: "70%" }}>
                  70%
                </div>
              </div>

              <p className="mb-1">Treatment Success Rate</p>
              <div className="progress mb-3">
                <div className="progress-bar bg-brown" style={{ width: "82%" }}>
                  82%
                </div>
              </div>

              <p className="mb-1">Animal Health Benchmark</p>
              <div className="progress">
                <div className="progress-bar bg-info" style={{ width: "75%" }}>
                  75%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Recent Activity Feed */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Recent Activity</h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  Vet responded to cow fever case
                </li>
                <li className="list-group-item">
                  Video consultation scheduled for goat injury
                </li>
                <li className="list-group-item">
                  Case marked resolved by Dr. Kumar
                </li>
                <li className="list-group-item">
                  New animal added to livestock
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Reports & Analytics */}
      <div className="row g-4">
        <div className="col-lg-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Reports & Analytics</h6>
              <Bar
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                  datasets: [
                    {
                      label: "Monthly Treatment Cost",
                      data: [1200, 900, 1500, 1100, 1700],
                      backgroundColor: "#A0522D"
                    }
                  ]
                }}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
