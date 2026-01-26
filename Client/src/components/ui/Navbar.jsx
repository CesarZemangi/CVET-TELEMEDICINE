import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
const navigate = useNavigate()

function logout() {
localStorage.removeItem("user")
navigate("/")
}

return (
<div className="h-14 bg-white border-b flex items-center justify-between px-6">
<p className="font-semibold">
CVet Telemedicine
</p>
  <Button onClick={logout}>
    Logout
  </Button>
  localStorage.removeItem("user")
localStorage.removeItem("token")

navigate("/")
</div>)} 