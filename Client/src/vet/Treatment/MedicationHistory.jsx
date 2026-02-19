import React, { useState, useEffect } from "react"
import { getMedicationHistory, createMedicationHistory } from "../services/vet.treatment.service"
import { getCases } from "../services/vet.cases.service"
import DashboardSection from "../../components/dashboard/DashboardSection"

export default function MedicationHistory() {
  const [medications, setMedications] = useState([])
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    case_id: "",
    animal_id: "",
    medication_name: "",
    dosage: "",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    notes: ""
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const historyData = await getMedicationHistory()
      setMedications(historyData)
      const casesData = await getCases()
      setCases(casesData?.data || casesData || [])
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCaseChange = (e) => {
    const caseId = e.target.value
    const selectedCase = cases.find(c => c.id === parseInt(caseId))
    setFormData({
      ...formData,
      case_id: caseId,
      animal_id: selectedCase ? selectedCase.animal_id : ""
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createMedicationHistory(formData)
      setShowAddModal(false)
      setFormData({
        case_id: "",
        animal_id: "",
        medication_name: "",
        dosage: "",
        start_date: new Date().toISOString().split('T')[0],
        end_date: "",
        notes: ""
      })
      fetchData()
    } catch (err) {
      alert("Failed to add record: " + (err.response?.data?.error || err.message))
    }
  }

  return (
    <DashboardSection title="Medication History">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0 text-muted">Complete records of medications administered to animals under your care.</p>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-circle me-1"></i> Add Record
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Start Date</th>
                    <th>Animal</th>
                    <th>Case</th>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>End Date</th>
                    <th className="pe-4">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.length > 0 ? medications.map(m => (
                    <tr key={m.id}>
                      <td className="ps-4 small">
                        {new Date(m.start_date).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="fw-medium">{m.Animal?.tag_number || m.animal_id}</span>
                        <br />
                        <small className="text-muted">{m.Animal?.species}</small>
                      </td>
                      <td>
                        <small className="text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                          {m.Case?.title || "N/A"}
                        </small>
                      </td>
                      <td className="fw-bold text-brown">{m.medication_name}</td>
                      <td>{m.dosage}</td>
                      <td>
                        {m.end_date ? new Date(m.end_date).toLocaleDateString() : "-"}
                      </td>
                      <td className="pe-4">
                        <small className="text-wrap" style={{ maxWidth: '150px', display: 'block' }}>
                          {m.notes || "-"}
                        </small>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" className="text-center py-4 text-muted">No records found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Add Medication Record</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Case</label>
                    <select 
                      className="form-select" 
                      required 
                      value={formData.case_id} 
                      onChange={handleCaseChange}
                    >
                      <option value="">Choose a case...</option>
                      {cases.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({c.Animal?.tag_number})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Medication Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.medication_name}
                      onChange={e => setFormData({...formData, medication_name: e.target.value})}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Dosage</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        value={formData.dosage}
                        onChange={e => setFormData({...formData, dosage: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Start Date</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        required 
                        value={formData.start_date}
                        onChange={e => setFormData({...formData, start_date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">End Date (Optional)</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={formData.end_date}
                      onChange={e => setFormData({...formData, end_date: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Notes</label>
                    <textarea 
                      className="form-control" 
                      rows="2"
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Record</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardSection>
  )
}
