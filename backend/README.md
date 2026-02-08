---
title: Todo App Backend API
emoji: ✅
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# Todo App Backend API

A secure FastAPI backend for a full-stack todo application with user authentication, workspaces, and task management.

## Features

- 🔐 JWT-based authentication
- 👥 Multi-user support with user isolation
- 📁 Workspace and project management
- ✅ Task management with priorities and statuses
- 📊 Analytics and activity tracking
- 🗄️ PostgreSQL database with SQLModel ORM
- 🚀 FastAPI with automatic OpenAPI documentation

## API Documentation

Once deployed, visit:
- `/docs` - Interactive Swagger UI documentation
- `/redoc` - ReDoc documentation
- `/health` - Health check endpoint

## Environment Variables

Required environment variables (set in Hugging Face Spaces settings):

```bash
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
CORS_ORIGINS=https://your-frontend-url.com
ENVIRONMENT=production
```

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn src.main:app --reload --port 8000
```

## Deployment on Hugging Face Spaces

1. Create a new Space with Docker SDK
2. Upload all backend files
3. Set environment variables in Space settings
4. The Dockerfile will automatically build and deploy

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL (Neon)
- **ORM**: SQLModel
- **Authentication**: JWT with passlib
- **Validation**: Pydantic
- **CORS**: Enabled for frontend integration
