import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Assuming you are using Shadcn/UI or similar component library
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "farmer" // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Point to the full Backend URL
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        // Capture the error message from our backend's error() helper
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! Please login.");
      navigate("/"); // Navigate to the login page
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F5DC" }}>
      <Card className="w-96 shadow-lg" style={{ borderRadius: "12px", border: "1px solid #A0522D", backgroundColor: "#fff" }}>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-center mb-4" style={{ color: "#A0522D" }}>
            Create Account
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} style={{ borderColor: "#A0522D" }} required />
            <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ borderColor: "#A0522D" }} required />
            <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} style={{ borderColor: "#A0522D" }} />
            <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={{ borderColor: "#A0522D" }} required />

            <div className="flex justify-around p-2 bg-slate-50 rounded-lg border border-dashed border-stone-300">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="role" value="farmer" checked={form.role === "farmer"} onChange={handleChange} className="accent-[#A0522D]" />
                <span className="text-sm font-medium">Farmer</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="role" value="vet" checked={form.role === "vet"} onChange={handleChange} className="accent-[#A0522D]" />
                <span className="text-sm font-medium">Vet</span>
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full" style={{ backgroundColor: "#A0522D", color: "#fff", fontWeight: "bold" }}>
              {loading ? "Registering..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center mt-2">
             <button onClick={() => navigate("/")} className="text-xs text-stone-500 hover:underline">
               Already have an account? Log in
             </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}