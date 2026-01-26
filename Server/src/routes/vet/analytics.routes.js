import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { getCaseStatistics } from "../../controllers/vet/analytics.controller.js"

const router = express.Router()

router.get("/case-statistics", auth, getCaseStatistics)

export default router
