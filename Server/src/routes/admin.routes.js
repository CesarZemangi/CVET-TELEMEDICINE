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
  getConsultations
} from "../controllers/admin/admin.controller.js";
import {
  getOverviewAnalytics,
  getCaseAnalytics,
  getMessageAnalytics,
  getReminderAnalytics,
  getVetPerformance
} from "../controllers/admin/analytics.controller.js";

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

// Analytics
router.get("/analytics/overview", getOverviewAnalytics);
router.get("/analytics/cases", getCaseAnalytics);
router.get("/analytics/messages", getMessageAnalytics);
router.get("/analytics/reminders", getReminderAnalytics);
router.get("/analytics/vet-performance", getVetPerformance);

export default router;
