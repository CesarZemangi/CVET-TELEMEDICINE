import React, { useEffect, useState } from "react";
import { getVetPayments } from "../services/payment";

export default function VetPayments() {
  const [data, setData] = useState({ payments: [], summary: { total_earnings: 0, paid_consultations: 0, pending_consultations: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        const response = await getVetPayments();
        setData(response || { payments: [], summary: { total_earnings: 0, paid_consultations: 0, pending_consultations: 0 } });
      } catch (err) {
        console.error("Failed to load vet payments:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  const payments = Array.isArray(data.payments) ? data.payments : [];
  const summary = data.summary || {};

  return (
    <div className="container-fluid px-4 py-4">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Payments</h4>
        <small className="text-muted">Track confirmed consultations, pending payments, and earnings.</small>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-muted small text-uppercase">Total Earnings</div>
              <div className="fs-4 fw-bold">USD {Number(summary.total_earnings || 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-muted small text-uppercase">Paid Consultations</div>
              <div className="fs-4 fw-bold">{summary.paid_consultations || 0}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-muted small text-uppercase">Waiting For Payment</div>
              <div className="fs-4 fw-bold">{summary.pending_consultations || 0}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Farmer</th>
                  <th>Case</th>
                  <th>Amount</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Verified</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4"><div className="spinner-border text-primary"></div></td></tr>
                ) : payments.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No payment records found.</td></tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="ps-4">{payment.farmer?.name || "Farmer"}</td>
                      <td>{payment.appointment?.Case?.title || `Appointment #${payment.appointment_id}`}</td>
                      <td>USD {Number(payment.amount || 0).toFixed(2)}</td>
                      <td>{payment.payment_provider || payment.payment_method}</td>
                      <td>
                        <span className={`badge ${payment.payment_status === "paid" ? "bg-success" : payment.payment_status === "pending" ? "bg-warning text-dark" : "bg-danger"}`}>
                          {payment.payment_status}
                        </span>
                      </td>
                      <td>{payment.verified_at ? new Date(payment.verified_at).toLocaleString() : "-"}</td>
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
