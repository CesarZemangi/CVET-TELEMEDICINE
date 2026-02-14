import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await api.get('/admin/consultations');
        setConsultations(res.data);
      } catch (err) {
        console.error("Error fetching consultations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h4 className="fw-bold">Virtual Consultations</h4>
        <p className="text-muted small">Overview of all scheduled and completed veterinary consultations.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Vet Name</th>
                  <th>Related Case</th>
                  <th>Scheduled For</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4">Loading consultations...</td></tr>
                ) : consultations.length > 0 ? consultations.map(c => (
                  <tr key={c.id}>
                    <td className="ps-4 text-muted">{c.id}</td>
                    <td className="fw-bold">{c.vet?.name}</td>
                    <td>Case # {c.case_id}</td>
                    <td>{new Date(c.scheduled_at).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${c.status === 'completed' ? 'bg-success' : c.status === 'active' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-outline-primary">View Report</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No consultations found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
