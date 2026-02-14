import api from "../../services/api"

const API_URL = "/farmer/nutrition"

export const getFeedInventory = async () => {
  const response = await api.get(`${API_URL}/feed-inventory`)
  return response.data
}

export const addFeedInventory = async (data) => {
  const response = await api.post(`${API_URL}/feed-inventory`, data)
  return response.data
}
