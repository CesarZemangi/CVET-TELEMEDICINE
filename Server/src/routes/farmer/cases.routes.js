import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { caseValidation, caseUpdateValidation } from "../../middleware/validation.middleware.js"
import {
  getCases,
  createCase,
  getCaseById,
  uploadMedia,
  updateCase,
  deleteCase,
  restoreCase,
  deleteCasePermanent
} from "../../controllers/farmer/cases.controller.js"
import { upload } from "../../utils/upload.utils.js"
import { caseCreationLimiter } from "../../middleware/rateLimit.middleware.js"

const router = express.Router()

router.get("/", auth, getCases)
router.post("/", auth, caseCreationLimiter, caseValidation, createCase)
router.get("/:id", auth, getCaseById)
router.put("/:id", auth, caseUpdateValidation, updateCase)
router.delete("/:id", auth, deleteCase)
router.post("/:id/media", auth, upload.array('media', 5), uploadMedia)
router.post("/:id/restore", auth, restoreCase)
router.patch("/:id/restore", auth, restoreCase) // alias for REST clients using PATCH
router.delete("/:id/permanent", auth, deleteCasePermanent)

export default router
