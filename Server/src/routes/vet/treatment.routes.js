import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getPrescriptions,
  createPrescription,
  getTreatmentPlans,
  createTreatmentPlan,
  createMedicationHistory,
  getAnimalMedications,
  getMedicationHistory,
  getCasesForTreatment
} from "../../controllers/vet/treatment.controller.js"

const router = express.Router()

router.get("/cases", auth, getCasesForTreatment)
router.get("/prescriptions", auth, getPrescriptions)
router.get("/plans", auth, getTreatmentPlans)
router.post("/prescriptions", auth, createPrescription)
router.post("/plans", auth, createTreatmentPlan)

// Medication History (Vet only creates, anyone authenticated can view for specific animal if they have access)
router.post("/medication-history", auth, createMedicationHistory)
router.get("/medication-history", auth, getMedicationHistory)
router.get("/animal/:animal_id/medications", auth, getAnimalMedications)

export default router