import express from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { validateCategoryCreation } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/categories - Get all categories (public)
router.get('/', categoryController.getAllCategories);

// POST /api/categories - Create new category (protected)
router.post('/', 
  authenticateToken,
  validateCategoryCreation,
  categoryController.createCategory
);

export default router;
