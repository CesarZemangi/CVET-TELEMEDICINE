import api from "../../services/api"

const API_URL = "/farmer/analytics"

export const getHealthTrends = async () => {
  const response = await api.get(`${API_URL}/health-trends`)
  return response.data
}

export const getTreatmentStats = async () => {
  const response = await api.get(`${API_URL}/treatment-stats`)
  return response.data
}
