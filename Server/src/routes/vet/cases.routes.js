import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getCases,
  assignCase,
  closeCase
} from "../../controllers/vet/cases.controller.js"

const router = express.Router()

router.get("/", auth, getCases)
router.put("/:id/assign", auth, assignCase)
router.put("/:id/close", auth, closeCase)

export default router
