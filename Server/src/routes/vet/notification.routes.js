import express from 'express';
const router = express.Router();

// 1. Change require to import
// 2. Add .js extensions (Mandatory in ESM)
// 3. Use 'authenticate' and 'authorizeRole' to match your exported middleware names
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRole } from '../../middleware/role.middleware.js';
import * as notificationVetController from '../../controllers/vet/notification.controller.js';

// Use the corrected middleware names
router.get('/', authenticate, authorizeRole('vet'), notificationVetController.getVetNotifications);
router.put('/:id/seen', authenticate, authorizeRole('vet'), notificationVetController.markVetNotificationAsSeen);

export default router;