import axios from "axios"

const API_URL = "/api/farmer/consultations"

export const getConsultations = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export const getConsultationById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

export const addConsultation = async (consultation) => {
  const response = await axios.post(API_URL, consultation)
  return response.data
}

export const updateConsultation = async (id, consultation) => {
  const response = await axios.put(`${API_URL}/${id}`, consultation)
  return response.data
}

export const deleteConsultation = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}
