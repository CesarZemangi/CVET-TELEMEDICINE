import api from "../../services/api"

const API_URL = "/vet/treatment"

export const getCasesForTreatment = async () => {
  const response = await api.get(`${API_URL}/cases`)
  return response.data?.data || response.data || []
}

export const getPrescriptions = async () => {
  const response = await api.get(`${API_URL}/prescriptions`)
  return response.data?.data || response.data
}

export const getTreatmentPlans = async () => {
  const response = await api.get(`${API_URL}/plans`)
  return response.data?.data || response.data
}

export const createPrescription = async (data) => {
  const response = await api.post(`${API_URL}/prescriptions`, data)
  return response.data
}

export const createTreatmentPlan = async (data) => {
  const response = await api.post(`${API_URL}/plans`, data)
  return response.data
}

export const getMedicationHistory = async () => {
  const response = await api.get(`${API_URL}/medication-history`)
  return response.data?.data || response.data
}

export const createMedicationHistory = async (data) => {
  const response = await api.post(`${API_URL}/medication-history`, data)
  return response.data
}
