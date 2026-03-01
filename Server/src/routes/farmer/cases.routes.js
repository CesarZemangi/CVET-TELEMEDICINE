import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { caseValidation } from "../../middleware/validation.middleware.js"
import {
  getCases,
  createCase,
  getCaseById,
  uploadMedia,
  updateCase,
  deleteCase
} from "../../controllers/farmer/cases.controller.js"
import { upload } from "../../utils/upload.utils.js"
import { caseCreationLimiter } from "../../middleware/rateLimit.middleware.js"

const router = express.Router()

router.get("/", auth, getCases)
router.post("/", auth, caseCreationLimiter, caseValidation, createCase)
router.get("/:id", auth, getCaseById)
router.put("/:id", auth, caseValidation, updateCase)
router.delete("/:id", auth, deleteCase)
router.post("/:id/media", auth, upload.array('media', 5), uploadMedia)

export default router
