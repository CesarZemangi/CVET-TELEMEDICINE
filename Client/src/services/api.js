import axios from "axios"

const api = axios.create({
baseURL: "http://localhost:5000/api/v1"
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

// Backward compatibility for flows that stored token separately
if (!token) {
  token = localStorage.getItem("token");
}

if (token) {
config.headers.Authorization = `Bearer ${token}`;
}

return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
)

export default api
