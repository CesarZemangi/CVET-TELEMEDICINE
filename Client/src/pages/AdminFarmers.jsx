import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await api.get('/admin/farmers');
        setFarmers(res.data);
      } catch (err) {
        console.error("Error fetching farmers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h4 className="fw-bold">Farmers Directory</h4>
        <p className="text-muted small">Overview of registered farmers and their livestock data.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Farmer Name</th>
                  <th>Farm Name</th>
                  <th>Location</th>
                  <th>Livestock Count</th>
                  <th>Total Cases</th>
                  <th>Open Cases</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4">Loading farmers...</td></tr>
                ) : farmers.length > 0 ? farmers.map(f => (
                  <tr key={f.id}>
                    <td className="ps-4 fw-bold">{f.name}</td>
                    <td>{f.farm_name}</td>
                    <td>{f.location}</td>
                    <td>{f.livestock_count}</td>
                    <td>{f.totalCases}</td>
                    <td>{f.openCases}</td>
                    <td className="text-center">
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => navigate('/admindashboard/communication/messages', { state: { initialPartner: { id: f.id, name: f.name, role: 'farmer' } } })}
                      >
                        Contact
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-4 text-muted">No farmers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
