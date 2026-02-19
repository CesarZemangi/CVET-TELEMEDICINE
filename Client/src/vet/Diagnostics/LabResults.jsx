import React, { useState, useEffect } from "react"
import { getLabResults } from "../services/vet.diagnostics.service";
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function LabResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewResult = (result) => {
    setSelectedResult(result);
    setShowModal(true);
  };

  return (
    <DashboardSection title="Lab Results">
      <p className="mb-4 text-muted">View completed laboratory findings</p>

      <div className="table-responsive">
        <table className="table table-hover align-middle border-top">
          <thead className="table-light">
            <tr>
              <th>Result ID</th>
              <th>Case Title</th>
              <th>Test Type</th>
              <th>Date Uploaded</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
            ) : results.length > 0 ? results.map(r => (
              <tr key={r.id}>
                <td className="fw-bold">#RES-{r.id}</td>
                <td>{r.LabRequest?.Case?.title || `Case #${r.LabRequest?.case_id}`}</td>
                <td>{r.LabRequest?.test_type}</td>
                <td>{new Date(r.uploaded_at).toLocaleDateString()}</td>
                <td className="text-end">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleViewResult(r)}
                  >
                    View Result
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="text-center py-4 text-muted">No lab results found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Result Modal */}
      {showModal && selectedResult && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Lab Result Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Case</label>
                  <p className="fw-medium">{selectedResult.LabRequest?.Case?.title}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Test Type</label>
                  <p className="fw-medium">{selectedResult.LabRequest?.test_type}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Findings</label>
                  <div className="p-3 bg-light rounded border">
                    {selectedResult.result}
                  </div>
                </div>
                <div className="text-muted small">
                  Uploaded on: {new Date(selectedResult.uploaded_at).toLocaleString()}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardSection>
  )
}
