import api from "../../services/api"

const API_URL = "/farmer/appointments"

export const getFarmerAppointments = async () => {
  const response = await api.get(API_URL)
  return response.data?.data || response.data || []
}

export const createAppointmentRequest = async (data) => {
  const response = await api.post(API_URL, data)
  return response.data
}

export const cancelAppointment = async (id) => {
  const response = await api.put(`${API_URL}/${id}/cancel`)
  return response.data
}

export const getCasesForAppointments = async () => {
  const response = await api.get(`${API_URL}/cases`)
  return response.data?.data || response.data || []
}

export const getVetsForAppointments = async () => {
  const response = await api.get(`${API_URL}/vets`)
  return response.data?.data || response.data || []
}
