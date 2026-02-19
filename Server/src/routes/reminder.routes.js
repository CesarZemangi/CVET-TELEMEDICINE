import express from 'express';
import { 
    createReminder, 
    getFarmerReminders, 
    updateReminder, 
    deleteReminder,
    getAllReminders,
    createAdminReminder,
    getAdminReminders
} from '../controllers/reminder.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { reminderValidation } from '../middleware/validation.middleware.js';

const router = express.Router();

// Preventive Reminders (Farmers)
router.post('/preventive', authenticate, authorizeRoles('farmer'), reminderValidation, createReminder);
router.get('/farmer/:id', authenticate, getFarmerReminders);

// Admin Reminders
router.post('/admin', authenticate, authorizeRoles('admin'), createAdminReminder);
router.get('/admin', authenticate, authorizeRoles('admin'), getAdminReminders);

// General
router.put('/:id', authenticate, updateReminder);
router.delete('/:id', authenticate, deleteReminder);

// View all preventive reminders (Admin only)
router.get('/all-preventive', authenticate, authorizeRoles('admin'), getAllReminders);

export default router;
