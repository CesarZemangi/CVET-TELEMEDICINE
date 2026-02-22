import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getCases,
  getUnassignedCases,
  assignCase,
  closeCase,
  updatePriority,
  getVetCasesForDropdown,
  getVetCasesSummary
} from "../../controllers/vet/cases.controller.js"

const router = express.Router()

router.get("/", auth, getCases)
router.get("/dropdown", auth, getVetCasesForDropdown)
router.get("/summary", auth, getVetCasesSummary)
router.get("/unassigned", auth, getUnassignedCases)
router.put("/:id/assign", auth, assignCase)
router.put("/:id/close", auth, closeCase)
router.put("/:id/priority", auth, updatePriority)

export default router
