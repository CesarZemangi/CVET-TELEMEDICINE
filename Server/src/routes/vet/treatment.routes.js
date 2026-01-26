import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  createPrescription,
  createTreatmentPlan
} from "../../controllers/vet/treatment.controller.js"

const router = express.Router()

router.post("/prescriptions", auth, createPrescription)
router.post("/plans", auth, createTreatmentPlan)

export default router
