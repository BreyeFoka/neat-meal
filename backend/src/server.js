import express from 'express';
import 'dotenv/config';
import { setupMiddleware } from './middleware/index.js';
import { seedDatabase } from './utils/seed.js';

// Import routes
import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';
import ingredientRoutes from './routes/ingredients.js';
import categoryRoutes from './routes/categories.js';
import userRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file');
  process.exit(1);
}

// Setup middleware
setupMiddleware(app);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NeatMeal Backend is Operational! 🍳',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// Seed database endpoint (development only)
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/seed', async (req, res) => {
    try {
      await seedDatabase();
      res.json({
        success: true,
        message: 'Database seeded successfully! 🌱'
      });
    } catch (error) {
      console.error('Seeding error:', error);
      res.status(500).json({
        success: false,
        message: 'Seeding failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
      });
    }
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'GET /api/recipes',
      'GET /api/categories',
      'GET /api/ingredients',
      'GET /api/users/:id',
      ...(process.env.NODE_ENV !== 'production' ? ['POST /api/seed (development only)'] : [])
    ]
  });
});

app.listen(PORT, () => {
  console.log(`
🚀 NeatMeal Backend Server Started!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📚 API Docs: http://localhost:${PORT}/api/health

🍳 Student Recipe API Features:
• 🔐 Secure authentication with JWT
• 🛡️  Input validation and sanitization
• ⚡ Rate limiting and security headers
• 📊 Recipe management with filtering
• 🏷️  Category system (health, budget, occasions)
• 🥗 Ingredient database with pricing
• ❤️  User favorites system
• 💰 Cost estimation for students

🔒 Security Features:
• Password hashing with bcrypt
• JWT token authentication
• Rate limiting protection
• Input validation
• CORS protection
• Security headers (Helmet)
• SQL injection prevention

💡 Quick Start:
1. Set DATABASE_URL and JWT_SECRET in .env
${process.env.NODE_ENV !== 'production' ? '2. POST /api/seed to populate sample data' : ''}
3. POST /api/auth/register to create account
4. GET /api/recipes?isCheap=true for budget recipes
  `);
});
