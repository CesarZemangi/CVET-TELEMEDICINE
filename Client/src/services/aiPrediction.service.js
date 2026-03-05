import api from "./api";

export const predictDiagnosis = async (input) => {
  const payload = typeof input === "string" ? { symptoms: input } : input;
  try {
    const response = await api.post("/predict", payload);
    return response.data?.data || response.data || null;
  } catch (primaryError) {
    const fallback = await api.post("/ml/predict", payload);
    return fallback.data?.data || fallback.data || null;
  }
};
