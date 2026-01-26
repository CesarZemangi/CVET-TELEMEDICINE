import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getCases,
  createCase,
  getCaseById
} from "../../controllers/farmer/cases.controller.js"

const router = express.Router()

router.get("/", auth, getCases)
router.post("/", auth, createCase)
router.get("/:id", auth, getCaseById)

export default router
