import api from "./api"

export const login = data =>
  api.post("/api/v1/auth/login", data)

export const register = data =>
  api.post("/api/v1/auth/register", data)

export const logout = () =>
  api.post("/api/v1/auth/logout")
