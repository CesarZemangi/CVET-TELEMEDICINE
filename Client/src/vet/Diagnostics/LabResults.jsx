import React, { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { getLabResults } from "../services/vet.diagnostics.service";
import DashboardSection from "../../components/dashboard/DashboardSection";
import FormModalWrapper from "../../components/common/FormModalWrapper";
import { Chart as ChartJS, Filler } from "chart.js";

// Register filler to avoid warnings if any chart uses fill in this module.
try { ChartJS.register(Filler); } catch {}

export default function LabResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const focusHandledRef = useRef(false);

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

  useEffect(() => {
    // If navigated here with a specific lab request, open its result once data is loaded.
    if (loading || focusHandledRef.current) return;
    const focusId = location.state?.labRequestId;
    if (!focusId) return;
    const match = results.find((r) => {
      const reqId = r?.LabRequest?.id || r?.LabRequest?.lab_request_id || r?.lab_request_id;
      return String(reqId) === String(focusId);
    });
    if (match) {
      setSelectedResult(match);
      setShowModal(true);
      focusHandledRef.current = true;
      // clear state so back/forward don't keep reopening
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [loading, results, location, navigate]);

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
      <FormModalWrapper
        show={showModal && !!selectedResult}
        title="Lab Result Details"
        onClose={() => setShowModal(false)}
        onSubmit={(e) => {
          e.preventDefault();
          setShowModal(false);
        }}
        submitLabel="Close"
        cancelLabel="Cancel"
      >
        <div className="mb-3">
          <label className="form-label small fw-bold text-muted">Case</label>
          <p className="fw-medium">{selectedResult?.LabRequest?.Case?.title}</p>
        </div>
        <div className="mb-3">
          <label className="form-label small fw-bold text-muted">Test Type</label>
          <p className="fw-medium">{selectedResult?.LabRequest?.test_type}</p>
        </div>
        <div className="mb-3">
          <label className="form-label small fw-bold text-muted">Findings</label>
          <div className="p-3 bg-light rounded border">
            {selectedResult?.result}
          </div>
        </div>
        <div className="text-muted small">
          Uploaded on: {selectedResult?.uploaded_at ? new Date(selectedResult.uploaded_at).toLocaleString() : "N/A"}
        </div>
      </FormModalWrapper>
    </DashboardSection>
  )
}
