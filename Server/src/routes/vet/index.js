import express from "express"

import casesRoutes from "./cases.routes.js"
import appointmentsRoutes from "./appointments.routes.js"
import consultationsRoutes from "./consultations.routes.js"
import diagnosticsRoutes from "./diagnostics.routes.js"
import treatmentRoutes from "./treatment.routes.js"
import analyticsRoutes from "./analytics.routes.js"
import communicationRoutes from "./communication.routes.js"
import notificationRoutes from "./notification.routes.js"
import feedbackRoutes from "./feedback.routes.js"
import mediaRoutes from "./media.routes.js"

const router = express.Router()

router.use("/cases", casesRoutes)
router.use("/appointments", appointmentsRoutes)
router.use("/consultations", consultationsRoutes)
router.use("/diagnostics", diagnosticsRoutes)
router.use("/treatment", treatmentRoutes)
router.use("/analytics", analyticsRoutes)
router.use("/messages", communicationRoutes)
router.use("/notifications", notificationRoutes)
router.use("/feedback", feedbackRoutes)
router.use("/media", mediaRoutes)

export default router
