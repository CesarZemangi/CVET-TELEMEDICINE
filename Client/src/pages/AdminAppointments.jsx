import React, { useState, useEffect } from "react";
import api from "../services/api";
import Badge from "../components/ui/Badge";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/appointments");
      setAppointments(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(a => {
    const matchesStatus = filter === "All" || a.status === filter.toLowerCase();
    const matchesSearch = 
      a.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.vet?.User?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.Case?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id?.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const appointmentStats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    completed: appointments.filter(a => a.status === 'completed').length
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Appointments Management</h4>
        <small className="text-muted">Monitor and manage all veterinary appointments</small>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-start-0"
              placeholder="Search by farmer, vet, or case..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="row g-2">
            <div className="col-auto">
              <div className="card border-0 shadow-sm text-center" style={{ padding: '10px 15px', minWidth: '110px' }}>
                <small className="text-muted d-block">Total</small>
                <h5 className="fw-bold mb-0">{appointmentStats.total}</h5>
              </div>
            </div>
            <div className="col-auto">
              <div className="card border-0 shadow-sm text-center" style={{ padding: '10px 15px', minWidth: '110px' }}>
                <small className="text-muted d-block">Pending</small>
                <h5 className="fw-bold mb-0 text-warning">{appointmentStats.pending}</h5>
              </div>
            </div>
            <div className="col-auto">
              <div className="card border-0 shadow-sm text-center" style={{ padding: '10px 15px', minWidth: '110px' }}>
                <small className="text-muted d-block">Approved</small>
                <h5 className="fw-bold mb-0 text-success">{appointmentStats.approved}</h5>
              </div>
            </div>
            <div className="col-auto">
              <div className="card border-0 shadow-sm text-center" style={{ padding: '10px 15px', minWidth: '110px' }}>
                <small className="text-muted d-block">Completed</small>
                <h5 className="fw-bold mb-0 text-info">{appointmentStats.completed}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Pending", "Approved", "Rejected", "Completed", "Cancelled"].map(status => (
          <button
            key={status}
            className={`btn btn-sm ${
              filter === status 
                ? "btn-primary" 
                : "btn-outline-secondary"
            }`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">ID</th>
                    <th>Farmer</th>
                    <th>Vet</th>
                    <th>Case</th>
                    <th>Animal</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(appt => (
                      <tr key={appt.id}>
                        <td className="ps-4 fw-bold text-primary">#{appt.id}</td>
                        <td><strong>{appt.farmer?.name || "N/A"}</strong></td>
                        <td>{appt.vet?.User?.name || "N/A"}</td>
                        <td className="text-truncate" style={{ maxWidth: '150px' }}>{appt.Case?.title}</td>
                        <td className="small">{appt.Case?.Animal?.tag_number} ({appt.Case?.Animal?.species})</td>
                        <td className="small text-muted">
                          {new Date(appt.appointment_date).toLocaleDateString()} {appt.appointment_time}
                        </td>
                        <td>
                          <Badge status={appt.status} type="status" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <i className="bi bi-inbox d-block fs-3 mb-2"></i>
                        {appointments.length === 0 ? 'No appointments found' : 'No matching appointments'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card-footer bg-white border-0 py-3 text-center">
          <span className="small text-muted">Showing {filteredAppointments.length} of {appointments.length} appointments</span>
        </div>
      </div>
    </div>
  );
}
