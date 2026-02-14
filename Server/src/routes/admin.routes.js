import express from "express";
import { 
  getOverview, 
  getUsers, 
  updateUserStatus, 
  deleteUser, 
  getSystemLogs, 
  getProfile 
} from "../controllers/admin/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/overview", authenticate, adminOnly, getOverview);
router.get("/users", authenticate, adminOnly, getUsers);
router.put("/users/:id", authenticate, adminOnly, updateUserStatus);
router.delete("/users/:id", authenticate, adminOnly, deleteUser);
router.get("/logs", authenticate, adminOnly, getSystemLogs);
router.get("/profile", authenticate, adminOnly, getProfile);

export default router;
