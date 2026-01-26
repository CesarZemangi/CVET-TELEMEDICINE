import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import FarmerDashboard from "./pages/FarmerDashboard"

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user")
  const token = localStorage.getItem("token")

  if (!user || !token) {
    return <Login />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/farmer"
        element={
          <ProtectedRoute>
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
