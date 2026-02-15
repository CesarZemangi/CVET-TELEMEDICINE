import express from "express"
import { login, register, logout, updateProfile } from "../controllers/auth.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"
import { registerValidation, loginValidation } from "../middleware/validation.middleware.js"

const router = express.Router()

router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)
router.post("/logout", logout)
router.put("/profile", authenticate, updateProfile)

export default router
