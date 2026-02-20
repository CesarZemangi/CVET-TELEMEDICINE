import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import logger from "./utils/logger.js";

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
import farmerDashboardRoutes from "./routes/farmer/dashboard.routes.js";

// Admin routes
import adminRoutes from "./routes/admin.routes.js";
import communicationRoutes from "./routes/communication.routes.js";
import reminderRoutes from "./routes/reminder.routes.js";
import path from "path";

// Vet routes
import vetCaseRoutes from "./routes/vet/cases.routes.js";
import vetAppointmentRoutes from "./routes/vet/appointments.routes.js";
import vetDiagRoutes from "./routes/vet/diagnostics.routes.js";
import vetTreatRoutes from "./routes/vet/treatment.routes.js";
import vetAnalyticsRoutes from "./routes/vet/analytics.routes.js";
import vetCommRoutes from "./routes/vet/communication.routes.js";
import vetFeedbackRoutes from "./routes/vet/feedback.routes.js";
import vetNotificationRoutes from "./routes/vet/notification.routes.js";
import vetDashboardRoutes from "./routes/vet/dashboard.routes.js";

import { authLimiter } from "./middleware/rateLimit.middleware.js";

// Middleware
import errorHandler from "./middleware/error.middleware.js";
import { authenticate } from "./middleware/auth.middleware.js";
import { authorizeRoles } from "./middleware/role.middleware.js";

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 1. Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Standard Middleware
app.use(express.json());
app.use("/uploads", express.static("storage/uploads"));

// 3. Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/user", authenticate, userRoutes);
app.use("/api/admin", authenticate, authorizeRoles("admin"), adminRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/communication", authenticate, communicationRoutes);

app.use("/api/farmer/dashboard", authenticate, authorizeRoles("farmer"), farmerDashboardRoutes);
// Farmer
app.use("/api/farmer/animals", authenticate, authorizeRoles("farmer"), farmerAnimalRoutes);
app.use("/api/farmer/cases", authenticate, authorizeRoles("farmer"), farmerCaseRoutes);
app.use("/api/farmer/consultations", authenticate, authorizeRoles("farmer"), farmerConsultRoutes);
app.use("/api/farmer/diagnostics", authenticate, authorizeRoles("farmer"), farmerDiagRoutes);
app.use("/api/farmer/treatment", authenticate, authorizeRoles("farmer"), farmerTreatRoutes);
app.use("/api/farmer/nutrition", authenticate, authorizeRoles("farmer"), farmerNutriRoutes);
app.use("/api/farmer/communication", authenticate, authorizeRoles("farmer"), farmerCommRoutes);
app.use("/api/farmer/feedback", authenticate, authorizeRoles("farmer"), farmerFeedbackRoutes);
app.use("/api/farmer/notifications", authenticate, authorizeRoles("farmer"), farmerNotificationRoutes);

// Vet
app.use("/api/vet/dashboard", authenticate, authorizeRoles("vet"), vetDashboardRoutes);
app.use("/api/vet/cases", authenticate, authorizeRoles("vet"), vetCaseRoutes);
app.use("/api/vet/appointments", authenticate, authorizeRoles("vet"), vetAppointmentRoutes);
app.use("/api/vet/diagnostics", authenticate, authorizeRoles("vet"), vetDiagRoutes);
app.use("/api/vet/treatment", authenticate, authorizeRoles("vet"), vetTreatRoutes);
app.use("/api/vet/analytics", authenticate, authorizeRoles("vet"), vetAnalyticsRoutes);
app.use("/api/vet/communication", authenticate, authorizeRoles("vet"), vetCommRoutes);
app.use("/api/vet/feedback", authenticate, authorizeRoles("vet"), vetFeedbackRoutes);
app.use("/api/vet/notifications", authenticate, authorizeRoles("vet"), vetNotificationRoutes);

// Global error handler
app.use(errorHandler);

export default app;
