import express from "express";
import { createVetReview, getMySubmittedVetReviews, getMyVetReviews, getVets, getVetReviews } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getVets);
router.get("/my/reviews", authenticate, getMyVetReviews);
router.get("/my/submitted-reviews", authenticate, getMySubmittedVetReviews);
router.get("/:id/reviews", authenticate, getVetReviews);
router.post("/:id/reviews", authenticate, createVetReview);

export default router;
