import { db } from '../config/database.js';
import { recipes, recipeIngredients, recipeCategories, ingredients, categories, userFavorites } from '../models/schema.js';
import { eq, and, or, like, inArray, sql, desc, asc } from 'drizzle-orm';

export const recipeController = {
  // Get all recipes with filtering and pagination
  async getAllRecipes(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        category, 
        isHealthy, 
        isCheap, 
        isQuick,
        difficulty,
        maxCookTime,
        maxCost,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const offset = (page - 1) * limit;
      let query = db.select().from(recipes);

      // Apply filters
      const conditions = [];
      
      if (isHealthy === 'true') conditions.push(eq(recipes.isHealthy, true));
      if (isCheap === 'true') conditions.push(eq(recipes.isCheap, true));
      if (isQuick === 'true') conditions.push(eq(recipes.isQuick, true));
      if (difficulty) conditions.push(eq(recipes.difficulty, difficulty));
      if (maxCookTime) conditions.push(sql`${recipes.cookTime} <= ${maxCookTime}`);
      if (maxCost) conditions.push(sql`${recipes.estimatedCost} <= ${maxCost}`);
      if (search) conditions.push(
        or(
          like(recipes.title, `%${search}%`),
          like(recipes.description, `%${search}%`)
        )
      );

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      // Apply sorting
      const orderColumn = recipes[sortBy] || recipes.createdAt;
      query = query.orderBy(sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn));

      // Apply pagination
      query = query.limit(parseInt(limit)).offset(offset);

      const result = await query;

      // Get total count for pagination
      let countQuery = db.select({ count: sql`count(*)` }).from(recipes);
      if (conditions.length > 0) {
        countQuery = countQuery.where(and(...conditions));
      }
      const totalCount = await countQuery;

      res.json({
        success: true,
        data: result,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(totalCount[0].count),
          pages: Math.ceil(totalCount[0].count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get single recipe with ingredients
  async getRecipeById(req, res) {
    try {
      const { id } = req.params;

      // Get recipe
      const recipe = await db.select()
        .from(recipes)
        .where(eq(recipes.id, parseInt(id)))
        .limit(1);

      if (recipe.length === 0) {
        return res.status(404).json({ success: false, message: 'Recipe not found' });
      }

      // Get ingredients for this recipe
      const recipeIngredientsData = await db.select({
        id: ingredients.id,
        name: ingredients.name,
        category: ingredients.category,
        quantity: recipeIngredients.quantity,
        unit: recipeIngredients.unit
      })
        .from(recipeIngredients)
        .innerJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))
        .where(eq(recipeIngredients.recipeId, parseInt(id)));

      // Get categories for this recipe
      const recipeCategoriesData = await db.select({
        id: categories.id,
        name: categories.name,
        type: categories.type
      })
        .from(recipeCategories)
        .innerJoin(categories, eq(recipeCategories.categoryId, categories.id))
        .where(eq(recipeCategories.recipeId, parseInt(id)));

      res.json({
        success: true,
        data: {
          ...recipe[0],
          ingredients: recipeIngredientsData,
          categories: recipeCategoriesData
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Create new recipe
  async createRecipe(req, res) {
    try {
      const {
        title,
        description,
        instructions,
        prepTime,
        cookTime,
        servings,
        difficulty,
        estimatedCost,
        calories,
        protein,
        carbs,
        fat,
        imageUrl,
        ingredients: recipeIngredientsList,
        categoryIds
      } = req.body;

      // Validate required fields
      if (!title || !instructions) {
        return res.status(400).json({ 
          success: false, 
          message: 'Title and instructions are required' 
        });
      }

      // Calculate derived fields
      const totalTime = (prepTime || 0) + (cookTime || 0);
      const isQuick = totalTime <= 30;
      const isCheap = estimatedCost <= 10; // Consider under $10 as cheap
      const isHealthy = calories < 500 && fat < 15; // Simple health criteria

      // Create recipe
      const newRecipe = await db.insert(recipes).values({
        title,
        description,
        instructions,
        prepTime,
        cookTime,
        servings,
        difficulty,
        estimatedCost,
        calories,
        protein,
        carbs,
        fat,
        imageUrl,
        isHealthy,
        isCheap,
        isQuick
      }).returning();

      const recipeId = newRecipe[0].id;

      // Add ingredients if provided
      if (recipeIngredientsList && recipeIngredientsList.length > 0) {
        const ingredientValues = recipeIngredientsList.map(ing => ({
          recipeId,
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unit: ing.unit
        }));
        await db.insert(recipeIngredients).values(ingredientValues);
      }

      // Add categories if provided
      if (categoryIds && categoryIds.length > 0) {
        const categoryValues = categoryIds.map(catId => ({
          recipeId,
          categoryId: catId
        }));
        await db.insert(recipeCategories).values(categoryValues);
      }

      res.status(201).json({
        success: true,
        data: newRecipe[0],
        message: 'Recipe created successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Update recipe
  async updateRecipe(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove ingredients and categories from update data as they need special handling
      const { ingredients: newIngredients, categoryIds, ...recipeData } = updateData;

      // Update recipe
      const updatedRecipe = await db.update(recipes)
        .set({ ...recipeData, updatedAt: sql`now()` })
        .where(eq(recipes.id, parseInt(id)))
        .returning();

      if (updatedRecipe.length === 0) {
        return res.status(404).json({ success: false, message: 'Recipe not found' });
      }

      res.json({
        success: true,
        data: updatedRecipe[0],
        message: 'Recipe updated successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Delete recipe
  async deleteRecipe(req, res) {
    try {
      const { id } = req.params;

      const deletedRecipe = await db.delete(recipes)
        .where(eq(recipes.id, parseInt(id)))
        .returning();

      if (deletedRecipe.length === 0) {
        return res.status(404).json({ success: false, message: 'Recipe not found' });
      }

      res.json({
        success: true,
        message: 'Recipe deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get recipes by category
  async getRecipesByCategory(req, res) {
    try {
      const { categoryType, categoryName } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      let query = db.select({
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
        prepTime: recipes.prepTime,
        cookTime: recipes.cookTime,
        servings: recipes.servings,
        difficulty: recipes.difficulty,
        estimatedCost: recipes.estimatedCost,
        calories: recipes.calories,
        imageUrl: recipes.imageUrl,
        isHealthy: recipes.isHealthy,
        isCheap: recipes.isCheap,
        isQuick: recipes.isQuick
      })
      .from(recipes)
      .innerJoin(recipeCategories, eq(recipes.id, recipeCategories.recipeId))
      .innerJoin(categories, eq(recipeCategories.categoryId, categories.id));

      if (categoryType && categoryName) {
        query = query.where(
          and(
            eq(categories.type, categoryType),
            eq(categories.name, categoryName)
          )
        );
      } else if (categoryType) {
        query = query.where(eq(categories.type, categoryType));
      }

      const result = await query
        .limit(parseInt(limit))
        .offset(offset)
        .orderBy(desc(recipes.createdAt));

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
