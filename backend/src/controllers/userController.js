import { db } from '../config/database.js';
import { users, userFavorites, recipes } from '../models/schema.js';
import { eq, and, sql } from 'drizzle-orm';

export const userController = {
  // Get user profile (public info only)
  async getUserProfile(req, res) {
    try {
      const { id } = req.params;

      const user = await db.select({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt
      })
        .from(users)
        .where(eq(users.id, parseInt(id)))
        .limit(1);

      if (user.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({
        success: true,
        data: user[0]
      });
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get user favorites
  async getUserFavorites(req, res) {
    try {
      const { userId } = req.params;
      const requestingUserId = req.user?.id;

      // Users can only see their own favorites unless explicitly shared
      if (requestingUserId !== parseInt(userId)) {
        return res.status(403).json({
          success: false,
          message: 'You can only view your own favorites'
        });
      }

      const favorites = await db.select({
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
        prepTime: recipes.prepTime,
        cookTime: recipes.cookTime,
        difficulty: recipes.difficulty,
        estimatedCost: recipes.estimatedCost,
        imageUrl: recipes.imageUrl,
        isHealthy: recipes.isHealthy,
        isCheap: recipes.isCheap,
        isQuick: recipes.isQuick,
        calories: recipes.calories,
        favoriteId: userFavorites.id,
        favoritedAt: userFavorites.createdAt
      })
        .from(userFavorites)
        .innerJoin(recipes, eq(userFavorites.recipeId, recipes.id))
        .where(eq(userFavorites.userId, parseInt(userId)))
        .orderBy(sql`${userFavorites.createdAt} DESC`);

      res.json({
        success: true,
        data: favorites
      });
    } catch (error) {
      console.error('Get user favorites error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Add recipe to favorites
  async addToFavorites(req, res) {
    try {
      const { recipeId } = req.body;
      const userId = req.user.id;

      if (!recipeId) {
        return res.status(400).json({
          success: false,
          message: 'Recipe ID is required'
        });
      }

      // Check if recipe exists
      const recipeExists = await db.select({ id: recipes.id })
        .from(recipes)
        .where(eq(recipes.id, parseInt(recipeId)))
        .limit(1);

      if (recipeExists.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        });
      }

      // Check if already favorited
      const existing = await db.select()
        .from(userFavorites)
        .where(and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.recipeId, parseInt(recipeId))
        ))
        .limit(1);

      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Recipe already in favorites'
        });
      }

      const newFavorite = await db.insert(userFavorites).values({
        userId,
        recipeId: parseInt(recipeId)
      }).returning();

      res.status(201).json({
        success: true,
        data: newFavorite[0],
        message: 'Recipe added to favorites'
      });
    } catch (error) {
      console.error('Add to favorites error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Remove from favorites
  async removeFromFavorites(req, res) {
    try {
      const { recipeId } = req.params;
      const userId = req.user.id;

      const deleted = await db.delete(userFavorites)
        .where(and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.recipeId, parseInt(recipeId))
        ))
        .returning();

      if (deleted.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Favorite not found'
        });
      }

      res.json({
        success: true,
        message: 'Recipe removed from favorites'
      });
    } catch (error) {
      console.error('Remove from favorites error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get user's recipe statistics
  async getUserStats(req, res) {
    try {
      const { userId } = req.params;
      const requestingUserId = req.user?.id;

      // Users can only see their own stats
      if (requestingUserId !== parseInt(userId)) {
        return res.status(403).json({
          success: false,
          message: 'You can only view your own statistics'
        });
      }

      // Get favorite count
      const favoriteCount = await db.select({
        count: sql`count(*)`
      })
        .from(userFavorites)
        .where(eq(userFavorites.userId, parseInt(userId)));

      res.json({
        success: true,
        data: {
          totalFavorites: parseInt(favoriteCount[0].count)
        }
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
