import api from "./api"

export async function loginUser(credentials) {
  const response = await api.post("/auth/login", credentials)

  const { token, user } = response.data

  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))

  return user
}

export async function registerUser(data) {
  const response = await api.post("/auth/register", data)
  return response.data
}

export function logoutUser() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}
