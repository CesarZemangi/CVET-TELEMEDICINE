import api from "../../services/api"

const API_URL = "/farmer/diagnostics"

export const getLabRequests = async () => {
  const response = await api.get(`${API_URL}/lab-requests`)
  return response.data
}

export const createLabRequest = async (data) => {
  const response = await api.post(`${API_URL}/lab-requests`, data)
  return response.data
}

export const getLabResults = async () => {
  const response = await api.get(`${API_URL}/lab-results`)
  return response.data
}
