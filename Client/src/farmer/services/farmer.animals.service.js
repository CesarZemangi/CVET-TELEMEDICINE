import api from "../../services/api"

const API_URL = "/farmer/animals"

export const getAnimals = async () => {
  const response = await api.get(`${API_URL}`)
  return response.data
}

export const getAnimalById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`)
  return response.data
}

export const addAnimal = async (animal) => {
  const response = await api.post(`${API_URL}`, animal)
  return response.data
}

export const updateAnimal = async (id, animal) => {
  const response = await api.put(`${API_URL}/${id}`, animal)
  return response.data
}

export const deleteAnimal = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`)
  return response.data
}
