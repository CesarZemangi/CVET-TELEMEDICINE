import api from "./api";

export async function submitPayment(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  const response = await api.post("/payments/initiate", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data?.data || response.data;
}

export async function getPaymentStatus(appointmentId) {
  const response = await api.get(`/payments/status/${appointmentId}`);
  return response.data?.data || response.data;
}

export async function getMyPayments() {
  const response = await api.get("/payments/mine");
  return response.data?.data || response.data || [];
}

export async function getAdminPayments(status = "") {
  const response = await api.get("/payments/admin", {
    params: status ? { status } : {}
  });
  return response.data?.data || response.data || [];
}

export async function verifyPayment(paymentId) {
  const response = await api.post(`/payments/admin/${paymentId}/verify`);
  return response.data?.data || response.data;
}

export async function rejectPayment(paymentId, payload) {
  const response = await api.post(`/payments/admin/${paymentId}/reject`, payload);
  return response.data?.data || response.data;
}

export async function getVetPayments() {
  const response = await api.get("/payments/vet");
  return response.data?.data || response.data;
}

export async function getFarmerVetRecommendations() {
  const response = await api.get("/ml/vet-recommendations");
  return response.data?.data || response.data || [];
}

export async function downloadPaymentReceipt(paymentId) {
  const response = await api.get(`/payments/receipt/${paymentId}`, {
    responseType: "blob"
  });

  const blob = new Blob([response.data], { type: "text/html" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `payment-receipt-${paymentId}.html`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
