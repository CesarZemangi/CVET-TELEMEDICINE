import api from "./api"

export const getAnimals = () =>
  api.get("/api/v1/farmer/animals")

export const createAnimal = data =>
  api.post("/api/v1/farmer/animals", data)
