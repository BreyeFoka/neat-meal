import express from 'express';
import { recipeController } from '../controllers/recipeController.js';
import { validateRecipeCreation, validateRecipeId, validateRecipeQuery } from '../middleware/validation.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/recipes - Get all recipes with filtering (public with optional auth)
router.get('/', 
  optionalAuth,
  validateRecipeQuery,
  recipeController.getAllRecipes
);

// GET /api/recipes/category/:categoryType/:categoryName - Get recipes by category (public)
router.get('/category/:categoryType/:categoryName?', 
  optionalAuth,
  recipeController.getRecipesByCategory
);

// GET /api/recipes/:id - Get single recipe (public)
router.get('/:id', 
  optionalAuth,
  validateRecipeId,
  recipeController.getRecipeById
);

// POST /api/recipes - Create new recipe (protected)
router.post('/', 
  authenticateToken,
  validateRecipeCreation,
  recipeController.createRecipe
);

// PUT /api/recipes/:id - Update recipe (protected)
router.put('/:id', 
  authenticateToken,
  validateRecipeId,
  validateRecipeCreation,
  recipeController.updateRecipe
);

// DELETE /api/recipes/:id - Delete recipe (protected)
router.delete('/:id', 
  authenticateToken,
  validateRecipeId,
  recipeController.deleteRecipe
);

export default router;
