import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getPrescriptions,
  getTreatmentPlans
} from "../../controllers/farmer/treatment.controller.js"

const router = express.Router()

router.get("/prescriptions", auth, getPrescriptions)
router.get("/plans", auth, getTreatmentPlans)

export default router
