import bcrypt from "bcrypt"
import User from "../models/User.js"

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing fields" })
    }

    const existing = await User.findOne({ where: { email } })
    if (existing) {
      return res.status(400).json({ message: "Email already registered" })
    }

    const hashed = await bcrypt.hash(password, 10)

    await User.create({
      name,
      email,
      password_hash: hashed,
      role,
      status: "active"
    })

    res.status(201).json({ message: "User created" })
  } catch (err) {
    console.error("REGISTER ERROR:", err)
    res.status(500).json({ message: "Registration failed" })
  }
}
