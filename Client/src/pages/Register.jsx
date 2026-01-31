import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "farmer"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      alert("Registration successful! Please login.")
      navigate("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F5DC" }}>
      <Card className="w-96 shadow-lg" style={{ borderRadius: "12px", border: "1px solid #A0522D", backgroundColor: "#fff" }}>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-center mb-4" style={{ color: "#A0522D" }}>
            Create Account
          </h2>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} style={{ borderColor: "#A0522D" }} />
            <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ borderColor: "#A0522D" }} />
            <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} style={{ borderColor: "#A0522D" }} />
            <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={{ borderColor: "#A0522D" }} />

            <div className="flex justify-between mt-2">
              <label>
                <input type="radio" name="role" value="farmer" checked={form.role === "farmer"} onChange={handleChange} /> Farmer
              </label>
              <label>
                <input type="radio" name="role" value="vet" checked={form.role === "vet"} onChange={handleChange} /> Vet
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full" style={{ backgroundColor: "#A0522D", color: "#fff", fontWeight: "bold" }}>
              {loading ? "Registering..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
