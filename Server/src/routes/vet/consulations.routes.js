import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { getVetConsultations } from "../../controllers/vet/consultations.controller.js"

const router = express.Router()

router.get("/", auth, getVetConsultations)

export default router
