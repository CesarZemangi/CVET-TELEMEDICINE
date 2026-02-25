import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CaseDetailsModal from '../components/dashboard/CaseDetailsModal';
import Badge from '../components/ui/Badge';

export default function AdminCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/cases`);
      const casesData = res.data.data || res.data;
      setCases(Array.isArray(casesData) ? casesData : []);
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

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const caseStats = {
    total: cases.length,
    open: cases.filter(c => c.status === 'open').length,
    closed: cases.filter(c => c.status === 'closed').length
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">All Medical Cases</h4>
        <p className="text-muted small">Monitor and manage all animal health cases reported by farmers.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-start-0"
              placeholder="Search cases, farmers, vets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="col-md-5">
          <div className="row g-2">
            <div className="col-auto">
              <div className="card border-0 shadow-sm text-center" style={{ padding: '10px 20px' }}>
                <small className="text-muted d-block">Total Cases</small>
                <h5 className="fw-bold mb-0">{caseStats.total}</h5>
              </div>
            </div>
            <div className="col-auto">
              <div className="card border-0 shadow-sm text-center" style={{ padding: '10px 20px' }}>
                <small className="text-muted d-block">Open</small>
                <h5 className="fw-bold mb-0 text-warning">{caseStats.open}</h5>
              </div>
            </div>
            <div className="col-auto">
              <div className="card border-0 shadow-sm text-center" style={{ padding: '10px 20px' }}>
                <small className="text-muted d-block">Closed</small>
                <h5 className="fw-bold mb-0 text-success">{caseStats.closed}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
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
                  <tr><td colSpan="7" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
                ) : filteredCases.length > 0 ? filteredCases.map(c => (
                  <tr key={c.id}>
                    <td className="ps-4 fw-bold text-primary"># {c.id}</td>
                    <td><strong>{c.farmer?.name || 'Unknown'}</strong></td>
                    <td><div className="text-truncate" style={{maxWidth: '250px', fontSize: '0.9rem'}}>{c.description}</div></td>
                    <td>{c.vet?.name || <span className="text-muted fst-italic">Unassigned</span>}</td>
                    <td>
                      <Badge status={c.status} type="status" />
                    </td>
                    <td className="text-muted small">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="text-end pe-4">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleViewCase(c)}
                      >
                        <i className="bi bi-eye me-1"></i>View
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-5 text-muted">
                    <i className="bi bi-inbox d-block fs-3 mb-2"></i>
                    {cases.length === 0 ? 'No cases found.' : 'No matching cases.'}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white border-0 py-3 text-center">
          <span className="small text-muted">Showing {filteredCases.length} of {cases.length} cases</span>
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
