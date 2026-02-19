import api from "./api";

export async function getVetConsultations() {
  const response = await api.get("/vet/consultations");
  return response.data;
}

export async function createConsultation(consultationData) {
  const response = await api.post("/vet/consultations", consultationData);
  return response.data;
}

export async function getFarmerConsultations() {
  const response = await api.get("/farmer/consultations");
  return response.data;
}
