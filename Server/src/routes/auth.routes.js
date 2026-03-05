import express from "express"
import {
  login,
  register,
  logout,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"
import { registerValidation, loginValidation } from "../middleware/validation.middleware.js"

const router = express.Router()

router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)
router.post("/logout", logout)
router.put("/profile", authenticate, updateProfile)
router.post("/change-password", authenticate, changePassword)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

export default router
