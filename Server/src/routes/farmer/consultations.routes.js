import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { getConsultations } from "../../controllers/farmer/consultations.controller.js"

const router = express.Router()

router.get("/", auth, getConsultations)

export default router
