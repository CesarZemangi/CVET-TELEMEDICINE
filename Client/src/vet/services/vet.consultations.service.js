import api from "../../services/api"

const API_URL = "/vet/consultations"

export const getConsultations = async () => {
  const response = await api.get(API_URL)
  return response.data
}

export const createConsultation = async (consultData) => {
  const response = await api.post(API_URL, consultData)
  return response.data
}
