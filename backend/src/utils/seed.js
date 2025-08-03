import { db } from '../config/database.js';
import { categories, ingredients, recipes, recipeIngredients, recipeCategories } from '../models/schema.js';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (optional, remove in production)
    await db.delete(recipeCategories);
    await db.delete(recipeIngredients);
    await db.delete(recipes);
    await db.delete(ingredients);
    await db.delete(categories);

    // Seed Categories
    const categoryData = [
      // Health categories
      { name: 'Low Calorie', type: 'health', description: 'Under 400 calories per serving' },
      { name: 'High Protein', type: 'health', description: 'Over 20g protein per serving' },
      { name: 'Low Carb', type: 'health', description: 'Under 20g carbs per serving' },
      { name: 'Vegetarian', type: 'health', description: 'No meat or fish' },
      { name: 'Vegan', type: 'health', description: 'No animal products' },

      // Budget categories
      { name: 'Under $5', type: 'budget', description: 'Meals under $5 per serving' },
      { name: 'Under $10', type: 'budget', description: 'Meals under $10 per serving' },
      { name: 'Budget Bulk', type: 'budget', description: 'Great for meal prep' },

      // Occasion categories
      { name: 'Breakfast', type: 'occasion', description: 'Morning meals' },
      { name: 'Lunch', type: 'occasion', description: 'Midday meals' },
      { name: 'Dinner', type: 'occasion', description: 'Evening meals' },
      { name: 'Snack', type: 'occasion', description: 'Quick bites' },
      { name: 'Study Fuel', type: 'occasion', description: 'Brain food for studying' },

      // Cuisine categories
      { name: 'Italian', type: 'cuisine', description: 'Italian cuisine' },
      { name: 'Asian', type: 'cuisine', description: 'Asian cuisine' },
      { name: 'Mexican', type: 'cuisine', description: 'Mexican cuisine' },
      { name: 'Mediterranean', type: 'cuisine', description: 'Mediterranean cuisine' }
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Seed Ingredients
    const ingredientData = [
      // Proteins
      { name: 'eggs', category: 'protein', avgPrice: 3.50, unit: 'dozen' },
      { name: 'chicken breast', category: 'protein', avgPrice: 5.99, unit: 'lb' },
      { name: 'ground turkey', category: 'protein', avgPrice: 4.99, unit: 'lb' },
      { name: 'black beans', category: 'protein', avgPrice: 1.29, unit: 'can' },
      { name: 'tofu', category: 'protein', avgPrice: 2.99, unit: 'block' },
      { name: 'greek yogurt', category: 'protein', avgPrice: 4.99, unit: 'container' },

      // Grains
      { name: 'brown rice', category: 'grain', avgPrice: 2.99, unit: 'lb' },
      { name: 'quinoa', category: 'grain', avgPrice: 4.99, unit: 'lb' },
      { name: 'oats', category: 'grain', avgPrice: 3.49, unit: 'container' },
      { name: 'whole wheat pasta', category: 'grain', avgPrice: 1.99, unit: 'box' },
      { name: 'bread', category: 'grain', avgPrice: 2.49, unit: 'loaf' },

      // Vegetables
      { name: 'spinach', category: 'vegetable', avgPrice: 2.99, unit: 'bag' },
      { name: 'broccoli', category: 'vegetable', avgPrice: 1.99, unit: 'head' },
      { name: 'bell peppers', category: 'vegetable', avgPrice: 1.49, unit: 'each' },
      { name: 'onions', category: 'vegetable', avgPrice: 1.99, unit: 'lb' },
      { name: 'garlic', category: 'vegetable', avgPrice: 0.99, unit: 'head' },
      { name: 'tomatoes', category: 'vegetable', avgPrice: 2.99, unit: 'lb' },
      { name: 'carrots', category: 'vegetable', avgPrice: 1.49, unit: 'lb' },
      { name: 'sweet potato', category: 'vegetable', avgPrice: 1.99, unit: 'lb' },

      // Fruits
      { name: 'bananas', category: 'fruit', avgPrice: 1.29, unit: 'lb' },
      { name: 'apples', category: 'fruit', avgPrice: 1.99, unit: 'lb' },
      { name: 'berries', category: 'fruit', avgPrice: 3.99, unit: 'container' },

      // Pantry staples
      { name: 'olive oil', category: 'pantry', avgPrice: 4.99, unit: 'bottle' },
      { name: 'salt', category: 'pantry', avgPrice: 0.99, unit: 'container' },
      { name: 'black pepper', category: 'pantry', avgPrice: 2.99, unit: 'container' },
      { name: 'canned tomatoes', category: 'pantry', avgPrice: 1.29, unit: 'can' },
      { name: 'coconut milk', category: 'pantry', avgPrice: 1.99, unit: 'can' },
      { name: 'soy sauce', category: 'pantry', avgPrice: 2.49, unit: 'bottle' }
    ];

    const insertedIngredients = await db.insert(ingredients).values(ingredientData).returning();
    console.log(`✅ Inserted ${insertedIngredients.length} ingredients`);

    // Seed Sample Recipes
    const recipeData = [
      {
        title: 'Student\'s Perfect Scrambled Eggs',
        description: 'Quick, cheap, and protein-packed breakfast that anyone can make in their dorm or apartment.',
        instructions: 'Heat a non-stick pan over medium-low heat. Crack 2-3 eggs into a bowl, add a splash of milk, salt and pepper. Whisk well. Add butter to the pan, then pour in eggs. Gently stir with a spatula, pushing eggs from edges to center. Remove from heat while still slightly wet - they\'ll finish cooking. Serve immediately.',
        prepTime: 2,
        cookTime: 5,
        servings: 1,
        difficulty: 'easy',
        estimatedCost: 1.50,
        calories: 280,
        protein: 18,
        carbs: 2,
        fat: 22,
        isHealthy: true,
        isCheap: true,
        isQuick: true
      },
      {
        title: 'Budget-Friendly Pasta with Marinara',
        description: 'Classic pasta dish that costs under $2 per serving and feeds you well.',
        instructions: 'Boil water in a large pot with salt. Cook pasta according to package directions. In another pan, heat olive oil and sauté minced garlic for 30 seconds. Add canned tomatoes, salt, pepper, and a pinch of sugar. Simmer for 10 minutes. Drain pasta and mix with sauce. Top with herbs if available.',
        prepTime: 5,
        cookTime: 20,
        servings: 4,
        difficulty: 'easy',
        estimatedCost: 6.00,
        calories: 350,
        protein: 12,
        carbs: 65,
        fat: 8,
        isHealthy: false,
        isCheap: true,
        isQuick: false
      },
      {
        title: 'Protein-Packed Study Bowl',
        description: 'Perfect brain food with quinoa, vegetables, and protein to fuel long study sessions.',
        instructions: 'Cook quinoa according to package directions. While it cooks, sauté diced bell peppers and onions until soft. Steam broccoli until tender. Season chicken breast with salt and pepper, cook in a pan until done (165°F internal temp). Slice chicken. Combine quinoa, vegetables, and chicken in a bowl. Drizzle with olive oil and season to taste.',
        prepTime: 10,
        cookTime: 25,
        servings: 2,
        difficulty: 'medium',
        estimatedCost: 8.50,
        calories: 420,
        protein: 35,
        carbs: 45,
        fat: 12,
        isHealthy: true,
        isCheap: false,
        isQuick: false
      },
      {
        title: 'Overnight Oats - Meal Prep Champion',
        description: 'Make 5 breakfasts at once! Perfect for busy students who need grab-and-go nutrition.',
        instructions: 'In a mason jar or container, combine 1/2 cup oats, 1/2 cup milk of choice, 1 tbsp Greek yogurt, 1 tsp honey, and pinch of salt. Add fruits and mix well. Refrigerate overnight or up to 5 days. In the morning, stir and enjoy cold or warm up for 30 seconds in microwave.',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        difficulty: 'easy',
        estimatedCost: 1.25,
        calories: 320,
        protein: 15,
        carbs: 45,
        fat: 8,
        isHealthy: true,
        isCheap: true,
        isQuick: true
      },
      {
        title: 'Simple Black Bean Quesadillas',
        description: 'Vegetarian, filling, and so easy even the worst cook can master this.',
        instructions: 'Mash half a can of black beans with fork. Season with salt, pepper, and any spices you have. Spread beans on half of a tortilla, add cheese if you have it. Fold tortilla in half. Cook in a dry pan for 2-3 minutes per side until crispy and heated through. Cut into wedges and serve with salsa or hot sauce.',
        prepTime: 5,
        cookTime: 6,
        servings: 1,
        difficulty: 'easy',
        estimatedCost: 2.00,
        calories: 380,
        protein: 16,
        carbs: 58,
        fat: 8,
        isHealthy: true,
        isCheap: true,
        isQuick: true
      }
    ];

    const insertedRecipes = await db.insert(recipes).values(recipeData).returning();
    console.log(`✅ Inserted ${insertedRecipes.length} recipes`);

    // Create ingredient mappings for recipes (simplified)
    const recipeIngredientMappings = [
      // Scrambled Eggs
      { recipeId: insertedRecipes[0].id, ingredientName: 'eggs', quantity: 2, unit: 'pieces' },
      { recipeId: insertedRecipes[0].id, ingredientName: 'salt', quantity: 0.5, unit: 'tsp' },
      { recipeId: insertedRecipes[0].id, ingredientName: 'black pepper', quantity: 0.25, unit: 'tsp' },

      // Pasta
      { recipeId: insertedRecipes[1].id, ingredientName: 'whole wheat pasta', quantity: 1, unit: 'box' },
      { recipeId: insertedRecipes[1].id, ingredientName: 'canned tomatoes', quantity: 1, unit: 'can' },
      { recipeId: insertedRecipes[1].id, ingredientName: 'garlic', quantity: 2, unit: 'cloves' },
      { recipeId: insertedRecipes[1].id, ingredientName: 'olive oil', quantity: 2, unit: 'tbsp' },

      // Study Bowl
      { recipeId: insertedRecipes[2].id, ingredientName: 'quinoa', quantity: 1, unit: 'cup' },
      { recipeId: insertedRecipes[2].id, ingredientName: 'chicken breast', quantity: 8, unit: 'oz' },
      { recipeId: insertedRecipes[2].id, ingredientName: 'bell peppers', quantity: 1, unit: 'piece' },
      { recipeId: insertedRecipes[2].id, ingredientName: 'broccoli', quantity: 1, unit: 'head' },
      { recipeId: insertedRecipes[2].id, ingredientName: 'onions', quantity: 0.5, unit: 'piece' },

      // Overnight Oats
      { recipeId: insertedRecipes[3].id, ingredientName: 'oats', quantity: 0.5, unit: 'cup' },
      { recipeId: insertedRecipes[3].id, ingredientName: 'greek yogurt', quantity: 1, unit: 'tbsp' },
      { recipeId: insertedRecipes[3].id, ingredientName: 'berries', quantity: 0.25, unit: 'cup' },

      // Black Bean Quesadillas
      { recipeId: insertedRecipes[4].id, ingredientName: 'black beans', quantity: 0.5, unit: 'can' },
      { recipeId: insertedRecipes[4].id, ingredientName: 'salt', quantity: 0.25, unit: 'tsp' },
      { recipeId: insertedRecipes[4].id, ingredientName: 'black pepper', quantity: 0.125, unit: 'tsp' }
    ];

    // Insert recipe ingredients
    for (const mapping of recipeIngredientMappings) {
      const ingredient = insertedIngredients.find(ing => ing.name === mapping.ingredientName);
      if (ingredient) {
        await db.insert(recipeIngredients).values({
          recipeId: mapping.recipeId,
          ingredientId: ingredient.id,
          quantity: mapping.quantity,
          unit: mapping.unit
        });
      }
    }

    // Add category associations
    const recipeCategoryMappings = [
      // Scrambled Eggs - breakfast, cheap, quick, high protein
      { recipeId: insertedRecipes[0].id, categoryNames: ['Breakfast', 'Under $5', 'High Protein'] },
      // Pasta - dinner, cheap
      { recipeId: insertedRecipes[1].id, categoryNames: ['Dinner', 'Under $5', 'Budget Bulk', 'Italian'] },
      // Study Bowl - lunch, high protein, healthy
      { recipeId: insertedRecipes[2].id, categoryNames: ['Lunch', 'Study Fuel', 'High Protein', 'Under $10'] },
      // Overnight Oats - breakfast, cheap, healthy
      { recipeId: insertedRecipes[3].id, categoryNames: ['Breakfast', 'Under $5', 'Budget Bulk'] },
      // Quesadillas - lunch, cheap, vegetarian
      { recipeId: insertedRecipes[4].id, categoryNames: ['Lunch', 'Under $5', 'Vegetarian', 'Mexican'] }
    ];

    for (const mapping of recipeCategoryMappings) {
      for (const categoryName of mapping.categoryNames) {
        const category = insertedCategories.find(cat => cat.name === categoryName);
        if (category) {
          await db.insert(recipeCategories).values({
            recipeId: mapping.recipeId,
            categoryId: category.id
          });
        }
      }
    }

    console.log('🌱 Database seeding completed successfully!');
    console.log(`
📊 Summary:
- ${insertedCategories.length} categories
- ${insertedIngredients.length} ingredients  
- ${insertedRecipes.length} recipes
- Recipe ingredients and categories linked

🚀 Your backend is ready! Try these endpoints:
- GET /api/recipes - All recipes with filtering
- GET /api/recipes/category/budget/Under%20$5 - Cheap recipes
- GET /api/recipes/category/health/High%20Protein - High protein recipes
- GET /api/categories - All categories grouped by type
- GET /api/ingredients - All ingredients
    `);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}
