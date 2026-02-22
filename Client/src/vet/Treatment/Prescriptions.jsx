import React, { useState, useEffect } from "react"
import { getPrescriptions, createPrescription } from "../services/vet.treatment.service";
import { getCasesForDropdown } from "../services/vet.cases.service";
import DashboardSection from "../../components/dashboard/DashboardSection"

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    case_id: "",
    medicine: "",
    dosage: "",
    duration: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const presData = await getPrescriptions();
      const casesDropdown = await getCasesForDropdown();
      setPrescriptions(presData?.data || presData || []);
      setCases(casesDropdown?.data || []);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPrescription(formData);
      setShowAddModal(false);
      setFormData({ case_id: "", medicine: "", dosage: "", duration: "" });
      fetchData();
    } catch (err) {
      alert("Failed to create prescription: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <DashboardSection title="Prescriptions">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0 text-muted">Manage medication for your assigned cases</p>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>New Prescription
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle border-top">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Case</th>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
            ) : prescriptions.length > 0 ? prescriptions.map(p => (
              <tr key={p.id}>
                <td>#PR-{p.id}</td>
                <td>{p.Case?.title || `Case #${p.case_id}`}</td>
                <td className="fw-bold text-primary">{p.medicine}</td>
                <td>{p.dosage}</td>
                <td>{p.duration}</td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="text-center py-4 text-muted">No prescriptions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Prescription Modal */}
      {showAddModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Issue New Prescription</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Case</label>
                    <select 
                      className="form-select" 
                      required 
                      value={formData.case_id}
                      onChange={e => setFormData({...formData, case_id: e.target.value})}
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
                    <label className="form-label small fw-bold">Medicine Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Oxytetracycline" 
                      required 
                      value={formData.medicine}
                      onChange={e => setFormData({...formData, medicine: e.target.value})}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Dosage</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. 10ml IM daily" 
                        required 
                        value={formData.dosage}
                        onChange={e => setFormData({...formData, dosage: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Duration</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. 5 days" 
                        required 
                        value={formData.duration}
                        onChange={e => setFormData({...formData, duration: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Prescription</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardSection>
  )
}
