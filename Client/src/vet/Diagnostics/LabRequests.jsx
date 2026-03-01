import React, { useState, useEffect } from "react"
import { getLabRequests, createLabRequest, uploadLabResult, getCasesForDiagnostics } from "../services/vet.diagnostics.service";
import DashboardSection from "../../components/dashboard/DashboardSection";
import FormModalWrapper from "../../components/common/FormModalWrapper";

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
    setLoading(true);
    const [reqsRes, casesRes] = await Promise.allSettled([
      getLabRequests(),
      getCasesForDiagnostics()
    ]);

    if (reqsRes.status === "fulfilled") {
      const reqs = reqsRes.value;
      const reqList = Array.isArray(reqs?.data) ? reqs.data : (Array.isArray(reqs) ? reqs : []);
      setRequests(reqList);
    } else {
      setRequests([]);
      console.error("Error fetching lab requests:", reqsRes.reason);
    }

    if (casesRes.status === "fulfilled") {
      const casesDropdown = casesRes.value;
      const casesList = Array.isArray(casesDropdown?.data) ? casesDropdown.data : (Array.isArray(casesDropdown) ? casesDropdown : []);
      setCases(casesList);
    } else {
      setCases([]);
      console.error("Error fetching cases for diagnostics:", casesRes.reason);
    }

    setLoading(false);
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

  const getCaseOptionLabel = (c) => {
    const shortDesc = c?.description ? String(c.description).trim().slice(0, 50) : "";
    const descriptionPart = shortDesc ? ` - ${shortDesc}${shortDesc.length === 50 ? "..." : ""}` : "";
    return `#${c.id} ${c.title || "Untitled Case"}${descriptionPart}`;
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
      <FormModalWrapper
        show={showAddModal}
        title="Request New Lab Test"
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateRequest}
        submitLabel="Create Request"
      >
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Assigned Case</label>
                    <select 
                      className="form-select" 
                      required 
                      disabled={cases.length === 0}
                      value={newRequest.case_id}
                      onChange={e => setNewRequest({...newRequest, case_id: e.target.value})}
                    >
                      <option value="">Select a case</option>
                      {cases.map(c => (
                        <option key={c.id} value={c.id}>
                          {getCaseOptionLabel(c)}
                        </option>
                      ))}
                    </select>
                    {cases.length === 0 && (
                      <small className="text-danger">No assigned cases available.</small>
                    )}
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
      </FormModalWrapper>

      {/* Upload Result Modal */}
      <FormModalWrapper
        show={showResultModal}
        title="Upload Lab Result"
        onClose={() => setShowResultModal(false)}
        onSubmit={handleUploadResult}
        submitLabel="Save Result"
      >
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
      </FormModalWrapper>
    </DashboardSection>
  )
}
