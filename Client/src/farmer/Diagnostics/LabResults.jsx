import React, { useState, useEffect } from "react"
import { Pie, Line } from "react-chartjs-2"
import { getLabResults } from "../services/farmer.diagnostics.service"
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function LabResults() {
  const [filter, setFilter] = useState("All")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getLabResults();
      setResults(data?.data || data || []);
    } catch (err) {
      console.error("Error fetching lab results:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const abnormalKeywords = ["High", "Parasites", "Positive", "Bacterial", "Elevated", "dermatitis", "infection"]

  const filteredResults = results.filter(res => {
    if (filter === "All") return true
    const isAbnormal = abnormalKeywords.some(k => res.result?.toLowerCase().includes(k.toLowerCase()))
    return filter === "Abnormal" ? isAbnormal : !isAbnormal
  })

  const getResultClass = (result) =>
    abnormalKeywords.some(k => result?.toLowerCase().includes(k.toLowerCase()))
      ? "text-danger fw-bold"
      : "text-success"

  const pieData = {
    labels: ["Normal", "Abnormal"],
    datasets: [
      {
        data: [
          results.filter(r => !abnormalKeywords.some(k => r.result?.toLowerCase().includes(k.toLowerCase()))).length,
          results.filter(r => abnormalKeywords.some(k => r.result?.toLowerCase().includes(k.toLowerCase()))).length
        ],
        backgroundColor: ["#228B22", "#FF4500"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  const lineData = {
    labels: results.map(r => new Date(r.uploaded_at).toLocaleDateString()),
    datasets: [
      {
        label: "Abnormal Results",
        data: results.map(r =>
          abnormalKeywords.some(k => r.result?.toLowerCase().includes(k.toLowerCase())) ? 1 : 0
        ),
        borderColor: "#FF4500",
        backgroundColor: "#FFA07A",
        tension: 0.3,
        fill: true
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" }
    }
  }

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h4 className="fw-bold">Lab Results</h4>
        <p className="text-muted small">View diagnostic lab results for your livestock.</p>
      </div>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Normal", "Abnormal"].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="row">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : filteredResults.length > 0 ? filteredResults.map(res => (
              <div key={res.id} className="col-md-6 mb-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <h6 className="card-title fw-bold mb-0">Case: {res.LabRequest?.Case?.title || `#${res.LabRequest?.case_id}`}</h6>
                      <small className="badge bg-light text-dark">#RES-{res.id}</small>
                    </div>
                    <p className="small text-muted mb-2">Test: {res.LabRequest?.test_type}</p>
                    <div className={`card-text p-2 bg-light rounded ${getResultClass(res.result)}`} style={{fontSize: '0.9rem'}}>
                      {res.result}
                    </div>
                    <div className="mt-3 pt-2 border-top">
                       <small className="text-muted">{new Date(res.uploaded_at).toLocaleDateString()} — Completed</small>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-12 text-muted text-center py-5">
                <div className="bg-white p-5 rounded-4 shadow-sm">
                   <i className="bi bi-file-earmark-x fs-1 opacity-25"></i>
                   <p className="mt-3">No {filter.toLowerCase()} results found.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
           <div className="card border-0 shadow-sm mb-4">
             <div className="card-body">
                <h6>Summary</h6>
                <div style={{ height: "200px" }}>
                  <Pie data={pieData} options={options} />
                </div>
             </div>
           </div>
           
           <div className="card border-0 shadow-sm">
             <div className="card-body">
                <h6>Trend Analysis</h6>
                <div style={{ height: "200px" }}>
                  <Line data={lineData} options={options} />
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
