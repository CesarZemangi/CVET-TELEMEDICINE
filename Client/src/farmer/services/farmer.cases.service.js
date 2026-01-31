import axios from "axios"

const API_URL = "/api/farmer/cases"

export const getCases = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export const getCaseById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

export const addCase = async (caseData) => {
  const response = await axios.post(API_URL, caseData)
  return response.data
}

export const updateCase = async (id, caseData) => {
  const response = await axios.put(`${API_URL}/${id}`, caseData)
  return response.data
}

export const deleteCase = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}
