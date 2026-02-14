import api from "../../services/api"

const API_URL = "/vet/analytics"

export const getCaseStatistics = async () => {
  const response = await api.get(`${API_URL}/case-statistics`)
  return response.data
}
