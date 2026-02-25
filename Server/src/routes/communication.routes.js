import express from "express";
import { 
  getMessagesByCase, 
  getAllMessages,
  sendMessage, 
  getNotifications, 
  clearAllNotifications,
  markAsRead,
  getChatlogs,
  getConversations,
  getContacts,
  adminBroadcastNotification,
  adminDirectNotification,
  adminViewAllChatlogs,
  adminGetChatThread
} from "../controllers/communication.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { messageLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.get("/conversations", authenticate, getConversations);
router.get("/contacts", authenticate, getContacts);
router.delete("/notifications/clear/all", authenticate, clearAllNotifications);
router.get("/notifications", authenticate, getNotifications);
router.put("/messages/read", authenticate, markAsRead);
router.get("/chatlogs", authenticate, getChatlogs);
router.get("/messages/:case_id", authenticate, getMessagesByCase);
router.get("/messages", authenticate, getAllMessages);
router.post("/messages", authenticate, messageLimiter, sendMessage);
// router.put("/notifications/:id/read", authenticate, markAsRead); // Old redundant route

// Admin routes
router.post("/admin/broadcast", authenticate, adminOnly, adminBroadcastNotification);
router.post("/admin/notify", authenticate, adminOnly, adminDirectNotification);
router.get("/admin/chatlogs", authenticate, adminOnly, adminViewAllChatlogs);
router.get("/admin/chatlogs/thread", authenticate, adminOnly, adminGetChatThread);

export default router;
