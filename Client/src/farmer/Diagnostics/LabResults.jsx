import React, { useState, useEffect } from "react"
import { Pie, Line } from "react-chartjs-2"
import { getLabResults, getLabRequests, uploadLabResult } from "../services/farmer.diagnostics.service"
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
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [uploadResult, setUploadResult] = useState('')
  const [message, setMessage] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resultsData, requestsData] = await Promise.all([
        getLabResults(),
        getLabRequests()
      ]);
      console.log("Results Data:", resultsData);
      console.log("Requests Data:", requestsData);
      setResults(Array.isArray(resultsData?.data) ? resultsData.data : Array.isArray(resultsData) ? resultsData : []);
      setRequests(Array.isArray(requestsData?.data) ? requestsData.data : Array.isArray(requestsData) ? requestsData : []);
    } catch (err) {
      console.error("Error fetching lab data:", err);
      setResults([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleUpload = async () => {
    if (!selectedRequest || !uploadResult.trim()) {
      setMessage("Please select a lab request and enter results");
      return;
    }

    try {
      setUploading(true);
      setMessage('');
      await uploadLabResult({
        lab_request_id: selectedRequest.id,
        result: uploadResult
      });
      setMessage('Lab result uploaded successfully!');
      setUploadResult('');
      setSelectedRequest(null);
      fetchData();
    } catch (err) {
      setMessage('Failed to upload: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  }

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

  const pendingRequests = requests.filter(r => r.status === 'pending')

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h4 className="fw-bold">Lab Results</h4>
        <p className="text-muted small">Upload your clinic lab results and view diagnostic findings for your livestock.</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} border-0 shadow-sm mb-4`}>
          {message}
        </div>
      )}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-light">
          <h6 className="mb-0 fw-bold">
            <i className="bi bi-cloud-upload me-2"></i>Upload Lab Results
          </h6>
        </div>
        <div className="card-body">
          {pendingRequests.length > 0 ? (
            <>
              <div className="mb-3">
                <label className="form-label small fw-bold">Select Lab Request *</label>
                <select 
                  className="form-select"
                  value={selectedRequest?.id || ''}
                  onChange={(e) => {
                    const req = requests.find(r => r.id === parseInt(e.target.value));
                    setSelectedRequest(req || null);
                  }}
                >
                  <option value="">Choose a pending lab request...</option>
                  {pendingRequests.map(req => (
                    <option key={req.id} value={req.id}>
                      Case: {req.Case?.title} - {req.test_type}  
                    </option>
                  ))}
                </select>
              </div>

              {selectedRequest && (
                <div className="mb-3 p-3 bg-light rounded">
                  <p className="text-muted small mb-1">
                    <strong>Test Type:</strong> {selectedRequest.test_type}
                  </p>
                  {selectedRequest.notes && (
                    <p className="text-muted small mb-0">
                      <strong>Vet Notes:</strong> {selectedRequest.notes}
                    </p>
                  )}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold">Lab Results / Findings *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Enter your lab test results and findings from the clinic..."
                  value={uploadResult}
                  onChange={(e) => setUploadResult(e.target.value)}
                ></textarea>
              </div>

              <button 
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={uploading || !selectedRequest}
              >
                {uploading ? 'Uploading...' : 'Upload Results'}
              </button>
            </>
          ) : (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-inbox fs-3 d-block mb-2 opacity-50"></i>
              <p className="mb-0">No pending lab requests. The vet will create a lab request when needed.</p>
            </div>
          )}
        </div>
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

      <div className="mb-4">
        <h5 className="fw-bold">Completed Lab Results</h5>
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
