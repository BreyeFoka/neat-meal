import { db } from '../config/database.js';
import { ingredients } from '../models/schema.js';
import { eq, like, sql } from 'drizzle-orm';

export const ingredientController = {
  // Get all ingredients
  async getAllIngredients(req, res) {
    try {
      const { search, category, page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;

      let query = db.select().from(ingredients);

      const conditions = [];
      if (search) {
        conditions.push(like(ingredients.name, `%${search}%`));
      }
      if (category) {
        conditions.push(eq(ingredients.category, category));
      }

      if (conditions.length > 0) {
        // Use proper Drizzle ORM syntax for multiple conditions
        const combinedConditions = conditions.length === 1 
          ? conditions[0] 
          : sql`${conditions.map(c => c).join(' AND ')}`;
        query = query.where(combinedConditions);
      }

      const result = await query
        .limit(parseInt(limit))
        .offset(offset)
        .orderBy(ingredients.name);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get ingredients error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Create new ingredient
  async createIngredient(req, res) {
    try {
      const { name, category, avgPrice, unit } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Ingredient name is required'
        });
      }

      const newIngredient = await db.insert(ingredients).values({
        name: name.toLowerCase().trim(),
        category: category?.trim(),
        avgPrice,
        unit: unit?.trim()
      }).returning();

      res.status(201).json({
        success: true,
        data: newIngredient[0],
        message: 'Ingredient created successfully'
      });
    } catch (error) {
      console.error('Create ingredient error:', error);
      if (error.code === '23505') { // Unique constraint violation
        res.status(409).json({
          success: false,
          message: 'Ingredient already exists'
        });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  },

  // Get ingredient categories
  async getIngredientCategories(req, res) {
    try {
      const categories = await db.select({
        category: ingredients.category,
        count: sql`count(*)`
      })
        .from(ingredients)
        .where(sql`${ingredients.category} IS NOT NULL`)
        .groupBy(ingredients.category)
        .orderBy(ingredients.category);

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Get ingredient categories error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
