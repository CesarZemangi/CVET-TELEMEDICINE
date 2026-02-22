import api from "../../services/api"

const API_URL = "/vet/cases"

export const getCases = async () => {
  const response = await api.get(`${API_URL}`)
  return response.data?.data || response.data
}

export const getCasesForDropdown = async () => {
  const response = await api.get(`${API_URL}/dropdown`)
  return response.data
}

export const getUnassignedCases = async () => {
  const response = await api.get(`${API_URL}/unassigned`)
  return response.data?.data || response.data
}

export const updatePriority = async (id, priority) => {
  const response = await api.put(`${API_URL}/${id}/priority`, { priority })
  return response.data
}

export const getCaseById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`)
  return response.data
}

export const assignCase = async (id) => {
  const response = await api.put(`${API_URL}/${id}/assign`)
  return response.data
}

export const closeCase = async (id) => {
  const response = await api.put(`${API_URL}/${id}/close`)
  return response.data
}
