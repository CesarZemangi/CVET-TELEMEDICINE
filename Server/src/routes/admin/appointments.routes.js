import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { adminOnly } from "../../middleware/admin.middleware.js"
import {
  getAllAppointments,
  getAppointmentStats,
  adminOverrideStatus,
  getAppointmentDetails
} from "../../controllers/admin/appointments.controller.js"

const router = express.Router()

router.get("/", auth, adminOnly, getAllAppointments)
router.get("/stats", auth, adminOnly, getAppointmentStats)
router.get("/:id", auth, adminOnly, getAppointmentDetails)
router.put("/:id/override-status", auth, adminOnly, adminOverrideStatus)

export default router
