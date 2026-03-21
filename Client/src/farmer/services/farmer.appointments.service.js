import api from "../../services/api"

const API_URL = "/farmer/appointments"

export const getFarmerAppointments = async (opts = {}) => {
  const params = {}
  if (opts.includeDeleted) params.include_deleted = true
  const response = await api.get(API_URL, { params })
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
  const response = await api.get("/vets")
  return response.data?.data || response.data || []
}

export const joinAppointmentSession = async (id) => {
  const response = await api.get(`${API_URL}/${id}/join-session`)
  return response.data
}
