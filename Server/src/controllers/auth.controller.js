import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import User from "../models/user.model.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("LOGIN BODY", req.body);

    const userInstance = await User.findOne({
      where: { email: email.trim().toLowerCase() }
    });

    if (!userInstance) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = userInstance.get({ plain: true });

    // Note: user.password works if your model maps 'password_hash' to 'password'
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
}; // Closed properly now

export const logout = async (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role || 'farmer'
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("REGISTER ERROR", err);
    return res.status(500).json({
      message: "Registration failed",
      error: err.message
    });
  }
};