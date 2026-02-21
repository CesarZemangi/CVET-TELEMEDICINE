import api from "../../services/api"

const API_URL = "/vet/media"

export const uploadMedia = async (formData) => {
  const response = await api.post(`${API_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data?.data || response.data
}

export const getMediaByCaseId = async (caseId) => {
  const response = await api.get(`${API_URL}/case/${caseId}`)
  return response.data?.data || response.data
}

export const getAllVetMedia = async () => {
  const response = await api.get(`${API_URL}`)
  return response.data?.data || response.data
}

export const deleteMedia = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`)
  return response.data
}
