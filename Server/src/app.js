import express from "express"
import cors from "cors"

// Core routes
import authRoutes from "./src/routes/auth.routes.js"
import userRoutes from "./src/routes/user.routes.js"

// Farmer routes
import farmerAnimalRoutes from "./src/routes/farmer/animals.routes.js"
import farmerCaseRoutes from "./src/routes/farmer/cases.routes.js"
import farmerConsultRoutes from "./src/routes/farmer/consultations.routes.js"
import farmerDiagRoutes from "./src/routes/farmer/diagnostics.routes.js"
import farmerTreatRoutes from "./src/routes/farmer/treatment.routes.js"
import farmerNutriRoutes from "./src/routes/farmer/nutrition.routes.js"
import farmerCommRoutes from "./src/routes/farmer/communication.routes.js"
import farmerFeedbackRoutes from "./src/routes/farmer/feedback.routes.js"
import farmerNotificationRoutes from "./src/routes/farmer/notification.routes.js"

// Vet routes
import vetCaseRoutes from "./src/routes/vet/cases.routes.js"
import vetAppointmentRoutes from "./src/routes/vet/appointments.routes.js"
import vetDiagRoutes from "./src/routes/vet/diagnostics.routes.js"
import vetTreatRoutes from "./src/routes/vet/treatment.routes.js"
import vetAnalyticsRoutes from "./src/routes/vet/analytics.routes.js"
import vetCommRoutes from "./src/routes/vet/communication.routes.js"
import vetFeedbackRoutes from "./src/routes/vet/feedback.routes.js"
import vetNotificationRoutes from "./src/routes/vet/notification.routes.js"

// Middleware
import errorHandler from "./src/middleware/error.middleware.js"

const app = express()
app.use(cors())
app.use(express.json())

// Core
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

// Farmer
app.use("/api/farmer/animals", farmerAnimalRoutes)
app.use("/api/farmer/cases", farmerCaseRoutes)
app.use("/api/farmer/consultations", farmerConsultRoutes)
app.use("/api/farmer/diagnostics", farmerDiagRoutes)
app.use("/api/farmer/treatment", farmerTreatRoutes)
app.use("/api/farmer/nutrition", farmerNutriRoutes)
app.use("/api/farmer/communication", farmerCommRoutes)
app.use("/api/farmer/feedback", farmerFeedbackRoutes)
app.use("/api/farmer/notifications", farmerNotificationRoutes)

// Vet
app.use("/api/vet/cases", vetCaseRoutes)
app.use("/api/vet/appointments", vetAppointmentRoutes)
app.use("/api/vet/diagnostics", vetDiagRoutes)
app.use("/api/vet/treatment", vetTreatRoutes)
app.use("/api/vet/analytics", vetAnalyticsRoutes)
app.use("/api/vet/communication", vetCommRoutes)
app.use("/api/vet/feedback", vetFeedbackRoutes)
app.use("/api/vet/notifications", vetNotificationRoutes)

// Error middleware (global)
app.use(errorHandler)

export default app
