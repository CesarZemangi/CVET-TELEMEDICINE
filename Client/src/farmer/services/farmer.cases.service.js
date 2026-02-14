import api from "../../services/api"

const API_URL = "/farmer/cases"

export const getCases = async () => {
  const response = await api.get(API_URL)
  return response.data
}

export const getCaseById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`)
  return response.data
}

export const addCase = async (caseData) => {
  const response = await api.post(API_URL, caseData)
  return response.data
}

export const updateCase = async (id, caseData) => {
  const response = await api.put(`${API_URL}/${id}`, caseData)
  return response.data
}

export const deleteCase = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`)
  return response.data
}
