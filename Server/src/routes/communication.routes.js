import express from "express";
import { 
  getMessagesByCase, 
  getAllMessages,
  sendMessage, 
  getNotifications, 
  markAsRead,
  getChatlogs,
  getConversations,
  getContacts,
  adminBroadcastNotification,
  adminDirectNotification,
  adminViewAllChatlogs 
} from "../controllers/communication.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { messageLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.get("/conversations", authenticate, getConversations);
router.get("/contacts", authenticate, getContacts);
router.get("/messages", authenticate, getAllMessages);
router.get("/messages/:case_id", authenticate, getMessagesByCase);
router.post("/messages", authenticate, messageLimiter, sendMessage);
router.get("/notifications", authenticate, getNotifications);
router.get("/chatlogs", authenticate, getChatlogs);
router.put("/notifications/:id/read", authenticate, markAsRead);

// Admin routes
router.post("/admin/broadcast", authenticate, adminOnly, adminBroadcastNotification);
router.post("/admin/notify", authenticate, adminOnly, adminDirectNotification);
router.get("/admin/chatlogs", authenticate, adminOnly, adminViewAllChatlogs);

export default router;
