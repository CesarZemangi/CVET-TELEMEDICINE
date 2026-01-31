import api from "./api"

export const getAnimals = () =>
  api.get("/api/farmer/animals")

export const createAnimal = data =>
  api.post("/api/farmer/animals", data)
