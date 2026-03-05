import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { predictDisease } from "../../controllers/ml.controller.js"
import {
  getLabRequests,
  createLabRequest,
  getLabResults,
  farmerUploadLabResult,
  getVaccinations,
  getScreenings
} from "../../controllers/farmer/diagnostics.controller.js"

const router = express.Router()

router.get("/lab-requests", auth, getLabRequests)
router.post("/lab-requests", auth, createLabRequest)
router.get("/lab-results", auth, getLabResults)
router.post("/lab-results", auth, farmerUploadLabResult)
router.get("/vaccinations", auth, getVaccinations)
router.get("/screenings", auth, getScreenings)
router.post("/predict", auth, predictDisease)

export default router
