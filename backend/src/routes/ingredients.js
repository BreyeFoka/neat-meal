import express from 'express';
import { ingredientController } from '../controllers/ingredientController.js';
import { validateIngredientCreation } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/ingredients - Get all ingredients (public)
router.get('/', ingredientController.getAllIngredients);

// GET /api/ingredients/categories - Get ingredient categories (public)
router.get('/categories', ingredientController.getIngredientCategories);

// POST /api/ingredients - Create new ingredient (protected)
router.post('/', 
  authenticateToken,
  validateIngredientCreation,
  ingredientController.createIngredient
);

export default router;
