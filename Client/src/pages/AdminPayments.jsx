import React, { useEffect, useMemo, useState } from "react";
import { downloadPaymentReceipt, getAdminPayments, rejectPayment, verifyPayment } from "../services/payment";
import "../styles/adminFarmers.css";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const summary = useMemo(() => {
    return payments.reduce((acc, payment) => {
      acc.total += 1;
      if (payment.payment_status === "paid") acc.paid += 1;
      if (payment.payment_status === "pending") acc.pending += 1;
      if (payment.payment_status === "rejected") acc.rejected += 1;
      return acc;
    }, { total: 0, paid: 0, pending: 0, rejected: 0 });
  }, [payments]);

  async function fetchPayments() {
    try {
      setLoading(true);
      const data = await getAdminPayments(statusFilter);
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  async function handleVerify(paymentId) {
    try {
      setActionLoading(true);
      await verifyPayment(paymentId);
      setSelectedPayment(null);
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject(paymentId) {
    if (!rejectionReason.trim()) {
      alert("Rejection reason is required.");
      return;
    }

    try {
      setActionLoading(true);
      await rejectPayment(paymentId, { reason: rejectionReason });
      setSelectedPayment(null);
      setRejectionReason("");
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="container-fluid px-4 py-4 af-page">
      <div className="af-hero">
        <div>
          <p className="af-kicker">Finance • Live</p>
          <h1 className="af-title">Payment Control Room</h1>
          <p className="af-subtitle">Verify receipts, trace providers, and clear pending payouts.</p>
          <div className="af-pills">
            <span className="af-pill">Total • {summary.total}</span>
            <span className="af-pill af-pill-emerald">Paid • {summary.paid}</span>
            <span className="af-pill af-pill-amber">Pending • {summary.pending}</span>
            <span className="af-pill" style={{ background: "rgba(248,113,113,0.16)", color: "#fecdd3" }}>Rejected • {summary.rejected}</span>
          </div>
        </div>
        <div className="af-filter">
          <label className="af-label">Status</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="af-card">
        <div className="af-card-header">
          <h3>Transactions</h3>
          <span className="af-meta">Animated updates on fetch</span>
        </div>
        <div className="af-table-wrapper">
          <table className="af-table">
            <thead>
              <tr>
                <th>Farmer</th>
                <th>Vet</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Provider</th>
                <th>Reference</th>
                <th>Submitted</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center py-4"><div className="spinner-border text-primary"></div></td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-4 text-muted">No payments found.</td></tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="af-row">
                    <td className="af-cell-strong">{payment.farmer?.name || "Farmer"}</td>
                    <td>{payment.vet?.User?.name || "Vet"}</td>
                    <td>USD {Number(payment.amount || 0).toFixed(2)}</td>
                    <td>{payment.payment_method}</td>
                    <td>{payment.payment_provider || "-"}</td>
                    <td>{payment.payment_reference_number || payment.transaction_reference}</td>
                    <td>{payment.created_at ? new Date(payment.created_at).toLocaleString() : "-"}</td>
                    <td>
                      <span className={`af-badge ${payment.payment_status === "paid" ? "" : payment.payment_status === "pending" ? "af-badge-amber" : "af-badge-alert"}`}>
                        {payment.payment_status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <button className="af-btn-ghost" onClick={() => setSelectedPayment(payment)}>
                          Review
                        </button>
                        <button className="af-btn-soft" onClick={() => downloadPaymentReceipt(payment.id)}>
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

      {selectedPayment && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Review Payment</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedPayment(null)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-2"><strong>Farmer:</strong> {selectedPayment.farmer?.name}</p>
                <p className="mb-2"><strong>Vet:</strong> {selectedPayment.vet?.User?.name}</p>
                <p className="mb-2"><strong>Amount:</strong> USD {Number(selectedPayment.amount || 0).toFixed(2)}</p>
                <p className="mb-2"><strong>Provider:</strong> {selectedPayment.payment_provider || selectedPayment.payment_method}</p>
                <p className="mb-2"><strong>Reference:</strong> {selectedPayment.payment_reference_number || selectedPayment.transaction_reference}</p>
                <p className="mb-2"><strong>Submitted:</strong> {selectedPayment.created_at ? new Date(selectedPayment.created_at).toLocaleString() : "-"}</p>
                {selectedPayment.proof_of_payment_url && (
                  <p className="mb-3">
                    <strong>Proof:</strong>{" "}
                    <a href={selectedPayment.proof_of_payment_url} target="_blank" rel="noreferrer">
                      Open upload
                    </a>
                  </p>
                )}
                <div>
                  <label className="form-label fw-semibold">Reject reason</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    placeholder="Only needed when rejecting this payment."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedPayment(null)} disabled={actionLoading}>
                  Close
                </button>
                <button className="btn btn-outline-success" onClick={() => downloadPaymentReceipt(selectedPayment.id)} disabled={actionLoading}>
                  Receipt
                </button>
                <button className="btn btn-danger" onClick={() => handleReject(selectedPayment.id)} disabled={actionLoading}>
                  {actionLoading ? "Saving..." : "Reject"}
                </button>
                <button className="btn btn-success" onClick={() => handleVerify(selectedPayment.id)} disabled={actionLoading}>
                  {actionLoading ? "Saving..." : "Verify"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
