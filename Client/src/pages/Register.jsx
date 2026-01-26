import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"

export default function Register() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#F5F5DC" }} // cream background
    >
      <Card
        className="w-96 shadow-lg"
        style={{
          borderRadius: "12px",
          border: "1px solid #A0522D", // brown border
          backgroundColor: "#fff",
        }}
      >
        <CardContent className="p-6 space-y-4">
          <h2
            className="text-xl font-semibold text-center mb-4"
            style={{ color: "#A0522D" }} // brown heading
          >
            Create Account
          </h2>

          <Input
            placeholder="Full Name"
            style={{ borderColor: "#A0522D" }}
          />
          <Input
            placeholder="Email"
            style={{ borderColor: "#A0522D" }}
          />
          <Input
            placeholder="Phone Number"
            style={{ borderColor: "#A0522D" }}
          />
          <Input
            type="password"
            placeholder="Password"
            style={{ borderColor: "#A0522D" }}
          />

          <Button
            onClick={() => navigate("/")}
            className="w-full"
            style={{
              backgroundColor: "#A0522D",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Create Account
          </Button>

          <p className="text-sm text-center mt-3">
            Already have an account?
            <Link
              to="/"
              className="ml-1"
              style={{ color: "#A0522D", fontWeight: "500" }}
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
