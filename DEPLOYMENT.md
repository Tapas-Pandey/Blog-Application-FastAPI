# Free Hosting Guide for Blog Application

This guide will walk you through deploying your blog application for free using GitHub and various free hosting services.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Backend Deployment (FastAPI)](#backend-deployment-fastapi)
   - [Option 1: Render (Recommended)](#option-1-render-recommended)
   - [Option 2: Railway](#option-2-railway)
   - [Option 3: PythonAnywhere](#option-3-pythonanywhere)
4. [Frontend Deployment (React/Vite)](#frontend-deployment-reactvite)
   - [Option 1: Vercel (Recommended)](#option-1-vercel-recommended)
   - [Option 2: Netlify](#option-2-netlify)
5. [Database Setup](#database-setup)
6. [Environment Variables](#environment-variables)
7. [GitHub Setup](#github-setup)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This application consists of:
- **Backend**: FastAPI (Python) - needs a Python hosting service
- **Frontend**: React with Vite - can be hosted on Vercel/Netlify
- **Database**: SQLite (can be upgraded to PostgreSQL for production)

---

## Prerequisites

1. A GitHub account
2. Git installed on your local machine
3. Accounts on hosting services:
   - Render or Railway (for backend)
   - Vercel or Netlify (for frontend)

---

## Backend Deployment (FastAPI)

### Option 1: Render (Recommended)

**Why Render?** Free tier includes PostgreSQL, automatic SSL, and easy deployment from GitHub.

#### Step 1: Prepare Backend for Deployment

1. Create a `requirements.txt` file in the `backend` folder (if not exists):

```bash
cd backend
pip freeze > requirements.txt
```

If `requirements.txt` doesn't exist, create it with:

```txt
fastapi==0.127.0
uvicorn[standard]==0.40.0
sqlalchemy==2.0.45
python-jose[cryptography]==3.5.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.21
pydantic==2.12.5
```

2. Create a `Procfile` or `render.yaml` in the backend folder:

**Option A: Using Procfile** (create `backend/Procfile`):
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Option B: Using render.yaml** (create `render.yaml` in root):
```yaml
services:
  - type: web
    name: blog-backend
    env: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: blog-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: ALGORITHM
        value: HS256

databases:
  - name: blog-db
    databaseName: blogdb
    user: bloguser
    plan: free
```

3. Update CORS settings in `backend/main.py`:

```python
# Replace the CORS section with:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local dev
        "https://your-frontend-domain.vercel.app",  # Production
        "https://your-frontend-domain.netlify.app",  # If using Netlify
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `blog-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: Leave empty (or set to `backend` if you prefer)
5. Add Environment Variables:
   - `SECRET_KEY`: Generate a random string (use: `openssl rand -hex 32`)
   - `ALGORITHM`: `HS256`
   - `DATABASE_URL`: (Auto-created if you add a PostgreSQL database)
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://blog-backend.onrender.com`)

#### Step 3: Add PostgreSQL Database (Optional but Recommended)

1. In Render dashboard, click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `blog-db`
   - **Database**: `blogdb`
   - **User**: `bloguser`
   - **Plan**: Free
3. Copy the **Internal Database URL**
4. Update your backend service's `DATABASE_URL` environment variable
5. Update `backend/database.py` to use PostgreSQL:

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Use PostgreSQL in production, SQLite locally
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

if DATABASE_URL.startswith("postgres"):
    # PostgreSQL connection
    engine = create_engine(DATABASE_URL)
else:
    # SQLite connection (local)
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

### Option 2: Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Python
5. Add environment variables:
   - `SECRET_KEY`
   - `ALGORITHM`: `HS256`
6. Add PostgreSQL database (free tier available)
7. Update `DATABASE_URL` environment variable
8. Deploy!

---

### Option 3: PythonAnywhere

1. Go to [pythonanywhere.com](https://www.pythonanywhere.com) and sign up (free tier)
2. Upload your backend files via Files tab
3. Open a Bash console and install dependencies:
   ```bash
   pip3.10 install --user fastapi uvicorn sqlalchemy python-jose passlib
   ```
4. Create a web app and point it to your `main.py`
5. Configure WSGI file to use uvicorn
6. Update CORS settings with your frontend URL

---

## Frontend Deployment (React/Vite)

### Option 1: Vercel (Recommended)

**Why Vercel?** Excellent for React apps, automatic deployments, free SSL, and great performance.

#### Step 1: Prepare Frontend

1. Update `frontend/src/api/axios.js` to use environment variable:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

2. Create `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

3. Create `frontend/.env.local` for local development:

```env
VITE_API_URL=http://localhost:8000
```

4. Update `frontend/vite.config.js` (if needed):

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
```

#### Step 2: Deploy to Vercel

**Method 1: Using Vercel CLI (Recommended)**

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Follow prompts:
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name? **blog-frontend** (or your choice)
   - Directory? **./**
   - Override settings? **No**

6. Add environment variable:
   ```bash
   vercel env add VITE_API_URL
   # Enter: https://your-backend-url.onrender.com
   ```

7. Redeploy:
   ```bash
   vercel --prod
   ```

**Method 2: Using GitHub Integration**

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com`
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Your site will be live at `https://your-project.vercel.app`

#### Step 3: Update Backend CORS

Update your backend CORS settings to include your Vercel URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-project.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Option 2: Netlify

1. Go to [netlify.com](https://www.netlify.com) and sign up
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com`
6. Click "Deploy site"
7. Your site will be live at `https://random-name.netlify.app`

---

## Database Setup

### For Production (PostgreSQL on Render)

1. After creating PostgreSQL database on Render, update `backend/database.py`:

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Handle PostgreSQL URL format (Render uses postgres://, SQLAlchemy needs postgresql://)
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

if not DATABASE_URL:
    # Fallback to SQLite for local development
    DATABASE_URL = "sqlite:///./sql_app.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # PostgreSQL connection
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

2. Install PostgreSQL driver:
   ```bash
   pip install psycopg2-binary
   ```

3. Add to `requirements.txt`:
   ```
   psycopg2-binary==2.9.9
   ```

---

## Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Secret key for JWT tokens | `your-secret-key-here` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@host/db` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://blog-backend.onrender.com` |

---

## GitHub Setup

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it (e.g., `blog-application`)
3. Don't initialize with README (if you already have code)

### Step 2: Push Your Code

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote
git remote add origin https://github.com/your-username/blog-application.git

# Push
git branch -M main
git push -u origin main
```

### Step 3: Create .gitignore

Create `.gitignore` in root:

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/
*.db
*.sqlite

# Node
node_modules/
dist/
.env.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

---

## Complete Deployment Checklist

- [ ] Backend deployed on Render/Railway
- [ ] Backend URL copied
- [ ] PostgreSQL database created (optional)
- [ ] Backend CORS updated with frontend URL
- [ ] Frontend environment variable `VITE_API_URL` set
- [ ] Frontend deployed on Vercel/Netlify
- [ ] Frontend URL copied
- [ ] Backend CORS updated with production frontend URL
- [ ] Test login/register functionality
- [ ] Test creating posts
- [ ] Test comments and likes

---

## Troubleshooting

### Backend Issues

**Problem**: Backend returns 500 errors
- **Solution**: Check Render logs, ensure all dependencies are in `requirements.txt`

**Problem**: Database connection errors
- **Solution**: Verify `DATABASE_URL` is set correctly, check PostgreSQL is running

**Problem**: CORS errors
- **Solution**: Update CORS origins in `backend/main.py` to include your frontend URL

### Frontend Issues

**Problem**: API calls fail
- **Solution**: Check `VITE_API_URL` environment variable is set correctly

**Problem**: Build fails on Vercel
- **Solution**: Ensure `package.json` has correct build script, check Node version

**Problem**: Environment variables not working
- **Solution**: Vite requires `VITE_` prefix, restart dev server after changes

### General Issues

**Problem**: Changes not reflecting
- **Solution**: Clear browser cache, check if deployment completed successfully

**Problem**: Authentication not working
- **Solution**: Verify backend URL is correct, check CORS settings

---

## Free Hosting Limits

### Render (Free Tier)
- 750 hours/month (enough for 24/7)
- PostgreSQL database included
- Auto-sleeps after 15 minutes of inactivity (wakes on request)

### Vercel (Free Tier)
- Unlimited deployments
- 100GB bandwidth/month
- Automatic SSL
- No sleep time

### Netlify (Free Tier)
- 100GB bandwidth/month
- 300 build minutes/month
- Automatic SSL

---

## Upgrading to Production

When ready to scale:

1. **Database**: Use managed PostgreSQL (Render, Supabase, or Neon)
2. **Backend**: Consider upgrading Render plan or using Railway
3. **CDN**: Vercel/Netlify already include CDN
4. **Monitoring**: Add error tracking (Sentry free tier)
5. **Backups**: Set up automated database backups

---

## Support

If you encounter issues:
1. Check service status pages
2. Review deployment logs
3. Check environment variables
4. Verify CORS settings
5. Test API endpoints directly

---

**Happy Deploying! 🚀**

