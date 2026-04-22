import React, { useState, useEffect } from "react"
import { Pie, Line } from "react-chartjs-2"
import { getLabResults, getLabRequests, uploadLabResult, deleteLabResult } from "../services/farmer.diagnostics.service"
import { getFileUrl } from "../../utils"
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  Filler
} from "chart.js"

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title, Filler)

export default function LabResults() {
  const [filter, setFilter] = useState("All")
  const [results, setResults] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [uploadResult, setUploadResult] = useState('')
  const [uploadStatus, setUploadStatus] = useState('normal') // kept for UI state but not sent if column absent
  const [uploadFile, setUploadFile] = useState(null)
  const [message, setMessage] = useState('')
  const [fieldError, setFieldError] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resultsRes, requestsRes] = await Promise.allSettled([
        getLabResults(),
        getLabRequests()
      ]);

      const extractList = (payload) => {
        const seen = new Set();
        const queue = [payload];
        while (queue.length) {
          const cur = queue.shift();
          if (!cur || typeof cur !== "object") continue;
          if (seen.has(cur)) continue;
          seen.add(cur);
          if (Array.isArray(cur)) return cur;
          if (Array.isArray(cur?.data)) return cur.data;
          if (Array.isArray(cur?.data?.data)) return cur.data.data;
          if (Array.isArray(cur?.lab_requests)) return cur.lab_requests;
          if (Array.isArray(cur?.data?.lab_requests)) return cur.data.lab_requests;
          if (Array.isArray(cur?.data?.data?.lab_requests)) return cur.data.data.lab_requests;
          if (Array.isArray(cur?.rows)) return cur.rows;
          if (Array.isArray(cur?.data?.rows)) return cur.data.rows;
          if (Array.isArray(cur?.lab_requests?.rows)) return cur.lab_requests.rows;
          if (Array.isArray(cur?.data?.lab_requests?.rows)) return cur.data.lab_requests.rows;
          for (const val of Object.values(cur)) {
            if (Array.isArray(val)) return val;
            if (val && typeof val === "object") queue.push(val);
          }
        }
        return [];
      };

      const normalizeReq = (r) => {
        const id = r?.lab_request_id ?? r?.id;
        const caseRef = r?.Case || r?.case || {};
        return {
          id,
          lab_request_id: id,
          case_id: r?.case_id ?? caseRef?.id ?? caseRef?.case_id ?? null,
          test_type: r?.test_type ?? r?.test_name ?? "",
          status: String(r?.status || r?.lab_status || r?.labrequest_status || "pending").toLowerCase(),
          created_at: r?.created_at ?? r?.createdAt ?? null,
          updated_at: r?.updated_at ?? r?.updatedAt ?? null,
          vet_id: r?.vet_id ?? r?.vetId ?? r?.vet?.id ?? null,
          notes: r?.notes ?? r?.description ?? "",
          created_by: r?.created_by ?? r?.createdBy ?? null,
          updated_by: r?.updated_by ?? r?.updatedBy ?? null,
          deleted_at: r?.deleted_at ?? r?.deletedAt ?? null,
          Case: caseRef
        };
      };

      const normalizeResult = (res) => {
        const labReqId = res?.lab_request_id ?? res?.LabRequest?.lab_request_id ?? res?.LabRequest?.id ?? null;
        const caseId = res?.case_id ?? res?.LabRequest?.case_id ?? res?.LabRequest?.Case?.id ?? null;
        const caseTitle = res?.LabRequest?.Case?.title || (caseId ? `Case #${caseId}` : "Case");
        const status = "normal"; // schema has no status; default to normal for charts/filters
        return {
          ...res,
          id: res?.id,
          lab_request_id: labReqId,
          file_url: res?.file_url ? getFileUrl(res.file_url) : "",
          result: res?.result ?? "",
          status,
          uploaded_at: res?.uploaded_at ?? res?.created_at ?? res?.createdAt ?? null,
          created_by: res?.created_by ?? res?.createdBy ?? null,
          updated_by: res?.updated_by ?? res?.updatedBy ?? null,
          created_at: res?.created_at ?? res?.createdAt ?? null,
          updated_at: res?.updated_at ?? res?.updatedAt ?? null,
          LabRequest: {
            id: labReqId,
            lab_request_id: labReqId,
            case_id: caseId,
            test_type: res?.test_type ?? res?.LabRequest?.test_type ?? "Lab Test",
            Case: res?.LabRequest?.Case ?? (caseId ? { id: caseId, title: caseTitle } : null)
          }
        };
      };

      const resultList = resultsRes.status === "fulfilled" ? extractList(resultsRes.value) : [];
      const requestList = requestsRes.status === "fulfilled" ? extractList(requestsRes.value) : [];

      setResults(resultList.map(normalizeResult));
      setRequests(requestList.map(normalizeReq));
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
    if (!uploadResult.trim() && !uploadFile) {
      setFieldError("Add result text or upload a PDF.");
      return;
    }

    try {
      setUploading(true);
      setMessage('');
      setFieldError('');
      const formData = new FormData();
      const chosenId = selectedRequest?.id || selectedRequest?.lab_request_id;
      if (chosenId) {
        formData.append("lab_request_id", chosenId);
      }
      if (uploadResult.trim()) formData.append("result", uploadResult.trim());
      // Only append status if backend expects it; omit to avoid column errors.
      // formData.append("status", uploadStatus);
      if (uploadFile) formData.append("lab_file", uploadFile);

      await uploadLabResult(formData);
      setMessage('Lab result uploaded successfully!');
      setUploadResult('');
      setUploadStatus('normal');
      setUploadFile(null);
      setSelectedRequest(null);
      fetchData();
    } catch (err) {
      setMessage('Failed to upload: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  }

  const filteredResults = results.filter(res => {
    if (filter === "All") return true
    return filter === "Abnormal" ? res.status === 'abnormal' : res.status === 'normal'
  })

  const getResultClass = (res) =>
    res.status === 'abnormal'
      ? "text-danger fw-bold"
      : "text-success"

  const pieData = {
    labels: ["Normal", "Abnormal"],
    datasets: [
      {
        data: [
          results.filter(r => r.status === 'normal').length,
          results.filter(r => r.status === 'abnormal').length
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
        data: results.map(r => r.status === 'abnormal' ? 1 : 0),
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
          <div className="mb-3">
            <label className="form-label small fw-bold">Link to Lab Request (optional)</label>
            <select 
              className="form-select"
              value={selectedRequest?.id || selectedRequest?.lab_request_id || ''}
              onChange={(e) => {
                const req = requests.find(r => String(r.id || r.lab_request_id) === e.target.value);
                setSelectedRequest(req || null);
              }}
            >
              <option value="">Select a lab request (pending or completed)</option>
              {requests.map(req => (
                <option key={req.id || req.lab_request_id} value={req.id || req.lab_request_id}>
                  #{req.id || req.lab_request_id} - {req.Case?.title || `Case #${req.case_id}`} - {req.test_type}
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
            <div className="form-text">You may also upload the PDF report below.</div>
            {fieldError && !uploadResult.trim() && !uploadFile && (
              <small className="text-danger d-block mt-1">{fieldError}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Upload PDF (optional)</label>
            <input
              type="file"
              accept="application/pdf"
              className="form-control"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            />
          </div>

          <button 
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Results'}
          </button>
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
                    {res.file_url && (
                      <div className="mt-2">
                        <a href={res.file_url} target="_blank" rel="noreferrer" className="small">
                          View PDF attachment
                        </a>
                      </div>
                    )}
                    <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                       <small className="text-muted">{new Date(res.uploaded_at).toLocaleDateString()} — Completed</small>
                       <button
                         className="btn btn-sm btn-outline-danger"
                         onClick={async () => {
                           if (!window.confirm("Delete this lab result?")) return;
                           try {
                             await deleteLabResult(res.id);
                             fetchData();
                           } catch (err) {
                             alert(err.response?.data?.error || err.message || "Failed to delete result");
                           }
                         }}
                       >
                         Delete
                       </button>
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
