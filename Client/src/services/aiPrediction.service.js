import api from "./api";

export const predictDiagnosis = async (input) => {
  const payload = typeof input === "string" ? { symptoms: input } : input;
  let role = null;
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    role = user?.role || null;
  } catch {
    role = null;
  }

  // Farmer-first path avoids cross-role conflicts on shared endpoints.
  if (role === "farmer") {
    try {
      const farmerResponse = await api.post("/farmer/diagnostics/predict", payload);
      return farmerResponse.data?.data || farmerResponse.data || null;
    } catch {
      // fall through to shared endpoints
    }
  }

  try {
    const response = await api.post("/predict", payload);
    return response.data?.data || response.data || null;
  } catch (primaryError) {
    const fallback = await api.post("/ml/predict", payload);
    return fallback.data?.data || fallback.data || null;
  }
};
