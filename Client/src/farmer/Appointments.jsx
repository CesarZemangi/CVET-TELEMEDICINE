import React, { useState, useEffect } from "react";
import {
  getFarmerAppointments,
  cancelAppointment,
  getCasesForAppointments,
  getVetsForAppointments
} from "./services/farmer.appointments.service";
import api from "../services/api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [vets, setVets] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    case_id: "",
    vet_id: "",
    appointment_date: "",
    appointment_time: "",
    notes: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptData, vetsData, casesData] = await Promise.all([
        getFarmerAppointments(),
        getVetsForAppointments(),
        getCasesForAppointments()
      ]);
      setAppointments(apptData || []);
      setVets(vetsData || []);
      setCases(casesData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      if (!formData.case_id || !formData.vet_id || !formData.appointment_date || !formData.appointment_time) {
        alert("Please fill in all required fields");
        return;
      }
      await api.post("/farmer/appointments", formData);
      setShowAddModal(false);
      setFormData({
        case_id: "",
        vet_id: "",
        appointment_date: "",
        appointment_time: "",
        notes: ""
      });
      fetchData();
      alert("Appointment request created successfully!");
    } catch (err) {
      alert("Failed to create appointment: " + (err.response?.data?.error || err.message));
    }
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(id);
        fetchData();
        alert("Appointment cancelled successfully!");
      } catch (err) {
        alert("Failed to cancel appointment: " + (err.response?.data?.error || err.message));
      }
    }
  };

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

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-1">Appointments</h4>
          <small className="text-muted">Schedule and manage veterinary appointments</small>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Request Appointment
        </button>
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
                    <th className="ps-4">Case</th>
                    <th>Animal</th>
                    <th>Vet</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map(appt => (
                      <tr key={appt.id}>
                        <td className="ps-4 fw-medium">{appt.Case?.title}</td>
                        <td>
                          {appt.Case?.Animal?.tag_number} ({appt.Case?.Animal?.species})
                        </td>
                        <td>{appt.vet?.User?.name || "N/A"}</td>
                        <td>
                          {new Date(appt.appointment_date).toLocaleDateString()} at{" "}
                          {appt.appointment_time}
                        </td>
                        <td>
                          <span className={getStatusClass(appt.status)}>{appt.status}</span>
                        </td>
                        <td className="text-end pe-4">
                          {appt.status === "pending" && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleCancelAppointment(appt.id)}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Cancel
                            </button>
                          )}
                          {appt.status === "approved" && (
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-camera-video me-1"></i>
                              Join
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
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

      {showAddModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <form onSubmit={handleAddAppointment}>
                <div className="modal-header border-0 p-4 pb-0">
                  <h5 className="modal-title fw-bold">Request Appointment</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Case</label>
                    <select
                      className="form-select"
                      required
                      value={formData.case_id}
                      onChange={e => setFormData({ ...formData, case_id: e.target.value })}
                    >
                      <option value="">Choose a case...</option>
                      {cases.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Vet</label>
                    <select
                      className="form-select"
                      required
                      value={formData.vet_id}
                      onChange={e => setFormData({ ...formData, vet_id: e.target.value })}
                    >
                      <option value="">Choose a vet...</option>
                      {vets.map(v => (
                        <option key={v.id} value={v.id}>
                          Dr. {v.User?.name || "Unknown"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={formData.appointment_date}
                        onChange={e =>
                          setFormData({ ...formData, appointment_date: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Time</label>
                      <input
                        type="time"
                        className="form-control"
                        required
                        value={formData.appointment_time}
                        onChange={e =>
                          setFormData({ ...formData, appointment_time: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Notes (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Add any additional notes..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Request Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
