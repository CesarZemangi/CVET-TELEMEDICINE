import api from "../../services/api"

const API_URL = "/farmer/treatment"

export const getPrescriptions = async () => {
  const response = await api.get(`${API_URL}/prescriptions`)
  return response.data
}

export const getTreatmentPlans = async () => {
  const response = await api.get(`${API_URL}/treatment-plans`)
  return response.data
}
