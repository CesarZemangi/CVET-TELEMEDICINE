import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import VetDashboard from "./pages/VetDashboard";

function ProtectedRoute({ children, allowedRole }) {
const userData = localStorage.getItem("user");

if (!userData) {
return <Navigate to="/" replace />;
}

let user;
try {
user = JSON.parse(userData);
} catch {
localStorage.removeItem("user");
return <Navigate to="/" replace />;
}

if (!user.token) {
return <Navigate to="/" replace />;
}

if (allowedRole && user.role !== allowedRole) {
return <Navigate to="/" replace />;
}

return children;
}

export default function App() {
return (
<Routes>
<Route path="/" element={<Login />} />

  <Route
    path="/farmerdashboard"
    element={
      <ProtectedRoute allowedRole="farmer">
        <FarmerDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/vetdashboard"
    element={
      <ProtectedRoute allowedRole="vet">
        <VetDashboard />
      </ProtectedRoute>
    }
  />

  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>


);
}