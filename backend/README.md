# NeatMeal Backend 🍳

A comprehensive REST API backend for a student-focused recipe finding app. Designed to help students find affordable, healthy, and easy-to-make recipes.

## 🚀 Features

### Core Functionality
- **Recipe Management**: Full CRUD operations for recipes
- **Smart Categorization**: Recipes organized by health, budget, occasions, and cuisine
- **Advanced Filtering**: Filter by cost, cooking time, difficulty, nutrition, and more
- **User System**: Favorites, reviews, and personalized recommendations
- **Ingredient Database**: Comprehensive ingredient catalog with pricing
- **Nutritional Info**: Calorie and macro tracking for health-conscious students

### Student-Focused Features
- **Budget-Friendly**: Recipes categorized by cost (Under $5, Under $10)
- **Quick Meals**: Fast recipes for busy students (under 30 minutes)
- **Dorm-Friendly**: Simple recipes with minimal equipment
- **Meal Prep**: Bulk cooking options for efficient meal planning
- **Study Fuel**: Brain-boosting recipes for exam periods

## 📊 Database Schema

```
Users → Favorites → Recipes ← Recipe_Categories → Categories
                      ↑
              Recipe_Ingredients
                      ↓
               Ingredients
```

## 🛠️ Tech Stack

- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Neon (serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Deployment**: Optimized for serverless platforms

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (we recommend Neon for easy setup)

### Installation

1. **Clone and Setup**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database URL:
   ```env
   DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
   PORT=3000
   NODE_ENV=development
   ```

3. **Database Setup**
   ```bash
   npm run seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:3000`

## 📱 API Endpoints

### Health Check
```http
GET /api/health
```

### Recipes
```http
GET /api/recipes                          # All recipes with filtering
GET /api/recipes?isCheap=true            # Budget-friendly recipes
GET /api/recipes?isQuick=true            # Quick recipes (under 30min)
GET /api/recipes?difficulty=easy         # Easy recipes
GET /api/recipes?maxCost=5               # Under $5 recipes
GET /api/recipes/:id                     # Single recipe with ingredients
POST /api/recipes                        # Create new recipe
PUT /api/recipes/:id                     # Update recipe
DELETE /api/recipes/:id                  # Delete recipe
```

### Categories
```http
GET /api/categories                      # All categories grouped by type
GET /api/categories?type=budget          # Budget categories only
GET /api/recipes/category/budget/Under%20$5    # Recipes by category
POST /api/categories                     # Create new category
```

### Ingredients
```http
GET /api/ingredients                     # All ingredients
GET /api/ingredients?search=chicken      # Search ingredients
GET /api/ingredients/categories          # Ingredient categories
POST /api/ingredients                    # Add new ingredient
```

### Users & Favorites
```http
GET /api/users/:id                       # User profile
POST /api/users                          # Create user
GET /api/users/:userId/favorites         # User's favorite recipes
POST /api/users/favorites                # Add to favorites
DELETE /api/users/:userId/favorites/:recipeId  # Remove favorite
```

## 🎯 Sample Queries

### Find Budget Recipes for Students
```http
GET /api/recipes?isCheap=true&isQuick=true&difficulty=easy&limit=10
```

### Get Healthy High-Protein Recipes
```http
GET /api/recipes/category/health/High%20Protein?limit=5
```

### Search for Breakfast Recipes Under $3
```http
GET /api/recipes/category/occasion/Breakfast?maxCost=3
```

## 📋 Sample Data Included

The seed script includes:
- **5 Student-Friendly Recipes**: From scrambled eggs to study bowls
- **25+ Ingredients**: Common student pantry items with pricing
- **17 Categories**: Health, budget, occasion, and cuisine categories
- **Complete Relationships**: All recipes linked with ingredients and categories

## 🔧 Development

### Project Structure
```
src/
├── config/         # Database configuration
├── controllers/    # Route handlers and business logic
├── middleware/     # Express middleware
├── models/         # Database schema definitions
├── routes/         # API route definitions
├── utils/          # Utilities (seeding, helpers)
└── server.js       # Main application entry point
```

### Adding New Features
1. **New Models**: Add to `src/models/schema.js`
2. **New Controllers**: Create in `src/controllers/`
3. **New Routes**: Add to `src/routes/`
4. **Update Seed Data**: Modify `src/utils/seed.js`

## 🚀 Deployment Ready

This backend is optimized for:
- **Vercel**: Serverless functions
- **Railway**: Container deployment
- **Heroku**: Traditional hosting
- **Neon**: Serverless PostgreSQL

## 📱 Mobile Frontend Ready

Perfect foundation for:
- **React Native + Expo**: Native mobile apps
- **React Web**: Progressive web apps
- **Flutter**: Cross-platform development

## 🤝 Contributing

This is a student-focused project! Contributions welcome:
- More student-friendly recipes
- Better categorization
- Cost optimization features
- Nutrition tracking improvements

## 📄 License

ISC License - feel free to use for your own student projects!

---

**Built for students, by developers who understand the struggle of eating well on a budget! 🎓🍳**
