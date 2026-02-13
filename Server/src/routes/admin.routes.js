import express from "express";
import { getOverview } from "../controllers/admin/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/overview", authenticate, adminOnly, getOverview);

export default router;
