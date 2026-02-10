# Todo API Backend

FastAPI-based REST API for task management with JWT authentication and PostgreSQL database.

## Features

- ✅ User registration and authentication with JWT tokens
- ✅ Secure password hashing with bcrypt
- ✅ Complete CRUD operations for tasks
- ✅ User isolation (users can only access their own tasks)
- ✅ RESTful API design
- ✅ OpenAPI/Swagger documentation
- ✅ Database migrations with Alembic
- ✅ Neon Serverless PostgreSQL support

## Tech Stack

- **Framework**: FastAPI 0.109+
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: SQLModel 0.0.14+
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt via passlib
- **Migrations**: Alembic
- **Server**: Uvicorn

## Project Structure

```
backend/
├── src/
│   ├── api/                    # API endpoints
│   │   ├── auth.py            # Authentication endpoints
│   │   └── tasks.py           # Task management endpoints
│   ├── models/                 # SQLModel database models
│   │   ├── user.py            # User model
│   │   └── task.py            # Task model
│   ├── schemas/                # Pydantic request/response schemas
│   │   ├── auth_schemas.py    # Auth schemas
│   │   └── task_schemas.py    # Task schemas
│   ├── services/               # Business logic layer
│   │   ├── user_service.py    # User operations
│   │   └── task_service.py    # Task operations
│   ├── middleware/             # Custom middleware
│   │   └── auth.py            # JWT verification
│   ├── utils/                  # Utility functions
│   │   └── security.py        # Password & JWT utilities
│   ├── config.py              # Configuration management
│   ├── database.py            # Database connection
│   └── main.py                # FastAPI application
├── alembic/                    # Database migrations
│   ├── versions/              # Migration files
│   └── env.py                 # Alembic environment
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Setup Instructions

### 1. Prerequisites

- Python 3.11+
- PostgreSQL database (Neon Serverless recommended)
- pip or uv package manager

### 2. Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database_name

# Authentication - Shared secret with frontend (minimum 32 characters)
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars-long

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Environment
ENVIRONMENT=development
```

### 4. Run Database Migrations

```bash
# Generate initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 5. Start the Server

```bash
# Development mode with auto-reload
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Or use the provided script
# Windows:
start_server.bat
# macOS/Linux:
./start_server.sh
```

The API will be available at:
- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/signin` | Sign in and get JWT token | No |
| GET | `/api/auth/me` | Get current user info | Yes |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/{user_id}/tasks` | List all user's tasks | Yes |
| POST | `/api/{user_id}/tasks` | Create new task | Yes |
| GET | `/api/{user_id}/tasks/{id}` | Get task details | Yes |
| PUT | `/api/{user_id}/tasks/{id}` | Update task | Yes |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task | Yes |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion | Yes |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | API health status | No |

## Authentication Flow

1. **Register**: POST to `/api/auth/signup` with email and password
2. **Sign In**: POST to `/api/auth/signin` to receive JWT token
3. **Use Token**: Include token in Authorization header: `Authorization: Bearer <token>`
4. **Access Protected Routes**: All task endpoints require valid JWT token

## Example Usage

### Register a New User

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Sign In

```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Create a Task

```bash
curl -X POST http://localhost:8000/api/{user_id}/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "title": "Complete project",
    "description": "Finish the backend implementation"
  }'
```

### List Tasks

```bash
curl -X GET http://localhost:8000/api/{user_id}/tasks \
  -H "Authorization: Bearer <your_token>"
```

## Security Features

- ✅ Password hashing with bcrypt (cost factor 12)
- ✅ JWT token-based authentication
- ✅ Token expiration (60 minutes default)
- ✅ User isolation (users can only access their own data)
- ✅ CORS protection
- ✅ SQL injection prevention (SQLModel ORM)
- ✅ Input validation with Pydantic

## Database Migrations

### Create a New Migration

```bash
alembic revision --autogenerate -m "description of changes"
```

### Apply Migrations

```bash
alembic upgrade head
```

### Rollback Migration

```bash
alembic downgrade -1
```

### View Migration History

```bash
alembic history
```

## Development

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src
```

### Code Quality

```bash
# Format code
black src/

# Lint code
ruff check src/
```

## Deployment

### Environment Variables for Production

```bash
ENVIRONMENT=production
DATABASE_URL=<production_database_url>
BETTER_AUTH_SECRET=<strong_secret_key>
CORS_ORIGINS=https://yourdomain.com
```

### Running in Production

```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Troubleshooting

### Database Connection Issues

- Verify DATABASE_URL is correct
- Check if database is accessible
- Ensure migrations are applied: `alembic upgrade head`

### Authentication Issues

- Verify BETTER_AUTH_SECRET matches between frontend and backend
- Check token expiration time
- Ensure Authorization header format: `Bearer <token>`

### CORS Issues

- Add frontend URL to CORS_ORIGINS in .env
- Restart server after changing CORS settings

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.

