import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { getVetConsultations, createConsultation } from "../../controllers/vet/consultations.controller.js"

const router = express.Router()

router.get("/", auth, getVetConsultations)
router.post("/", auth, createConsultation)

export default router
