import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  createAppointmentRequest,
  getFarmerAppointments,
  cancelAppointment
} from "../../controllers/farmer/appointments.controller.js"

const router = express.Router()

router.post("/", auth, createAppointmentRequest)
router.get("/", auth, getFarmerAppointments)
router.put("/:id/cancel", auth, cancelAppointment)

export default router
