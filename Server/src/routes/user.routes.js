import express from "express"
import { getMe, updateMe } from "../controllers/user.controller.js"
import auth from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/me", auth, getMe)
router.put("/me", auth, updateMe)

export default router
