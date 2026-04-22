import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/adminFarmers.css';

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

  const stats = useMemo(() => {
    const totals = farmers.reduce(
      (acc, f) => {
        acc.livestock += Number(f.livestock_count || f.livestockCount || 0);
        acc.totalCases += Number(f.totalCases || 0);
        acc.openCases += Number(f.openCases || 0);
        return acc;
      },
      { livestock: 0, totalCases: 0, openCases: 0 }
    );
    return { count: farmers.length, ...totals };
  }, [farmers]);

  return (
    <div className="container-fluid py-4 af-page">
      <div className="af-hero">
        <div>
          <p className="af-kicker">Operations • Live</p>
          <h1 className="af-title">Farmers Directory</h1>
          <p className="af-subtitle">Overview of registered farmers, livestock scale, and case load.</p>
          <div className="af-pills">
            <span className="af-pill">Farmers • {stats.count}</span>
            <span className="af-pill af-pill-emerald">Livestock • {stats.livestock}</span>
            <span className="af-pill af-pill-amber">Open Cases • {stats.openCases}</span>
          </div>
        </div>
      </div>

      <div className="af-card">
        <div className="af-card-header">
          <h3>Roster</h3>
          <span className="af-meta">Updated just now</span>
        </div>
        <div className="af-table-wrapper">
          <table className="af-table">
            <thead>
              <tr>
                <th>Farmer Name</th>
                <th>Farm Name</th>
                <th>Location</th>
                <th>Livestock</th>
                <th>Total Cases</th>
                <th>Open</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading farmers...</td></tr>
              ) : farmers.length > 0 ? farmers.map(f => (
                <tr key={f.id} className="af-row">
                  <td className="af-cell-strong">{f.name}</td>
                  <td>{f.farm_name || 'N/A'}</td>
                  <td>{f.location || 'N/A'}</td>
                  <td>{f.livestock_count ?? f.livestockCount ?? 0}</td>
                  <td>{f.totalCases ?? 0}</td>
                  <td>
                    <span className={`af-badge ${Number(f.openCases || 0) > 0 ? 'af-badge-alert' : ''}`}>
                      {f.openCases ?? 0}
                    </span>
                  </td>
                  <td className="text-center">
                    <button 
                      className="af-btn"
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
  );
}
