# How to Deploy Blog Application

Simple step-by-step guide to deploy on Vercel (Frontend) and Render (Backend) using GitHub.

---

## Step 1: Push Code to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

---

## Step 2: Deploy Backend on Render

1. Go to render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub account and select your repository
4. Configure:
   - **Name**: `blog-backend`
   - **Environment**: `Python 3`
   - **Python Version**: Select `3.11` (IMPORTANT: psycopg2-binary doesn't support Python 3.13)
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Scroll down to "Environment Variables" and add:
   - `SECRET_KEY`: Generate one using `openssl rand -hex 32`
   - `ALGORITHM`: `HS256`
   - `DATABASE_URL`: Your PostgreSQL connection string (add after Step 3)
   - `CORS_ORIGINS`: Your frontend URL (add after Step 4)
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (example: `https://blog-backend.onrender.com`)

**Note**: If you see psycopg2 import errors, make sure Python version is set to 3.11, not 3.13.

---

## Step 3: Create PostgreSQL Database on Render

1. In Render dashboard, click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `blog-db`
   - **Database**: `blogdb`
   - **User**: `bloguser`
   - **Plan**: Free
3. Click "Create Database"
4. Copy the "Internal Database URL"
5. Go back to your backend service → Environment tab
6. Update `DATABASE_URL` with the copied PostgreSQL URL
7. Service will automatically redeploy

---

## Step 4: Deploy Frontend on Vercel

1. Go to vercel.com and sign up/login
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render backend URL (from Step 2)
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Copy your frontend URL (example: `https://blog-app.vercel.app`)

---

## Step 5: Update Backend CORS

1. Go back to Render dashboard → Your backend service
2. Click "Environment" tab
3. Update `CORS_ORIGINS`:
   - **Value**: `https://your-frontend-url.vercel.app,http://localhost:5173`
   - Replace `your-frontend-url.vercel.app` with your actual Vercel URL
4. Click "Save Changes"
5. Service will automatically redeploy

---

## Step 6: Verify Deployment

1. **Test Backend**:
   - Visit: `https://your-backend-url.onrender.com/docs`
   - You should see FastAPI documentation

2. **Test Frontend**:
   - Visit: `https://your-frontend-url.vercel.app`
   - Try logging in
   - Check browser console (F12) for errors

3. **Test Full Flow**:
   - Register a new user
   - Create a post
   - Add a comment
   - Like a post

---

## Environment Variables Summary

### Render (Backend)
```
SECRET_KEY=<generate-with-openssl-rand-hex-32>
ALGORITHM=HS256
DATABASE_URL=<from-postgresql-database>
CORS_ORIGINS=https://your-frontend-url.vercel.app,http://localhost:5173
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## Generate SECRET_KEY

Run this command in terminal:
```bash
openssl rand -hex 32
```
Copy the output and use it as your `SECRET_KEY`.

---

## Troubleshooting

**psycopg2 Import Error?**
- Make sure Python version is set to **3.11** in Render settings
- Python 3.13 is not supported by psycopg2-binary yet
- Check Render service settings → Python Version

**Backend not working?**
- Check Render logs for errors
- Verify all environment variables are set
- Ensure PostgreSQL database is running
- Make sure Python version is 3.11

**Frontend not connecting to backend?**
- Verify `VITE_API_URL` is correct in Vercel
- Check browser console for CORS errors
- Make sure `CORS_ORIGINS` includes your Vercel URL

**CORS errors?**
- Update `CORS_ORIGINS` in Render with exact Vercel URL
- No trailing slash in URL
- Include `https://` prefix

---

## Default Admin Account

After first deployment, admin account is automatically created:
- Email: `admin@example.com`
- Password: `adminpassword`

Change this in production!

---

That's it! Your blog application is now live on Vercel and Render.
