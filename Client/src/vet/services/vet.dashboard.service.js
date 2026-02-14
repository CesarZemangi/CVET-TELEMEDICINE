import api from "../../services/api"

const API_URL = "/vet"

export const getDashboardData = async () => {
  const response = await api.get(`${API_URL}/dashboard`)
  return response.data
}
