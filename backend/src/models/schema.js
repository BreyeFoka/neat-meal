import { pgTable, serial, varchar, text, integer, boolean, timestamp, decimal, json } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  dietaryRestrictions: json('dietary_restrictions'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 20 }).notNull(), // 'health', 'budget', 'occasion', 'cuisine'
  createdAt: timestamp('created_at').defaultNow()
});

// Recipes table
export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  instructions: text('instructions').notNull(),
  prepTime: integer('prep_time'), // in minutes
  cookTime: integer('cook_time'), // in minutes
  servings: integer('servings').default(1),
  difficulty: varchar('difficulty', { length: 20 }).default('easy'), // easy, medium, hard
  estimatedCost: decimal('estimated_cost', { precision: 5, scale: 2 }), // estimated cost in dollars
  calories: integer('calories'),
  protein: decimal('protein', { precision: 5, scale: 2 }),
  carbs: decimal('carbs', { precision: 5, scale: 2 }),
  fat: decimal('fat', { precision: 5, scale: 2 }),
  imageUrl: varchar('image_url', { length: 500 }),
  isHealthy: boolean('is_healthy').default(false),
  isCheap: boolean('is_cheap').default(false),
  isQuick: boolean('is_quick').default(false), // under 30 minutes
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Ingredients table
export const ingredients = pgTable('ingredients', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  category: varchar('category', { length: 50 }), // vegetable, protein, grain, etc.
  avgPrice: decimal('avg_price', { precision: 5, scale: 2 }), // price per unit
  unit: varchar('unit', { length: 20 }), // kg, g, ml, piece, etc.
  createdAt: timestamp('created_at').defaultNow()
});

// Recipe Ingredients junction table
export const recipeIngredients = pgTable('recipe_ingredients', {
  id: serial('id').primaryKey(),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  ingredientId: integer('ingredient_id').references(() => ingredients.id, { onDelete: 'cascade' }),
  quantity: decimal('quantity', { precision: 5, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 20 }).notNull()
});

// Recipe Categories junction table
export const recipeCategories = pgTable('recipe_categories', {
  id: serial('id').primaryKey(),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'cascade' })
});

// User Favorites
export const userFavorites = pgTable('user_favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow()
});

// Shopping Lists
export const shoppingLists = pgTable('shopping_lists', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  items: json('items'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Recipe Reviews
export const recipeReviews = pgTable('recipe_reviews', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5 stars
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow()
});
