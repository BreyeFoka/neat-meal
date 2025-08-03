import { body, param, query, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
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
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Recipe validation rules
export const validateRecipeCreation = [
  body('title')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .trim(),
  
  body('instructions')
    .notEmpty()
    .withMessage('Instructions are required')
    .isLength({ max: 5000 })
    .withMessage('Instructions must be less than 5000 characters')
    .trim(),
  
  body('prepTime')
    .optional()
    .isInt({ min: 0, max: 1440 })
    .withMessage('Prep time must be between 0 and 1440 minutes'),
  
  body('cookTime')
    .optional()
    .isInt({ min: 0, max: 1440 })
    .withMessage('Cook time must be between 0 and 1440 minutes'),
  
  body('servings')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Servings must be between 1 and 20'),
  
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  
  body('estimatedCost')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Estimated cost must be between 0 and 1000'),
  
  body('calories')
    .optional()
    .isInt({ min: 0, max: 5000 })
    .withMessage('Calories must be between 0 and 5000'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array'),
  
  body('categoryIds')
    .optional()
    .isArray()
    .withMessage('Category IDs must be an array'),
  
  handleValidationErrors
];

// Ingredient validation rules
export const validateIngredientCreation = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  
  body('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters')
    .trim(),
  
  body('avgPrice')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Average price must be between 0 and 1000'),
  
  body('unit')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Unit must be less than 20 characters')
    .trim(),
  
  handleValidationErrors
];

// Category validation rules
export const validateCategoryCreation = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
    .trim(),
  
  body('type')
    .isIn(['health', 'budget', 'occasion', 'cuisine', 'diet'])
    .withMessage('Type must be one of: health, budget, occasion, cuisine, diet'),
  
  handleValidationErrors
];

// Parameter validation
export const validateRecipeId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Recipe ID must be a positive integer'),
  
  handleValidationErrors
];

export const validateUserId = [
  param('userId')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  handleValidationErrors
];

// Query parameter validation for recipes
export const validateRecipeQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('maxCookTime')
    .optional()
    .isInt({ min: 0, max: 1440 })
    .withMessage('Max cook time must be between 0 and 1440 minutes'),
  
  query('maxCost')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Max cost must be between 0 and 1000'),
  
  query('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'title', 'cookTime', 'estimatedCost', 'calories'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  handleValidationErrors
];
