import React, { useState, useEffect } from "react"
import { getPrescriptions, createPrescription, getCasesForTreatment } from "../services/vet.treatment.service";
import DashboardSection from "../../components/dashboard/DashboardSection"
import FormModalWrapper from "../../components/common/FormModalWrapper";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const initialForm = {
    case_id: "",
    medicine: "",
    dosage: "",
    duration: ""
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    const [presRes, casesRes] = await Promise.allSettled([
      getPrescriptions(),
      getCasesForTreatment()
    ]);

    if (presRes.status === "fulfilled") {
      const presData = presRes.value;
      const presList = Array.isArray(presData?.data) ? presData.data : (Array.isArray(presData) ? presData : []);
      setPrescriptions(presList);
    } else {
      setPrescriptions([]);
      console.error("Error fetching prescriptions:", presRes.reason);
    }

    if (casesRes.status === "fulfilled") {
      const casesDropdown = casesRes.value;
      const casesList = Array.isArray(casesDropdown?.data) ? casesDropdown.data : (Array.isArray(casesDropdown) ? casesDropdown : []);
      setCases(casesList);
    } else {
      setCases([]);
      console.error("Error fetching cases for prescriptions:", casesRes.reason);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.case_id || !formData.medicine.trim() || !formData.dosage.trim()) {
      alert("Case, medicine, and dosage are required.");
      return;
    }
    try {
      await createPrescription(formData);
      setShowAddModal(false);
      setFormData(initialForm);
      fetchData();
    } catch (err) {
      alert("Failed to create prescription: " + (err.response?.data?.error || err.message));
    }
  };

  const getCaseOptionLabel = (c) => {
    const shortDesc = c?.description ? String(c.description).trim().slice(0, 50) : "";
    const descriptionPart = shortDesc ? ` - ${shortDesc}${shortDesc.length === 50 ? "..." : ""}` : "";
    return `#${c.id} ${c.title || "Untitled Case"}${descriptionPart}`;
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
      <FormModalWrapper
        show={showAddModal}
        title="Issue New Prescription"
        onClose={() => {
          setShowAddModal(false);
          setFormData(initialForm);
        }}
        onSubmit={handleSubmit}
        submitLabel="Save Prescription"
      >
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Case</label>
                    <select 
                      className="form-select" 
                      required 
                      value={formData.case_id}
                      onChange={e => setFormData(prev => ({...prev, case_id: e.target.value}))}
                    >
                      <option value="">Select a case</option>
                      {cases.map(c => (
                        <option key={c.id} value={c.id}>
                          {getCaseOptionLabel(c)}
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
                      onChange={e => setFormData(prev => ({...prev, medicine: e.target.value}))}
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
                        onChange={e => setFormData(prev => ({...prev, dosage: e.target.value}))}
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
                        onChange={e => setFormData(prev => ({...prev, duration: e.target.value}))}
                      />
                    </div>
                  </div>
      </FormModalWrapper>
    </DashboardSection>
  )
}
