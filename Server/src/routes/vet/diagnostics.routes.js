import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getLabRequests,
  createLabRequest,
  uploadLabResult,
  getLabResults,
  getCasesForDiagnostics
} from "../../controllers/vet/diagnostics.controller.js"

const router = express.Router()

router.get("/cases", auth, getCasesForDiagnostics)
router.get("/lab-requests", auth, getLabRequests)
router.get("/lab-results", auth, getLabResults)
router.post("/lab-requests", auth, createLabRequest)
router.post("/lab-results", auth, uploadLabResult)

export default router
