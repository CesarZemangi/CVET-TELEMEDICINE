import { Routes, Route, Navigate } from "react-router-dom"; // Added Navigate
import Login from "./pages/Login"
import FarmerDashboard from "./pages/FarmerDashboard"

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // If credentials aren't found, use Navigate to redirect
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      // Usage in your Routes:
<Route 
  path="/farmer" 
  element={
    <ProtectedRoute allowedRole="farmer">
      <FarmerDashboard />
    </ProtectedRoute>
  } 
/>
    </Routes>
  )
}
