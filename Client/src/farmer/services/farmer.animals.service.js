import axios from "axios"

const API_URL = "/api/farmer/animals"

export const getAnimals = async () => {
  const response = await axios.get(`${API_URL}`)
  return response.data
}

export const getAnimalById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

export const addAnimal = async (animal) => {
  const response = await axios.post(`${API_URL}`, animal)
  return response.data
}

export const updateAnimal = async (id, animal) => {
  const response = await axios.put(`${API_URL}/${id}`, animal)
  return response.data
}

export const deleteAnimal = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}
