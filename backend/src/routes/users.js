import express from 'express';
import { userController } from '../controllers/userController.js';
import { validateUserId } from '../middleware/validation.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { param, body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// GET /api/users/:id - Get user profile (public basic info)
router.get('/:id', 
  validateUserId,
  userController.getUserProfile
);

// GET /api/users/:userId/favorites - Get user favorites (protected - own favorites only)
router.get('/:userId/favorites', 
  authenticateToken,
  validateUserId,
  userController.getUserFavorites
);

// GET /api/users/:userId/stats - Get user statistics (protected - own stats only)
router.get('/:userId/stats',
  authenticateToken,
  validateUserId,
  userController.getUserStats
);

// POST /api/users/favorites - Add to favorites (protected)
router.post('/favorites',
  authenticateToken,
  [
    body('recipeId')
      .isInt({ min: 1 })
      .withMessage('Recipe ID must be a positive integer'),
    handleValidationErrors
  ],
  userController.addToFavorites
);

// DELETE /api/users/favorites/:recipeId - Remove from favorites (protected)
router.delete('/favorites/:recipeId',
  authenticateToken,
  [
    param('recipeId')
      .isInt({ min: 1 })
      .withMessage('Recipe ID must be a positive integer'),
    handleValidationErrors
  ],
  userController.removeFromFavorites
);

export default router;
