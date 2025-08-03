# NeatMeal Backend Setup Guide 🚀

## Quick Database Setup

### Option 1: Neon (Recommended - Free Serverless PostgreSQL)
1. Go to [Neon](https://neon.tech) and create a free account
2. Create a new project called "neat-meal"
3. Copy your connection string (looks like: `postgresql://username:password@hostname/database?sslmode=require`)
4. Paste it in your `.env` file as `DATABASE_URL`

### Option 2: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database called `neatmeal`
3. Update `.env` file with your local connection string

## Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Required Environment Variables:**
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - A secure random string (min 32 characters)
   
   Generate a secure JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Update your .env file:**
   ```env
   DATABASE_URL=your_neon_connection_string_here
   JWT_SECRET=your_generated_secure_secret_here
   PORT=5000
   NODE_ENV=development
   ```

## Running the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Seed the database:**
   ```bash
   npm run seed
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Testing the API

Once running, you can test endpoints at `http://localhost:5000`:

- `GET /api/health` - Health check
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/recipes` - Get recipes

## Sample API Calls

### Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student123",
    "email": "student@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Get budget recipes:
```bash
curl "http://localhost:5000/api/recipes?isCheap=true&limit=5"
```

## Security Features ✅

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ CORS protection
- ✅ Security headers

## Troubleshooting

### Database Connection Issues
- Check if DATABASE_URL is correct
- Ensure your database is accessible
- For Neon, make sure you're using the pooled connection string

### JWT Issues
- Ensure JWT_SECRET is set and at least 32 characters
- Check token format in Authorization header: `Bearer <token>`

### CORS Issues
- Update ALLOWED_ORIGINS in .env file
- For mobile development, include your expo dev server URL
