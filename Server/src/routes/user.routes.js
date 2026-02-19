import express from "express"
import { getMe, updateMe, getVets } from "../controllers/user.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/me", authenticate, getMe)
router.put("/me", authenticate, updateMe)
router.get("/vets", authenticate, getVets)

export default router
