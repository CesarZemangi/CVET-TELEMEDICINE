import { body, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim(),
  body('role').isIn(['farmer', 'vet', 'admin']),
  validateRequest
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validateRequest
];

export const animalValidation = [
  body('tag_number').notEmpty().trim(),
  body('species').notEmpty().trim(),
  body('age').optional().isInt({ min: 0 }),
  validateRequest
];

export const caseValidation = [
  body('animal_id').isInt(),
  body('vet_id').isInt(),
  body('title').notEmpty().trim().isLength({ max: 255 }),
  body('description').notEmpty().trim(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  validateRequest
];

export const appointmentValidation = [
  body('case_id').isInt(),
  body('vet_id').isInt(),
  body('appointment_date').isISO8601(),
  body('appointment_time').notEmpty().matches(/^([01]\d|2[0-3]):?([0-5]\d)$/),
  validateRequest
];

export const feedbackValidation = [
  body('case_id').isInt(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comments').notEmpty().trim(),
  validateRequest
];

export const inventoryValidation = [
  body('feed_name').notEmpty().trim(),
  body('quantity').isDecimal(),
  body('unit').optional().isIn(['kg', 'tons', 'bags', 'liters']),
  body('low_stock_threshold').optional().isDecimal(),
  validateRequest
];

export const reminderValidation = [
  body('animal_id').isInt(),
  body('reminder_type').notEmpty().trim(),
  body('reminder_date').isISO8601(),
  validateRequest
];
