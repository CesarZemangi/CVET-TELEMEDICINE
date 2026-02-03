import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';
import { success, error } from '../utils/response.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user in the 'users' table
    const user = await User.findOne({ where: { email } });

    // 2. If user doesn't exist
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Compare the plain-text password with the hash in the DB
    // Because of 'field: password_hash' in your model, user.password contains the hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Generate the JWT token
    const token = generateToken(user);

    // 5. Send back exactly what your React frontend expects
    // We include 'role' so navigate() knows where to go
    res.status(200).json({
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
    console.error("Login Error:", err);
    error(res, "An internal server error occurred");
  }
};
export const register = async (req, res) => {
try {
const { name, email, password, role } = req.body
const hashedPassword = await bcrypt.hash(password, 10)

const user = await User.create({
  name,
  email: email.trim().toLowerCase(),
  password: hashedPassword,
  role
})

res.status(201).json({
  message: "User registered",
  user: {
    id: user.id,
    email: user.email,
    role: user.role
  }
})
} catch (err) {
console.error(err)
error(res, "Registration failed")
}
}
 