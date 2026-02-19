import React, { useState, useEffect } from "react"
import { Pie } from "react-chartjs-2"
import { getLabRequests } from "../services/farmer.diagnostics.service"
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
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getLabRequests()
        setRequests(data)
      } catch (error) {
        console.error("Error fetching lab requests:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const filteredRequests = requests.filter(req =>
    statusFilter === "All" ? true : req.status === statusFilter
  )

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case "pending": return "text-warning fw-bold";
      case "completed": return "text-success fw-bold";
      default: return "";
    }
  }

  const pieData = {
    labels: ["Pending", "Completed"],
    datasets: [
      {
        data: [
          requests.filter(r => r.status?.toLowerCase() === "pending").length,
          requests.filter(r => r.status?.toLowerCase() === "completed").length
        ],
        backgroundColor: ["#FFA500", "#228B22"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Lab Requests Status" }
    }
  }

  return (
    <div>
      <h4>Lab Requests</h4>
      <p>View lab test requests for your livestock.</p>

      <div className="row">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-brown" role="status"></div>
          </div>
        ) : filteredRequests.length > 0 ? filteredRequests.map(req => (
          <div key={req.id} className="col-md-6 mb-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="card-title fw-bold">#{req.id} — {req.test_type}</h6>
                <p className="small mb-1">Case: {req.Case?.title}</p>
                <p className="small mb-1">Animal: {req.Case?.Animal?.species} ({req.Case?.Animal?.tag_number})</p>
                <p className={`card-text ${getStatusClass(req.status)}`}>{req.status?.toUpperCase()}</p>
                <small className="text-muted">{new Date(req.created_at).toLocaleDateString()}</small>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12 text-muted">No lab requests found.</div>
        )}
      </div>

      {requests.length > 0 && (
        <div className="mt-4" style={{ width: "300px", height: "250px" }}>
          <Pie data={pieData} options={options} />
        </div>
      )}
    </div>
  )
}
