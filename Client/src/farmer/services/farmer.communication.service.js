import api from "../../services/api"

const API_URL = "/farmer/messages"

export const getMessages = async () => {
  const response = await api.get(`${API_URL}`)
  return response.data
}

export const sendMessage = async (data) => {
  const response = await api.post(`${API_URL}`, data)
  return response.data
}
