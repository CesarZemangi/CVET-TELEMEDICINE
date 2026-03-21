import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFarmerAppointments } from "./services/farmer.appointments.service";
import { downloadPaymentReceipt, getMyPayments, getPaymentStatus, submitPayment } from "../services/payment";

const PAYMENT_OPTIONS = [
  { key: "ecocash", label: "EcoCash", method: "mobile_money" },
  { key: "onemoney", label: "OneMoney", method: "mobile_money" },
  { key: "mukuru", label: "Mukuru", method: "wallet" },
  { key: "zipit", label: "ZIPIT", method: "bank_transfer" },
  { key: "bank_transfer", label: "Bank Transfer", method: "bank_transfer" }
];

const BANK_DETAILS = {
  bank: "CBZ Bank",
  branch: "Harare Main Branch",
  accountName: "CVET Telemedicine",
  accountNumber: "100200300400",
  swift: "COBZZWHAXXX"
};

const DEFAULT_FEE = 25;

function deriveFee(appointment, payment) {
  const candidates = [
    payment?.amount,
    appointment?.Payment?.amount,
    appointment?.consultation_fee,
    appointment?.fee,
    appointment?.vet?.consultation_fee
  ];

  const numeric = candidates.map((value) => Number(value)).find((value) => Number.isFinite(value) && value > 0);
  return numeric || DEFAULT_FEE;
}

export default function FarmerPayments() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [payment, setPayment] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState(PAYMENT_OPTIONS[0]);
  const [formState, setFormState] = useState({
    phone_number: "",
    payment_reference_number: "",
    proof_file: null
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        if (appointmentId) {
          const appointments = await getFarmerAppointments();
          const match = appointments.find((item) => String(item.id) === String(appointmentId));
          setAppointment(match || null);

          try {
            const paymentData = await getPaymentStatus(appointmentId);
            setPayment(paymentData);
          } catch {
            setPayment(null);
          }
        } else {
          const paymentList = await getMyPayments();
          setPayments(Array.isArray(paymentList) ? paymentList : []);
          setAppointment(null);
          setPayment(null);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [appointmentId]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!appointment) {
      return;
    }

    if (selectedOption.method === "mobile_money" && !formState.phone_number.trim()) {
      alert("Phone number is required for mobile money payments.");
      return;
    }

    if (selectedOption.method === "bank_transfer" && !formState.proof_file) {
      alert("Upload proof of payment for bank or ZIPIT transfers.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        appointment_id: appointment.id,
        amount: deriveFee(appointment, payment),
        payment_method: selectedOption.key,
        payment_provider: selectedOption.label,
        phone_number: formState.phone_number,
        payment_reference_number: formState.payment_reference_number,
        proof_file: formState.proof_file
      };

      const result = await submitPayment(payload);
      setPayment(result.payment || result);
      alert(result.payment_instructions || "Payment submitted and is waiting for verification.");
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container-fluid px-4 py-4 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!appointmentId) {
    return (
      <div className="container-fluid px-4 py-4">
        <div className="mb-4">
          <h4 className="fw-semibold mb-1">Payments</h4>
          <small className="text-muted">Review your submitted consultation payments.</small>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Appointment</th>
                    <th>Vet</th>
                    <th>Amount</th>
                    <th>Provider</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-4 text-muted">No payments submitted yet.</td></tr>
                  ) : (
                    payments.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-4">#{item.appointment_id}</td>
                        <td>{item.vet?.User?.name || "Vet"}</td>
                        <td>USD {Number(item.amount || 0).toFixed(2)}</td>
                        <td>{item.payment_provider || item.payment_method}</td>
                        <td>{item.payment_status}</td>
                        <td className="text-end pe-4">
                          <div className="d-flex gap-2 justify-content-end">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/farmerdashboard/payments/${item.appointment_id}`)}>
                              View
                            </button>
                            <button className="btn btn-sm btn-outline-success" onClick={() => downloadPaymentReceipt(item.id)}>
                              Receipt
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container-fluid px-4 py-4">
        <div className="alert alert-warning">Appointment not found.</div>
      </div>
    );
  }

  const fee = deriveFee(appointment, payment);
  const vetName = appointment?.vet?.User?.name || "Assigned vet";
  const paymentStatus = payment?.payment_status || appointment?.Payment?.payment_status || "not_submitted";

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-1">Consultation Payment</h4>
          <small className="text-muted">Complete payment before the consultation can start.</small>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/farmerdashboard/appointments")}>
          Back to Appointments
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-uppercase text-muted small mb-3">Appointment</h6>
              <p className="mb-2"><strong>Vet:</strong> Dr. {vetName}</p>
              <p className="mb-2"><strong>Case:</strong> {appointment?.Case?.title || `Case #${appointment.case_id}`}</p>
              <p className="mb-2"><strong>Animal:</strong> {appointment?.Case?.Animal?.tag_number || "N/A"}</p>
              <p className="mb-2"><strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleDateString()}</p>
              <p className="mb-0"><strong>Consultation Fee:</strong> USD {fee.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Payment Method</h5>
                <span className={`badge ${paymentStatus === "paid" ? "bg-success" : paymentStatus === "pending" ? "bg-warning text-dark" : paymentStatus === "rejected" ? "bg-danger" : "bg-secondary"}`}>
                  {paymentStatus.replaceAll("_", " ")}
                </span>
              </div>

              {paymentStatus === "paid" ? (
                <div>
                  <div className="alert alert-success">
                    Payment verified. This appointment is ready for consultation.
                  </div>
                  <button className="btn btn-outline-success" onClick={() => downloadPaymentReceipt(payment?.id || appointment?.Payment?.id)}>
                    <i className="bi bi-download me-2"></i>
                    Download Receipt
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    {PAYMENT_OPTIONS.map((option) => (
                      <div className="col-md-6" key={option.key}>
                        <button
                          type="button"
                          className={`btn w-100 text-start border ${selectedOption.key === option.key ? "btn-primary" : "btn-light"}`}
                          onClick={() => setSelectedOption(option)}
                        >
                          <div className="fw-semibold">{option.label}</div>
                          <small className={selectedOption.key === option.key ? "text-white-50" : "text-muted"}>
                            {option.method.replaceAll("_", " ")}
                          </small>
                        </button>
                      </div>
                    ))}
                  </div>

                  {selectedOption.method === "mobile_money" && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="e.g. +263771234567"
                        value={formState.phone_number}
                        onChange={(event) => setFormState((current) => ({ ...current, phone_number: event.target.value }))}
                      />
                    </div>
                  )}

                  {selectedOption.method === "bank_transfer" && (
                    <div className="border rounded-3 p-3 bg-light mb-3">
                      <div className="fw-semibold mb-2">Bank Details</div>
                      <div className="small text-muted">Bank: {BANK_DETAILS.bank}</div>
                      <div className="small text-muted">Branch: {BANK_DETAILS.branch}</div>
                      <div className="small text-muted">Account Name: {BANK_DETAILS.accountName}</div>
                      <div className="small text-muted">Account Number: {BANK_DETAILS.accountNumber}</div>
                      <div className="small text-muted">SWIFT: {BANK_DETAILS.swift}</div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Provider Reference Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Transaction or receipt number"
                      value={formState.payment_reference_number}
                      onChange={(event) => setFormState((current) => ({ ...current, payment_reference_number: event.target.value }))}
                    />
                  </div>

                  {selectedOption.method === "bank_transfer" && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Proof of Payment</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*,.pdf"
                        onChange={(event) => setFormState((current) => ({ ...current, proof_file: event.target.files?.[0] || null }))}
                      />
                    </div>
                  )}

                  {paymentStatus === "pending" && (
                    <div className="alert alert-warning">
                      Payment already submitted. An admin still needs to verify it before consultation access is unlocked.
                    </div>
                  )}

                  {paymentStatus === "rejected" && (
                    <div className="alert alert-danger">
                      This payment was rejected. Update the details and submit again.
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Processing Payment..." : "Pay Now"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
