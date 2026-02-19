import React, { useState, useEffect } from "react";
import { getVetConsultations, createConsultation } from "../services/consultation";
import { getVetCases } from "../services/cases";

export default function VetConsultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cases, setCases] = useState([]);
  const [formData, setFormData] = useState({
    case_id: "",
    mode: "chat",
    notes: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [consData, casesData] = await Promise.all([
        getVetConsultations(),
        getVetCases()
      ]);
      setConsultations(consData?.data || consData || []);
      setCases(casesData?.data || casesData || []);
    } catch (err) {
      console.error("Error fetching consultations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartConsultation = async (e) => {
    e.preventDefault();
    try {
      await createConsultation(formData);
      setShowModal(false);
      setFormData({ case_id: "", mode: "chat", notes: "" });
      fetchData();
    } catch (err) {
      alert("Failed to start consultation: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-1">Consultations</h4>
          <small className="text-muted">Ongoing animal health consultations</small>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-2"></i> Start Consultation
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Case ID</th>
                  <th>Farmer</th>
                  <th>Animal</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4"><div className="spinner-border text-primary"></div></td></tr>
                ) : consultations.length > 0 ? consultations.map(c => (
                  <tr key={c.id}>
                    <td className="ps-4 fw-bold">#C{c.case_id}</td>
                    <td>{c.Case?.farmer?.name || 'N/A'}</td>
                    <td>{c.Case?.animal?.species || 'N/A'}</td>
                    <td className="text-capitalize">{c.mode}</td>
                    <td><span className="badge bg-success">Active</span></td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-primary me-2">Continue</button>
                      <button className="btn btn-sm btn-outline-secondary">Notes</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-4 text-muted">No active consultations</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleStartConsultation}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Start New Consultation</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Assigned Case</label>
                    <select 
                      className="form-select" 
                      required 
                      value={formData.case_id}
                      onChange={e => setFormData({...formData, case_id: e.target.value})}
                    >
                      <option value="">Select a case</option>
                      {cases.filter(c => c.status === 'open').map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title} (ID: {c.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Consultation Mode</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="mode" id="chat" value="chat" checked={formData.mode === 'chat'} onChange={e => setFormData({...formData, mode: e.target.value})} />
                        <label className="form-check-label" htmlFor="chat">Chat</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="mode" id="video" value="video" checked={formData.mode === 'video'} onChange={e => setFormData({...formData, mode: e.target.value})} />
                        <label className="form-check-label" htmlFor="video">Video</label>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Initial Notes (Optional)</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                      placeholder="Enter preliminary observations..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Start</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
