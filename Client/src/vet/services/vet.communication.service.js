import api from "../../services/api"

const API_URL = "/vet/messages"

export const getMessages = async (partnerId) => {
  const response = await api.get(`${API_URL}`, {
    params: { partner_id: partnerId }
  })
  return response.data
}
