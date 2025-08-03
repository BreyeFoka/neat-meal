import { db } from '../config/database.js';
import { categories } from '../models/schema.js';
import { eq } from 'drizzle-orm';

export const categoryController = {
  // Get all categories
  async getAllCategories(req, res) {
    try {
      const { type } = req.query;
      
      let query = db.select().from(categories);
      
      if (type) {
        query = query.where(eq(categories.type, type));
      }
      
      const result = await query.orderBy(categories.type, categories.name);

      // Group by type for easier frontend consumption
      const groupedCategories = result.reduce((acc, category) => {
        if (!acc[category.type]) {
          acc[category.type] = [];
        }
        acc[category.type].push(category);
        return acc;
      }, {});

      res.json({
        success: true,
        data: type ? result : groupedCategories
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Create new category
  async createCategory(req, res) {
    try {
      const { name, description, type } = req.body;

      if (!name || !type) {
        return res.status(400).json({
          success: false,
          message: 'Name and type are required'
        });
      }

      const validTypes = ['health', 'budget', 'occasion', 'cuisine', 'diet'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Type must be one of: ${validTypes.join(', ')}`
        });
      }

      const newCategory = await db.insert(categories).values({
        name,
        description,
        type
      }).returning();

      res.status(201).json({
        success: true,
        data: newCategory[0],
        message: 'Category created successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
