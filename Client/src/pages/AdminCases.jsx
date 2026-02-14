import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CaseDetailsModal from '../components/dashboard/CaseDetailsModal';

export default function AdminCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCases = async () => {
    try {
      const res = await api.get('/admin/cases');
      setCases(res.data);
    } catch (err) {
      console.error("Error fetching cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleViewCase = (caseData) => {
    setSelectedCase(caseData);
    setIsModalOpen(true);
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h4 className="fw-bold">All Medical Cases</h4>
        <p className="text-muted small">Monitor and manage all animal health cases reported by farmers.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Case ID</th>
                  <th>Farmer</th>
                  <th>Description</th>
                  <th>Assigned Vet</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4">Loading cases...</td></tr>
                ) : cases.length > 0 ? cases.map(c => (
                  <tr key={c.id}>
                    <td className="ps-4 fw-bold text-primary"># {c.id}</td>
                    <td>{c.farmer?.name || 'Unknown'}</td>
                    <td><div className="text-truncate" style={{maxWidth: '200px'}}>{c.description}</div></td>
                    <td>{c.vet?.name || <span className="text-muted italic">Unassigned</span>}</td>
                    <td>
                      <span className={`badge ${c.status === 'open' ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="text-end pe-4">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleViewCase(c)}
                      >
                        View Case
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-4 text-muted">No cases found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
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
