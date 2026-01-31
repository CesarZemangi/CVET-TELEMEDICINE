import React, { useState } from "react"
import { Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend, Title)

export default function LabRequests() {
  const [statusFilter, setStatusFilter] = useState("All")

  const requests = [
    { id: "LR-101", test: "Blood Test", status: "Pending", date: "Jan 20, 2026" },
    { id: "LR-102", test: "Urine Analysis", status: "Completed", date: "Jan 18, 2026" },
    { id: "LR-103", test: "Milk Quality Test", status: "In Progress", date: "Jan 19, 2026" },
    { id: "LR-104", test: "Fecal Examination", status: "Pending", date: "Jan 21, 2026" },
    { id: "LR-105", test: "Respiratory Culture", status: "Completed", date: "Jan 15, 2026" },
    { id: "LR-106", test: "Skin Scraping", status: "Completed", date: "Jan 16, 2026" },
    { id: "LR-107", test: "Serology Test", status: "In Progress", date: "Jan 22, 2026" },
    { id: "LR-108", test: "Urine Culture", status: "Pending", date: "Jan 23, 2026" },
    { id: "LR-109", test: "Blood Chemistry", status: "Completed", date: "Jan 17, 2026" },
    { id: "LR-110", test: "PCR Test", status: "Pending", date: "Jan 24, 2026" }
  ]

  const filteredRequests = requests.filter(req =>
    statusFilter === "All" ? true : req.status === statusFilter
  )

  const getStatusClass = (status) => {
    if (status === "Pending") return "text-warning fw-bold"
    if (status === "In Progress") return "text-primary fw-bold"
    if (status === "Completed") return "text-success fw-bold"
    return ""
  }

  const pieData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          requests.filter(r => r.status === "Pending").length,
          requests.filter(r => r.status === "In Progress").length,
          requests.filter(r => r.status === "Completed").length
        ],
        backgroundColor: ["#FFA500", "#1E90FF", "#228B22"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Lab Requests by Status" }
    }
  }

  return (
    <div>
      <h4>Lab Requests (Zimbabwe)</h4>
      <p>View and manage lab test requests for cattle, goats, and sheep.</p>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Pending", "In Progress", "Completed"].map(status => (
          <button
            key={status}
            className={`btn btn-sm ${statusFilter === status ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="row">
        {filteredRequests.length > 0 ? filteredRequests.map(req => (
          <div key={req.id} className="col-md-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="card-title">{req.id} — {req.test}</h6>
                <p className={`card-text ${getStatusClass(req.status)}`}>{req.status}</p>
                <small className="text-muted">{req.date}</small>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12 text-muted">No lab requests found for {statusFilter}.</div>
        )}
      </div>

      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Summary</h6>
        <Pie data={pieData} options={options} />
      </div>
    </div>
  )
}
