import axios from "axios"

const api = axios.create({
baseURL: "http://localhost:5000/api"
})

api.interceptors.request.use(config => {
const userData = localStorage.getItem("user");
let token = null;

if (userData) {
  try {
    const user = JSON.parse(userData);
    token = user.token;
  } catch (e) {
    console.error("Error parsing user data from localStorage", e);
  }
}

if (token) {
config.headers.Authorization = `Bearer ${token}`;
}

return config
})

export default api