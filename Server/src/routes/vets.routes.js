import express from "express";
import { getVets, getVetReviews } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getVets);
router.get("/:id/reviews", authenticate, getVetReviews);

export default router;
