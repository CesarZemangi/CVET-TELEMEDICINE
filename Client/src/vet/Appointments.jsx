import React, { useState, useEffect } from "react";
import api from "../services/api";
import * as appointmentService from "./services/vet.appointments.service";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [formData, setFormData] = useState({ reason: "", summary: "", date: "", time: "" });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/vet/appointments");
      setAppointments(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: "bg-warning",
      approved: "bg-success",
      completed: "bg-info",
      rejected: "bg-danger",
      cancelled: "bg-secondary"
    };
    return colors[status] || "bg-secondary";
  };

  const openModal = (action, appointment) => {
    setSelectedAppt(appointment);
    setModalAction(action);
    setFormData({ reason: "", summary: "", date: "", time: "" });
  };

  const closeModal = () => {
    setModalAction(null);
    setSelectedAppt(null);
    setFormData({ reason: "", summary: "", date: "", time: "" });
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await appointmentService.approveAppointment(selectedAppt.id);
      setSuccessMessage("Appointment approved successfully");
      fetchAppointments();
      closeModal();
    } catch (err) {
      alert("Error approving appointment: " + err.response?.data?.error || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!formData.reason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    try {
      setActionLoading(true);
      await appointmentService.rejectAppointment(selectedAppt.id, formData.reason);
      setSuccessMessage("Appointment rejected successfully");
      fetchAppointments();
      closeModal();
    } catch (err) {
      alert("Error rejecting appointment: " + err.response?.data?.error || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setActionLoading(true);
      await appointmentService.completeAppointment(selectedAppt.id, formData.summary);
      setSuccessMessage("Appointment marked as completed");
      fetchAppointments();
      closeModal();
    } catch (err) {
      alert("Error completing appointment: " + err.response?.data?.error || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!formData.reason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }
    try {
      setActionLoading(true);
      await appointmentService.cancelAppointment(selectedAppt.id, formData.reason);
      setSuccessMessage("Appointment cancelled successfully");
      fetchAppointments();
      closeModal();
    } catch (err) {
      alert("Error cancelling appointment: " + err.response?.data?.error || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!formData.date || !formData.time) {
      alert("Please select both date and time");
      return;
    }
    try {
      setActionLoading(true);
      await appointmentService.rescheduleAppointment(
        selectedAppt.id,
        formData.date,
        formData.time,
        formData.reason
      );
      setSuccessMessage("Appointment rescheduled successfully");
      fetchAppointments();
      closeModal();
    } catch (err) {
      alert("Error rescheduling appointment: " + err.response?.data?.error || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const canApprove = (status) => status === "pending";
  const canReject = (status) => status === "pending";
  const canComplete = (status) => status === "approved";
  const canCancel = (status) => status !== "cancelled" && status !== "completed";
  const canReschedule = (status) => status === "pending" || status === "approved";

  return (
    <div className="container-fluid py-2">
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
        </div>
      )}

      <div className="mb-4">
        <h4 className="fw-bold">Scheduled Consultations</h4>
        <p className="text-muted">Manage your daily veterinary appointments</p>
      </div>

      <div className="row g-3">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : appointments.map((appt) => {
          const dateInfo = formatDate(appt.appointment_date);
          return (
            <div key={appt.id} className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-info bg-opacity-10 p-3 rounded-circle me-4 text-center" style={{ width: "70px" }}>
                        <div className="fw-bold text-info" style={{ fontSize: "1.2rem" }}>{dateInfo.day}</div>
                        <div className="small text-info text-uppercase" style={{ fontSize: "0.6rem" }}>{dateInfo.month}</div>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">{appt.farmer?.name || "Farmer"}</h6>
                        <p className="text-muted small mb-0">
                          <i className="bi bi-clock me-2"></i> {dateInfo.time} - {appt.Case?.title || 'General Checkup'}
                        </p>
                        {appt.Case?.Animal && (
                          <p className="text-muted small mb-0">
                            <i className="bi bi-paw me-2"></i> {appt.Case.Animal.tag_number} ({appt.Case.Animal.species})
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadgeColor(appt.status)} text-white px-3 py-2`}>
                      {appt.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {appt.mode && (
                      <span className="badge bg-primary-subtle text-primary rounded-pill px-3">{appt.mode}</span>
                    )}
                    <button className="btn btn-primary btn-sm px-3">
                      <i className="bi bi-video me-2"></i> Join Session
                    </button>
                    {canApprove(appt.status) && (
                      <button 
                        className="btn btn-success btn-sm px-3"
                        onClick={() => openModal('approve', appt)}
                      >
                        <i className="bi bi-check-circle me-2"></i> Approve
                      </button>
                    )}
                    {canReject(appt.status) && (
                      <button 
                        className="btn btn-danger btn-sm px-3"
                        onClick={() => openModal('reject', appt)}
                      >
                        <i className="bi bi-x-circle me-2"></i> Reject
                      </button>
                    )}
                    {canComplete(appt.status) && (
                      <button 
                        className="btn btn-info btn-sm px-3"
                        onClick={() => openModal('complete', appt)}
                      >
                        <i className="bi bi-check2 me-2"></i> Complete
                      </button>
                    )}
                    {canReschedule(appt.status) && (
                      <button 
                        className="btn btn-warning btn-sm px-3"
                        onClick={() => openModal('reschedule', appt)}
                      >
                        <i className="bi bi-calendar me-2"></i> Reschedule
                      </button>
                    )}
                    {canCancel(appt.status) && (
                      <button 
                        className="btn btn-outline-danger btn-sm px-3"
                        onClick={() => openModal('cancel', appt)}
                      >
                        <i className="bi bi-trash me-2"></i> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {!loading && appointments.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-calendar-x fs-1 text-muted opacity-25"></i>
            <p className="mt-3 text-muted">No appointments scheduled.</p>
          </div>
        )}
      </div>

      {modalAction && selectedAppt && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000, overflowY: 'auto' }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalAction === 'approve' && 'Approve Appointment'}
                  {modalAction === 'reject' && 'Reject Appointment'}
                  {modalAction === 'complete' && 'Complete Appointment'}
                  {modalAction === 'cancel' && 'Cancel Appointment'}
                  {modalAction === 'reschedule' && 'Reschedule Appointment'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {modalAction === 'approve' && (
                  <p>Are you sure you want to approve this appointment?</p>
                )}

                {modalAction === 'reject' && (
                  <div>
                    <label className="form-label">Reason for Rejection</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Enter reason for rejection..."
                    />
                  </div>
                )}

                {modalAction === 'complete' && (
                  <div>
                    <label className="form-label">Appointment Summary (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Enter appointment summary, diagnosis, treatment given..."
                    />
                  </div>
                )}

                {modalAction === 'cancel' && (
                  <div>
                    <label className="form-label">Reason for Cancellation</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Enter reason for cancellation..."
                    />
                  </div>
                )}

                {modalAction === 'reschedule' && (
                  <div>
                    <div className="mb-3">
                      <label className="form-label">New Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">New Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Reason (Optional)</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        placeholder="Enter reason for rescheduling..."
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={actionLoading}>
                  Cancel
                </button>
                {modalAction === 'approve' && (
                  <button 
                    type="button" 
                    className="btn btn-success" 
                    onClick={handleApprove}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Approving..." : "Approve"}
                  </button>
                )}
                {modalAction === 'reject' && (
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={handleReject}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Rejecting..." : "Reject"}
                  </button>
                )}
                {modalAction === 'complete' && (
                  <button 
                    type="button" 
                    className="btn btn-info" 
                    onClick={handleComplete}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Completing..." : "Complete"}
                  </button>
                )}
                {modalAction === 'cancel' && (
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={handleCancel}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Cancelling..." : "Cancel"}
                  </button>
                )}
                {modalAction === 'reschedule' && (
                  <button 
                    type="button" 
                    className="btn btn-warning" 
                    onClick={handleReschedule}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Rescheduling..." : "Reschedule"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
