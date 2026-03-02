import api from "../../services/api"

const API_URL = "/farmer/messages"

export const getMessages = async (partnerId) => {
  const response = await api.get(`${API_URL}`, {
    params: { partner_id: partnerId }
  })
  return response.data
}

export const sendMessage = async (data) => {
  const payload = {
    receiver_id: data.receiver_id ?? data.vet_id,
    case_id: data.case_id ?? null,
    message: data.message
  }
  const response = await api.post(`${API_URL}`, payload)
  return response.data
}
