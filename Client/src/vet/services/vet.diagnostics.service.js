import api from "../../services/api"

const API_URL = "/vet/diagnostics"

export const createLabRequest = async (data) => {
  const response = await api.post(`${API_URL}/lab-requests`, data)
  return response.data
}

export const uploadLabResult = async (data) => {
  const response = await api.post(`${API_URL}/lab-results`, data)
  return response.data
}
