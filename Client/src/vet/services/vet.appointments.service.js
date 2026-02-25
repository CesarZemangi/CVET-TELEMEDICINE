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

export const approveAppointment = async (id) => {
  const response = await api.put(`${API_URL}/${id}/approve`)
  return response.data
}

export const rejectAppointment = async (id, reason) => {
  const response = await api.put(`${API_URL}/${id}/reject`, { reason })
  return response.data
}

export const completeAppointment = async (id, summary) => {
  const response = await api.put(`${API_URL}/${id}/complete`, { summary })
  return response.data
}

export const cancelAppointment = async (id, reason) => {
  const response = await api.put(`${API_URL}/${id}/cancel`, { reason })
  return response.data
}

export const rescheduleAppointment = async (id, appointment_date, appointment_time, reason) => {
  const response = await api.put(`${API_URL}/${id}/reschedule`, {
    appointment_date,
    appointment_time,
    reason
  })
  return response.data
}
