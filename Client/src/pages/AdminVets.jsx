import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminVets() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const res = await api.get('/admin/vets');
        setVets(res.data);
      } catch (err) {
        console.error("Error fetching vets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVets();
  }, []);

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h4 className="fw-bold">Veterinarians Directory</h4>
        <p className="text-muted small">Manage expert veterinarians and monitor their consultation activity.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Vet Name</th>
                  <th>Specialization</th>
                  <th>License #</th>
                  <th>Exp (Years)</th>
                  <th>Assigned Cases</th>
                  <th>Consultations</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4">Loading veterinarians...</td></tr>
                ) : vets.length > 0 ? vets.map(v => (
                  <tr key={v.id}>
                    <td className="ps-4 fw-bold">{v.name}</td>
                    <td>{v.specialization}</td>
                    <td><code className="small">{v.license_number}</code></td>
                    <td>{v.experience_years} yrs</td>
                    <td><span className="badge bg-info text-white rounded-pill">{v.assignedCases}</span></td>
                    <td>
                      <span className={`badge ${v.totalConsultations > 0 ? 'bg-success' : 'bg-light text-muted'}`}>
                        {v.totalConsultations}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-outline-primary me-2">Performance</button>
                      <button className="btn btn-sm btn-outline-secondary">Contact</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-4">No veterinarians found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
