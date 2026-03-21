import React, { useState, useEffect } from "react"
import { getMedicationHistory } from "../services/vet.treatment.service"
import { getCasesForDropdown } from "../services/vet.cases.service"
import DashboardSection from "../../components/dashboard/DashboardSection"

export default function MedicationHistory() {
  const [medications, setMedications] = useState([])
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCaseId, setSelectedCaseId] = useState("")

  const fetchData = async () => {
    setLoading(true)
    const [historyRes, casesRes] = await Promise.allSettled([
      getMedicationHistory(),
      getCasesForDropdown()
    ])

    if (historyRes.status === "fulfilled") {
      const historyData = historyRes.value
      const historyList = Array.isArray(historyData?.data) ? historyData.data : (Array.isArray(historyData) ? historyData : []);
      setMedications(historyList)
    } else {
      setMedications([])
      console.error("Error fetching medication history:", historyRes.reason)
    }

    if (casesRes.status === "fulfilled") {
      const casesDropdown = casesRes.value
      const casesList = Array.isArray(casesDropdown?.data) ? casesDropdown.data : (Array.isArray(casesDropdown) ? casesDropdown : []);
      setCases(casesList)
    } else {
      setCases([])
      console.error("Error fetching cases for medication history:", casesRes.reason)
    }

    setLoading(false)
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
    if (!formData.case_id || !formData.medication_name.trim()) {
      alert("Select a case and enter medication name.");
      return;
    }
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

  const getCaseOptionLabel = (c) => {
    const shortDesc = c?.description ? String(c.description).trim().slice(0, 50) : "";
    const descriptionPart = shortDesc ? ` - ${shortDesc}${shortDesc.length === 50 ? "..." : ""}` : "";
    return `#${c.id} ${c.title || "Untitled Case"}${descriptionPart}`;
  }

  return (
    <DashboardSection title="Medication History">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0 text-muted">Complete records of medications administered to animals under your care.</p>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold">Filter by Case</label>
        <select
          className="form-select"
          value={selectedCaseId}
          onChange={(e) => setSelectedCaseId(e.target.value)}
        >
          <option value="">All cases</option>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {getCaseOptionLabel(c)}
            </option>
          ))}
        </select>
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
        {medications.filter(m => selectedCaseId ? String(m.case_id) === String(selectedCaseId) : true).length > 0 ? medications.filter(m => selectedCaseId ? String(m.case_id) === String(selectedCaseId) : true).map(m => (
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

      {/* Manual add removed: view-only history filtered by case */}
    </DashboardSection>
  )
}
