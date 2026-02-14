import React, { useState, useEffect } from "react"
import { getCases, assignCase } from "./services/vet.cases.service"
import CaseDetailsModal from "../components/dashboard/CaseDetailsModal";

export default function VetCases() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCases = async () => {
    try {
      setLoading(true)
      const data = await getCases()
      setCases(data)
    } catch (error) {
      console.error("Error fetching cases:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCases()
  }, [])

  const handleAssign = async (id) => {
    try {
      await assignCase(id)
      alert("Case assigned successfully")
      fetchCases()
    } catch (error) {
      alert("Failed to assign case")
    }
  }

  const handleViewCase = (caseData) => {
    setSelectedCase(caseData);
    setIsModalOpen(true);
  };

  return (
    <div className="container-fluid px-4 py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Incoming Cases</h4>
        <small className="text-muted">
          Review animal health issues reported by farmers
        </small>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Animal</th>
                  <th>Symptoms</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                {cases.length > 0 ? cases.map(c => (
                  <tr key={c.id}>
                    <td>
                      <i className="bi bi-heart-pulse-fill text-success me-2"></i>
                      {c.animal_type || 'N/A'}
                    </td>
                    <td>{c.description}</td>
                    <td>
                      <span className={`badge ${c.status === 'open' ? 'bg-danger' : 'bg-success'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="text-end">
                      {c.status === 'open' && (
                        <button 
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleAssign(c.id)}
                        >
                          Accept
                        </button>
                      )}
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleViewCase(c)}
                      >
                        View Case
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="text-center py-4 text-muted">No cases found</td></tr>
                )}
              </tbody>
            </table>
          )}

        </div>
      </div>

      <CaseDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        caseData={selectedCase} 
      />
    </div>
  )
}
