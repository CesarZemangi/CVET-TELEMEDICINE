import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getHealthTrends,
  getTreatmentStats
} from "../../controllers/farmer/analytics.controller.js"

const router = express.Router()

router.get("/health-trends", auth, getHealthTrends)
router.get("/treatment-stats", auth, getTreatmentStats)

export default router
