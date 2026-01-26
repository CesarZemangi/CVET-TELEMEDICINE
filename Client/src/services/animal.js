import api from "./api"

export async function getAnimals() {
  const response = await api.get("/farmer/animals")
  return response.data
}

export async function addAnimal(animalData) {
  const response = await api.post("/farmer/animals", animalData)
  return response.data
}

export async function removeAnimal(id) {
  const response = await api.delete(`/farmer/animals/${id}`)
  return response.data
}
