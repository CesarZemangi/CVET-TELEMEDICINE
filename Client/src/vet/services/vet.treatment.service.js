import api from "../../services/api"

const API_URL = "/vet/treatment"

export const createPrescription = async (data) => {
  const response = await api.post(`${API_URL}/prescriptions`, data)
  return response.data
}

export const createTreatmentPlan = async (data) => {
  const response = await api.post(`${API_URL}/treatment-plans`, data)
  return response.data
}
