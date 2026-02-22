import express from "express";
import { 
  getOverview, 
  getUsers, 
  updateUserStatus, 
  deleteUser, 
  getSystemLogs, 
  getProfile,
  getUserDetails,
  getFarmerStats,
  getVetStats,
  getCases,
  getConsultations,
  broadcastNotification,
  sendDirectNotification,
  getAllChatLogs,
  getThreadMessages,
  getAllMedia
} from "../controllers/admin/admin.controller.js";
import {
  getOverviewAnalytics,
  getCaseAnalytics,
  getMessageAnalytics,
  getReminderAnalytics,
  getVetPerformance
} from "../controllers/admin/analytics.controller.js";
import appointmentsRoutes from "./admin/appointments.routes.js";

const router = express.Router();

router.get("/overview", getOverview);
router.get("/users", getUsers);
router.get("/users/:id", getUserDetails);
router.put("/users/:id", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/farmers", getFarmerStats);
router.get("/vets", getVetStats);
router.get("/cases", getCases);
router.get("/consultations", getConsultations);
router.get("/logs", getSystemLogs);
router.get("/profile", getProfile);
router.post("/notifications/broadcast", broadcastNotification);
router.post("/notifications/direct", sendDirectNotification);
router.get("/chat-logs", getAllChatLogs);
router.get("/chat-logs/thread", getThreadMessages);
router.get("/media", getAllMedia);

// Analytics
router.get("/analytics/overview", getOverviewAnalytics);
router.get("/analytics/cases", getCaseAnalytics);
router.get("/analytics/messages", getMessageAnalytics);
router.get("/analytics/reminders", getReminderAnalytics);
router.get("/analytics/vet-performance", getVetPerformance);

// Appointments
router.use("/appointments", appointmentsRoutes);

export default router;
