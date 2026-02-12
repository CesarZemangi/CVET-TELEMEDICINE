import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get("/vet/appointments")
      .then(res => setAppointments(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h4 className="fw-bold">Scheduled Consultations</h4>
        <p className="text-muted">Manage your daily veterinary appointments</p>
      </div>

      <div className="row g-3">
        {appointments.map((appt) => (
          <div key={appt.id} className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle me-4 text-center" style={{ width: "70px" }}>
                    <div className="fw-bold text-info" style={{ fontSize: "1.2rem" }}>14</div>
                    <div className="small text-info text-uppercase" style={{ fontSize: "0.6rem" }}>Feb</div>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">{appt.farmerName || "Farmer Name"}</h6>
                    <p className="text-muted small mb-0">
                      <i className="bi bi-clock me-2"></i> 10:30 AM - {appt.reason || 'General Checkup'}
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="text-end d-none d-md-block me-4">
                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3">Virtual Call</span>
                  </div>
                  <button className="btn btn-primary-custom btn-sm px-4">
                    Join Session
                  </button>
                  <button className="btn btn-light btn-sm rounded-circle">
                    <i className="bi bi-three-dots-vertical"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-calendar-x fs-1 text-muted opacity-25"></i>
            <p className="mt-3 text-muted">No appointments scheduled for today.</p>
          </div>
        )}
      </div>
    </div>
  );
}
