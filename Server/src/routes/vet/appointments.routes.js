import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getVetAppointments,
  approveAppointment,
  rejectAppointment,
  completeAppointment,
  rescheduleAppointment,
  cancelAppointment,
  getCasesForAppointments,
  joinSession
} from "../../controllers/vet/appointments.controller.js"

const router = express.Router()

router.get("/cases", auth, getCasesForAppointments)
router.get("/", auth, getVetAppointments)
router.get("/:id/join-session", auth, joinSession)
router.put("/:id/approve", auth, approveAppointment)
router.put("/:id/reject", auth, rejectAppointment)
router.put("/:id/complete", auth, completeAppointment)
router.put("/:id/cancel", auth, cancelAppointment)
router.put("/:id/reschedule", auth, rescheduleAppointment)

export default router
