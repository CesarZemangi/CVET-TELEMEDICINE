import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getVetAppointments,
  approveAppointment,
  rejectAppointment,
  completeAppointment,
  rescheduleAppointment
} from "../../controllers/vet/appointments.controller.js"

const router = express.Router()

router.get("/", auth, getVetAppointments)
router.put("/:id/approve", auth, approveAppointment)
router.put("/:id/reject", auth, rejectAppointment)
router.put("/:id/complete", auth, completeAppointment)
router.put("/:id/reschedule", auth, rescheduleAppointment)

export default router
