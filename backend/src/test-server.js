import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NeatMeal Backend Test Mode 🧪',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    note: 'This is a test mode without database connection'
  });
});

// Mock endpoints
app.get('/api/recipes', (req, res) => {
  res.json({
    success: true,
    message: 'Database connection required',
    note: 'Please set up DATABASE_URL in .env file and run the full server'
  });
});

app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: {
      health: ['Low Calorie', 'High Protein', 'Vegetarian'],
      budget: ['Under $5', 'Under $10'],
      occasion: ['Breakfast', 'Lunch', 'Dinner']
    }
  });
});

app.listen(PORT, () => {
  console.log(`
🧪 NeatMeal Test Server Running!
📍 Port: ${PORT}
🌐 Health Check: http://localhost:${PORT}/api/health

⚠️  Database connection not configured
📋 Setup instructions: See SETUP.md

To run full server:
1. Set up DATABASE_URL in .env
2. Run: npm run dev
  `);
});
