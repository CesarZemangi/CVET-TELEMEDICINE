import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { getCaseStatistics, getMyPerformance } from "../../controllers/vet/analytics.controller.js"

const router = express.Router()

router.get("/case-statistics", auth, getCaseStatistics)
router.get("/performance", auth, getMyPerformance)

export default router
