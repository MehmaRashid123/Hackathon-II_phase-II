# Deployment Guide

## Hugging Face Spaces Deployment

### Prerequisites
- Hugging Face account
- PostgreSQL database (Neon recommended)
- Frontend deployed (Vercel/Netlify)

### Step 1: Create Hugging Face Space

1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Choose:
   - **Name**: `todo-app-backend` (or your choice)
   - **SDK**: Docker
   - **Visibility**: Public or Private

### Step 2: Upload Backend Files

Upload these files to your Space:
```
backend/
├── src/
├── Dockerfile
├── requirements.txt
├── README.md
└── .dockerignore
```

### Step 3: Configure Environment Variables

In Space Settings → Variables, add:

```bash
# Database (Required)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Authentication Secret (Required - min 32 chars)
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars

# CORS Origins (Required - your frontend URLs)
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000

# Environment
ENVIRONMENT=production

# API Configuration (Optional - defaults are fine)
API_HOST=0.0.0.0
API_PORT=7860
```

### Step 4: Deploy

1. Commit and push files to Space
2. Hugging Face will automatically build Docker image
3. Wait for build to complete (2-5 minutes)
4. Check logs for any errors

### Step 5: Verify Deployment

Visit your Space URL:
- `https://your-username-todo-app-backend.hf.space/health` - Should return healthy status
- `https://your-username-todo-app-backend.hf.space/docs` - API documentation

### Step 6: Update Frontend

Update frontend `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-username-todo-app-backend.hf.space
```

## Neon PostgreSQL Setup

1. Go to https://neon.tech
2. Create new project
3. Copy connection string
4. Add to Hugging Face Space variables as `DATABASE_URL`

## Troubleshooting

### Space keeps sleeping
- Hugging Face free tier spaces sleep after inactivity
- Upgrade to paid tier for always-on
- Or use a cron job to ping `/health` every 5 minutes

### CORS errors
- Ensure `CORS_ORIGINS` includes your frontend URL
- Check frontend is using correct API URL
- Verify no trailing slashes in URLs

### Database connection errors
- Verify `DATABASE_URL` is correct
- Ensure `?sslmode=require` is in connection string
- Check Neon database is active

### Build failures
- Check Dockerfile syntax
- Verify all dependencies in requirements.txt
- Check Space logs for specific errors

## Local Testing with Docker

```bash
# Build image
docker build -t todo-backend .

# Run container
docker run -p 7860:7860 --env-file .env todo-backend

# Test
curl http://localhost:7860/health
```

## Production Checklist

- [ ] Database URL configured
- [ ] Auth secret set (32+ chars)
- [ ] CORS origins include frontend URL
- [ ] Environment set to production
- [ ] Health endpoint returns 200
- [ ] API docs accessible
- [ ] Frontend can connect
- [ ] Authentication works
- [ ] Database migrations applied
