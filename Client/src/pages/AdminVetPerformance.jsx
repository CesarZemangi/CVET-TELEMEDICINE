import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function AdminVetPerformance() {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await api.get("/admin/analytics/vet-performance");
        setPerformance(res.data);
      } catch (err) {
        console.error("Error fetching vet performance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h4 className="fw-bold">Veterinary Performance Metrics</h4>
        <p className="text-muted small">Tracking responsiveness and workload efficiency across the veterinary team.</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-primary text-white p-3 text-center">
            <h3 className="fw-bold mb-0">{performance?.systemAverageResponseTime}m</h3>
            <p className="small mb-0 text-uppercase opacity-75">System Avg Response Time</p>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h6 className="mb-0 fw-bold">Vet Ranking by Completion Rate</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Veterinarian</th>
                  <th>Specialization</th>
                  <th className="text-center">Assigned</th>
                  <th className="text-center">Completed</th>
                  <th className="text-center">Avg Response</th>
                  <th className="text-center">Videos</th>
                  <th>Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {performance?.metrics.map(v => (
                  <tr key={v.vet_id}>
                    <td className="ps-4 fw-bold">{v.name}</td>
                    <td><small className="badge bg-light text-dark">{v.specialization || 'General'}</small></td>
                    <td className="text-center">{v.totalAssigned}</td>
                    <td className="text-center text-success fw-bold">{v.completedCases}</td>
                    <td className="text-center">
                      <span className={`badge ${v.avgResponseTime < 60 ? 'bg-success' : v.avgResponseTime < 240 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                        {v.avgResponseTime} min
                      </span>
                    </td>
                    <td className="text-center">{v.videoSessionCount}</td>
                    <td style={{width: '150px'}}>
                      <div className="d-flex align-items-center">
                        <div className="progress flex-grow-1" style={{height: '6px'}}>
                          <div 
                            className={`progress-bar ${v.consultationCompletionRate > 80 ? 'bg-success' : 'bg-primary'}`} 
                            style={{width: `${v.consultationCompletionRate}%`}}
                          ></div>
                        </div>
                        <span className="ms-2 small fw-bold">{v.consultationCompletionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
