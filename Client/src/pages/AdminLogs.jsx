import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/logs');
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="container-fluid">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold">System Audit Logs</h4>
          <p className="text-muted small">Real-time tracking of critical system actions and admin interventions.</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-download me-2"></i>Export Logs</button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{fontSize: '0.85rem'}}>
              <thead className="bg-light text-uppercase fw-bold" style={{fontSize: '0.75rem'}}>
                <tr>
                  <th className="ps-4">Timestamp</th>
                  <th>Action Description</th>
                  <th>Admin ID</th>
                  <th className="text-end pe-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-4">Loading system logs...</td></tr>
                ) : logs.length > 0 ? logs.map(log => (
                  <tr key={log.id}>
                    <td className="ps-4 text-muted">{new Date(log.created_at).toLocaleString()}</td>
                    <td>{log.action}</td>
                    <td><span className="badge bg-light text-dark border">UID:{log.user_id}</span></td>
                    <td className="text-end pe-4">
                      <span className="badge bg-success bg-opacity-10 text-success">SUCCESS</span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center py-4 text-muted">No activity logs found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
