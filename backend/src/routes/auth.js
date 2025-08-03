import express from 'express';
import { authController } from '../controllers/authController.js';
import { validateUserRegistration, validateUserLogin, handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken, authRateLimit } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// Public routes with rate limiting
router.post('/register', 
  authRateLimit,
  validateUserRegistration,
  authController.register
);

router.post('/login',
  authRateLimit,
  validateUserLogin,
  authController.login
);

// Protected routes
router.get('/profile',
  authenticateToken,
  authController.getProfile
);

router.put('/profile',
  authenticateToken,
  [
    body('firstName')
      .optional()
      .isLength({ max: 50 })
      .withMessage('First name must be less than 50 characters')
      .trim(),
    
    body('lastName')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Last name must be less than 50 characters')
      .trim(),
    
    body('dietaryRestrictions')
      .optional()
      .isArray()
      .withMessage('Dietary restrictions must be an array'),
    
    handleValidationErrors
  ],
  authController.updateProfile
);

router.put('/change-password',
  authenticateToken,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    handleValidationErrors
  ],
  authController.changePassword
);

export default router;
