import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  createLabRequest,
  uploadLabResult
} from "../../controllers/vet/diagnostics.controller.js"

const router = express.Router()

router.post("/lab-requests", auth, createLabRequest)
router.post("/lab-results", auth, uploadLabResult)

export default router
