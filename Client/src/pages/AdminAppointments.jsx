import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

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

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "badge bg-warning text-dark";
      case "approved":
        return "badge bg-success";
      case "rejected":
        return "badge bg-danger";
      case "completed":
        return "badge bg-info";
      case "cancelled":
        return "badge bg-secondary";
      default:
        return "badge bg-secondary";
    }
  };

  const filteredAppointments = 
    filter === "All" 
      ? appointments 
      : appointments.filter(a => a.status === filter.toLowerCase());

  return (
    <div className="container-fluid px-4 py-4">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Appointments Management</h4>
        <small className="text-muted">Monitor and manage all veterinary appointments</small>
      </div>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Pending", "Approved", "Rejected", "Completed", "Cancelled"].map(status => (
          <button
            key={status}
            className={`btn btn-sm ${
              filter === status 
                ? "btn-primary" 
                : "btn-outline-primary"
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
                        <td className="ps-4 fw-bold">#{appt.id}</td>
                        <td>{appt.farmer?.name || "N/A"}</td>
                        <td>{appt.vet?.User?.name || "N/A"}</td>
                        <td>{appt.Case?.title}</td>
                        <td>
                          {appt.Case?.Animal?.tag_number} ({appt.Case?.Animal?.species})
                        </td>
                        <td>
                          {new Date(appt.appointment_date).toLocaleDateString()} at{" "}
                          {appt.appointment_time}
                        </td>
                        <td>
                          <span className={getStatusClass(appt.status)}>{appt.status}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No appointments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
