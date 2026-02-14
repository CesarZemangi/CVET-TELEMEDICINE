import api from "../../services/api"

const API_URL = "/vet/messages"

export const getMessages = async () => {
  const response = await api.get(`${API_URL}`)
  return response.data
}
