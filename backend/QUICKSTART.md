# Backend Quick Start Guide

Get your FastAPI backend up and running in 5 minutes!

## Prerequisites

- Python 3.11 or higher
- PostgreSQL database (Neon Serverless recommended)
- Git

## Step 1: Setup Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Step 2: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your actual values:

```env
DATABASE_URL=postgresql://username:password@host/database
BETTER_AUTH_SECRET=your-super-secret-key-at-least-32-characters-long
CORS_ORIGINS=http://localhost:3000
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=development
```

### Getting a Neon Database URL

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string
4. Paste it as your `DATABASE_URL`

## Step 3: Run Database Migrations

```bash
# Generate initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations to database
alembic upgrade head
```

You should see output confirming tables were created.

## Step 4: Start the Server

```bash
# Start with auto-reload (development)
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Or use the provided script:
# Windows:
start_server.bat
# macOS/Linux:
./start_server.sh
```

## Step 5: Test the API

Open your browser and visit:

- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### Test with cURL

```bash
# Health check
curl http://localhost:8000/health

# Register a user
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'

# Sign in
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

## Common Issues

### Issue: "ModuleNotFoundError"
**Solution**: Make sure you're in the virtual environment and dependencies are installed:
```bash
pip install -r requirements.txt
```

### Issue: "Database connection failed"
**Solution**: Check your DATABASE_URL in `.env` is correct and the database is accessible.

### Issue: "Alembic command not found"
**Solution**: Install alembic:
```bash
pip install alembic
```

### Issue: "CORS errors from frontend"
**Solution**: Add your frontend URL to CORS_ORIGINS in `.env`:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Next Steps

1. ✅ Backend is running
2. 📝 Check out the API docs at http://localhost:8000/docs
3. 🔐 Test authentication endpoints
4. 📋 Create some tasks via the API
5. 🚀 Connect your frontend application

## API Endpoints Overview

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in and get JWT token
- `GET /api/auth/me` - Get current user info

### Tasks (requires authentication)
- `GET /api/{user_id}/tasks` - List all tasks
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{id}` - Get task details
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion

## Development Tips

### Auto-reload on Changes
The `--reload` flag automatically restarts the server when you modify code.

### View Logs
All database queries are logged in development mode. Check your terminal for SQL statements.

### Interactive API Docs
Visit http://localhost:8000/docs to test endpoints directly in your browser with Swagger UI.

### Database Migrations
After modifying models, create and apply migrations:
```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the [API documentation](http://localhost:8000/docs) when server is running
- Check existing test files for usage examples

Happy coding! 🚀
