import React, { useState, useEffect } from "react";
import { getCases } from "./services/farmer.cases.service";
import CaseDetailsModal from "../components/dashboard/CaseDetailsModal";

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await getCases();
        setCases(data);
      } catch (err) {
        console.error("Error fetching farmer cases:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const handleViewCase = (caseData) => {
    setSelectedCase(caseData);
    setIsModalOpen(true);
  };

  return (
    <div className="container-fluid px-4 py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Health Cases</h4>
        <small className="text-muted">
          Review animal health issues reported for veterinary care
        </small>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Case</th>
                  <th>Animal</th>
                  <th>Status</th>
                  <th>Date Reported</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {cases.length > 0 ? cases.map(c => (
                  <tr key={c.id}>
                    <td className="ps-4 fw-medium">{c.description}</td>
                    <td>{c.animal_type || 'N/A'}</td>
                    <td>
                      <span className={`badge ${c.status === 'open' ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="text-end pe-4">
                      <button 
                        className="btn btn-sm btn-outline-primary"
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
  );
}
