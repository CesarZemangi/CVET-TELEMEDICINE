import { Navigate } from "react-router-dom"

export function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user")
  const token = localStorage.getItem("token")

  if (!user || !token) {
    return <div style={{ padding: 40 }}>NOT LOGGED IN</div>
  }

  return children
}

