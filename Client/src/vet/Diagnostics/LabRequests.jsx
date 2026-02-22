import React, { useState, useEffect } from "react"
import { getLabRequests, createLabRequest, uploadLabResult, getCasesForDiagnostics } from "../services/vet.diagnostics.service";
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function LabRequests() {
  const [requests, setRequests] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRequest, setNewRequest] = useState({ case_id: "", test_type: "" });
  
  const [showResultModal, setShowResultModal] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [resultText, setResultText] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const reqs = await getLabRequests();
      const casesDropdown = await getCasesForDiagnostics();
      setRequests(reqs?.data || reqs || []);
      setCases(casesDropdown?.data || casesDropdown || []);
    } catch (err) {
      console.error("Error fetching lab requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await createLabRequest(newRequest);
      setShowAddModal(false);
      setNewRequest({ case_id: "", test_type: "" });
      fetchData();
    } catch (err) {
      alert("Failed to create request: " + (err.response?.data?.error || err.message));
    }
  };

  const handleUploadResult = async (e) => {
    e.preventDefault();
    try {
      await uploadLabResult({
        lab_request_id: activeRequestId,
        result: resultText
      });
      setShowResultModal(false);
      setResultText("");
      fetchData();
    } catch (err) {
      alert("Failed to upload result: " + (err.response?.data?.error || err.message));
    }
  };

  const filteredRequests = requests.filter(req =>
    filter === "All" ? true : req.status === filter.toLowerCase()
  )

  const getStatusClass = (status) => {
    switch (status) {
      case "pending": return "badge bg-danger"
      case "completed": return "badge bg-success"
      default: return "badge bg-secondary"
    }
  }

  return (
    <DashboardSection title="Lab Test Requests">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0 text-muted">Manage lab tests for your assigned cases</p>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>New Request
        </button>
      </div>

      <div className="mb-3 d-flex gap-2">
        {["All", "Pending", "Completed"].map(status => (
          <button
            key={status}
            className={`btn btn-sm ${filter === status ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle border-top">
          <thead className="table-light">
            <tr>
              <th>Request ID</th>
              <th>Case Title</th>
              <th>Test Type</th>
              <th>Status</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
            ) : filteredRequests.length > 0 ? filteredRequests.map(req => (
              <tr key={req.id}>
                <td className="fw-bold">#LR-{req.id}</td>
                <td>{req.Case?.title || `Case #${req.case_id}`}</td>
                <td>{req.test_type}</td>
                <td>
                  <span className={getStatusClass(req.status)}>{req.status}</span>
                </td>
                <td className="text-end">
                  {req.status === 'pending' && (
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        setActiveRequestId(req.id);
                        setShowResultModal(true);
                      }}
                    >
                      Upload Result
                    </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="text-center py-4 text-muted">No requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Request Modal */}
      {showAddModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleCreateRequest}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Request New Lab Test</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Assigned Case</label>
                    <select 
                      className="form-select" 
                      required 
                      value={newRequest.case_id}
                      onChange={e => setNewRequest({...newRequest, case_id: e.target.value})}
                    >
                      <option value="">Select a case</option>
                      {cases.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title} (ID: {c.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Test Type</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Blood panel, Milk culture" 
                      required 
                      value={newRequest.test_type}
                      onChange={e => setNewRequest({...newRequest, test_type: e.target.value})}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Request</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Upload Result Modal */}
      {showResultModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleUploadResult}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Upload Lab Result</h5>
                  <button type="button" className="btn-close" onClick={() => setShowResultModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Result Summary</label>
                    <textarea 
                      className="form-control" 
                      rows="5" 
                      placeholder="Enter the lab findings and observations" 
                      required 
                      value={resultText}
                      onChange={e => setResultText(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowResultModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success">Save Result</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardSection>
  )
}
