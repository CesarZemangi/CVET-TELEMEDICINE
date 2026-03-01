import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { appointmentValidation } from "../../middleware/validation.middleware.js"
import {
  createAppointmentRequest,
  getFarmerAppointments,
  cancelAppointment,
  getCasesForAppointments,
  getVetsForAppointments,
  updateAppointment,
  deleteAppointment,
  joinSession
} from "../../controllers/farmer/appointments.controller.js"

const router = express.Router()

router.get("/cases", auth, getCasesForAppointments)
router.get("/vets", auth, getVetsForAppointments)
router.post("/", auth, appointmentValidation, createAppointmentRequest)
router.get("/", auth, getFarmerAppointments)
router.get("/:id/join-session", auth, joinSession)
router.put("/:id/cancel", auth, cancelAppointment)
router.put("/:id", auth, appointmentValidation, updateAppointment)
router.delete("/:id", auth, deleteAppointment)

export default router
