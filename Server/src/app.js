import express from "express";
import cors from "cors";

// Core routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

// Farmer routes
import farmerAnimalRoutes from "./routes/farmer/animals.routes.js";
import farmerCaseRoutes from "./routes/farmer/cases.routes.js";
import farmerConsultRoutes from "./routes/farmer/consultations.routes.js";
import farmerDiagRoutes from "./routes/farmer/diagnostics.routes.js";
import farmerTreatRoutes from "./routes/farmer/treatment.routes.js";
import farmerNutriRoutes from "./routes/farmer/nutrition.routes.js";
import farmerCommRoutes from "./routes/farmer/communication.routes.js";
import farmerFeedbackRoutes from "./routes/farmer/feedback.routes.js";
import farmerNotificationRoutes from "./routes/farmer/notification.routes.js";

// Vet routes
import vetCaseRoutes from "./routes/vet/cases.routes.js";
import vetAppointmentRoutes from "./routes/vet/appointments.routes.js";
import vetDiagRoutes from "./routes/vet/diagnostics.routes.js";
import vetTreatRoutes from "./routes/vet/treatment.routes.js";
import vetAnalyticsRoutes from "./routes/vet/analytics.routes.js";
import vetCommRoutes from "./routes/vet/communication.routes.js";
import vetFeedbackRoutes from "./routes/vet/feedback.routes.js";
import vetNotificationRoutes from "./routes/vet/notification.routes.js";

// Middleware
import errorHandler from "./middleware/error.middleware.js";
import { authenticate } from "./middleware/auth.middleware.js";
import { authorizeRole } from "./middleware/role.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Core
app.use("/api/auth", authRoutes);
app.use("/api/users", authenticate, userRoutes); // example: protect users route

// Farmer
app.use("/api/farmer/animals", authenticate, authorizeRole("farmer"), farmerAnimalRoutes);
app.use("/api/farmer/cases", authenticate, authorizeRole("farmer"), farmerCaseRoutes);
app.use("/api/farmer/consultations", authenticate, authorizeRole("farmer"), farmerConsultRoutes);
app.use("/api/farmer/diagnostics", authenticate, authorizeRole("farmer"), farmerDiagRoutes);
app.use("/api/farmer/treatment", authenticate, authorizeRole("farmer"), farmerTreatRoutes);
app.use("/api/farmer/nutrition", authenticate, authorizeRole("farmer"), farmerNutriRoutes);
app.use("/api/farmer/communication", authenticate, authorizeRole("farmer"), farmerCommRoutes);
app.use("/api/farmer/feedback", authenticate, authorizeRole("farmer"), farmerFeedbackRoutes);
app.use("/api/farmer/notifications", authenticate, authorizeRole("farmer"), farmerNotificationRoutes);

// Vet
app.use("/api/vet/cases", authenticate, authorizeRole("vet"), vetCaseRoutes);
app.use("/api/vet/appointments", authenticate, authorizeRole("vet"), vetAppointmentRoutes);
app.use("/api/vet/diagnostics", authenticate, authorizeRole("vet"), vetDiagRoutes);
app.use("/api/vet/treatment", authenticate, authorizeRole("vet"), vetTreatRoutes);
app.use("/api/vet/analytics", authenticate, authorizeRole("vet"), vetAnalyticsRoutes);
app.use("/api/vet/communication", authenticate, authorizeRole("vet"), vetCommRoutes);
app.use("/api/vet/feedback", authenticate, authorizeRole("vet"), vetFeedbackRoutes);
app.use("/api/vet/notifications", authenticate, authorizeRole("vet"), vetNotificationRoutes);

// Global error handler
app.use(errorHandler);

export default app;
