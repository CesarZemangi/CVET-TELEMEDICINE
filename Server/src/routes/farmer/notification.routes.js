import express from 'express';
const router = express.Router();

// 1. Use import instead of require
// 2. Add the .js extension
// 3. Use 'authenticate' to match your middleware export
import { authenticate } from '../../middleware/auth.middleware.js';
import * as notificationController from '../../controllers/farmer/notification.controller.js';

router.get('/', authenticate, notificationController.getNotifications);
router.put('/:id/read', authenticate, notificationController.markAsSeen);
router.post('/', authenticate, notificationController.createNotification);

// 4. Use export default instead of module.exports
export default router;