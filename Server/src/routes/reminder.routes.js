import express from 'express';
import { 
    createReminder, 
    getFarmerReminders, 
    updateReminder, 
    deleteReminder,
    getAllReminders
} from '../controllers/reminder.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRole } from '../middleware/role.middleware.js';
import { reminderValidation } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorizeRole('farmer'), reminderValidation, createReminder);
router.get('/farmer/:id', authenticate, getFarmerReminders);
router.put('/:id', authenticate, updateReminder);
router.delete('/:id', authenticate, deleteReminder);

// Admin only: view all reminders
router.get('/', authenticate, authorizeRole('admin'), getAllReminders);

export default router;
