import express from "express";
import { 
  getMessagesByCase, 
  getAllMessages,
  sendMessage, 
  getNotifications, 
  markAsRead,
  getChatlogs 
} from "../controllers/communication.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/messages", authenticate, getAllMessages);
router.get("/messages/:case_id", authenticate, getMessagesByCase);
router.post("/messages", authenticate, sendMessage);
router.get("/notifications", authenticate, getNotifications);
router.get("/chatlogs", authenticate, getChatlogs);
router.put("/notifications/:id/read", authenticate, markAsRead);

export default router;
