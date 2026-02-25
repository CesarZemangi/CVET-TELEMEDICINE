import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getLabRequests,
  createLabRequest,
  getLabResults,
  farmerUploadLabResult
} from "../../controllers/farmer/diagnostics.controller.js"

const router = express.Router()

router.get("/lab-requests", auth, getLabRequests)
router.post("/lab-requests", auth, createLabRequest)
router.get("/lab-results", auth, getLabResults)
router.post("/lab-results", auth, farmerUploadLabResult)

export default router
