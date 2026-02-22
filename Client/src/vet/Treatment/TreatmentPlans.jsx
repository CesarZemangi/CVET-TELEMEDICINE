import React, { useState, useEffect } from "react"
import { getTreatmentPlans, createTreatmentPlan } from "../services/vet.treatment.service";
import { getCasesForDropdown } from "../services/vet.cases.service";
import DashboardSection from "../../components/dashboard/DashboardSection"

export default function TreatmentPlans() {
  const [plans, setPlans] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    case_id: "",
    plan_details: "",
    start_date: "",
    end_date: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const plansData = await getTreatmentPlans();
      const casesDropdown = await getCasesForDropdown();
      setPlans(plansData?.data || plansData || []);
      setCases(casesDropdown?.data || []);
    } catch (err) {
      console.error("Error fetching treatment plans:", err);
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
      await createTreatmentPlan(formData);
      setShowAddModal(false);
      setFormData({ case_id: "", plan_details: "", start_date: "", end_date: "" });
      fetchData();
    } catch (err) {
      alert("Failed to create treatment plan: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <DashboardSection title="Treatment Plans">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0 text-muted">Manage long-term care plans for assigned cases</p>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>New Plan
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle border-top">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Case</th>
              <th>Details</th>
              <th>Timeline</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
            ) : plans.length > 0 ? plans.map(p => (
              <tr key={p.id}>
                <td>#TP-{p.id}</td>
                <td>{p.Case?.title || `Case #${p.case_id}`}</td>
                <td>{p.plan_details}</td>
                <td>
                  <small className="d-block text-muted">
                    {p.start_date ? new Date(p.start_date).toLocaleDateString() : 'N/A'} 
                    {' - '}
                    {p.end_date ? new Date(p.end_date).toLocaleDateString() : 'Ongoing'}
                  </small>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="text-center py-4 text-muted">No treatment plans found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Treatment Plan Modal */}
      {showAddModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Create Treatment Plan</h5>
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
                    <label className="form-label small fw-bold">Plan Details</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      placeholder="Enter structured treatment steps and care instructions" 
                      required 
                      value={formData.plan_details}
                      onChange={e => setFormData({...formData, plan_details: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Start Date</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={formData.start_date}
                        onChange={e => setFormData({...formData, start_date: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">End Date (Optional)</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={formData.end_date}
                        onChange={e => setFormData({...formData, end_date: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Plan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardSection>
  )
}
