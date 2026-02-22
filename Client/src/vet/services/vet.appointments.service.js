import api from "../../services/api"

const API_URL = "/vet/appointments"

export const getAppointments = async () => {
  const response = await api.get(`${API_URL}`)
  return response.data
}

export const getCasesForAppointments = async () => {
  const response = await api.get(`${API_URL}/cases`)
  return response.data?.data || response.data || []
}
