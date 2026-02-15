import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getCases,
  createCase,
  getCaseById,
  uploadMedia
} from "../../controllers/farmer/cases.controller.js"
import { upload } from "../../utils/upload.utils.js"
import { caseCreationLimiter } from "../../middleware/rateLimit.middleware.js"

const router = express.Router()

router.get("/", auth, getCases)
router.post("/", auth, caseCreationLimiter, createCase)
router.get("/:id", auth, getCaseById)
router.post("/:id/media", auth, upload.array('media', 5), uploadMedia)

export default router
