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

export const reminderValidation = [
  body('animal_id').isInt(),
  body('reminder_type').notEmpty().trim(),
  body('reminder_date').isISO8601(),
  validateRequest
];
