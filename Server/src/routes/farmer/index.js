import express from "express"

import animalsRoutes from "./animals.routes.js"
import casesRoutes from "./cases.routes.js"
import consultationsRoutes from "./consultations.routes.js"
import diagnosticsRoutes from "./diagnostics.routes.js"
import treatmentRoutes from "./treatment.routes.js"
import nutritionRoutes from "./nutrition.routes.js"
import analyticsRoutes from "./analytics.routes.js"
import communicationRoutes from "./communication.routes.js"
import notificationRoutes from "./notification.routes.js"
import feedbackRoutes from "./feedback.routes.js"
import appointmentsRoutes from "./appointments.routes.js"

const router = express.Router()

router.use("/animals", animalsRoutes)
router.use("/cases", casesRoutes)
router.use("/consultations", consultationsRoutes)
router.use("/diagnostics", diagnosticsRoutes)
router.use("/treatment", treatmentRoutes)
router.use("/nutrition", nutritionRoutes)
router.use("/analytics", analyticsRoutes)
router.use("/messages", communicationRoutes)
router.use("/notifications", notificationRoutes)
router.use("/feedback", feedbackRoutes)
router.use("/appointments", appointmentsRoutes)

export default router
