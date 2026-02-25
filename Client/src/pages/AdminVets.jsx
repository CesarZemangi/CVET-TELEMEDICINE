import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminVets() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h4 className="fw-bold">Veterinarians Directory</h4>
        <p className="text-muted small">Manage expert veterinarians and monitor their activity.</p>
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
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4">Loading veterinarians...</td></tr>
                ) : vets.length > 0 ? vets.map(v => (
                  <tr key={v.id}>
                    <td className="ps-4 fw-bold">{v.name}</td>
                    <td>{v.specialization || 'N/A'}</td>
                    <td className="text-danger small">{v.license_number || 'N/A'}</td>
                    <td>{v.experience_years || 0} yrs</td>
                    <td><span className="badge rounded-pill bg-info">{v.assignedCases || 0}</span></td>
                    <td><span className="badge rounded-pill bg-secondary">{v.totalConsultations || 0}</span></td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate('/admindashboard/vet-performance', { state: { vetId: v.id } })}
                        >
                          Performance
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => navigate('/admindashboard/communication/messages', { state: { initialPartner: { id: v.id, name: v.name, role: 'vet' } } })}
                        >
                          Contact
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-4 text-muted">No veterinarians found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
