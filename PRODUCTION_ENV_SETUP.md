# Production Environment Variables Setup

This document contains the production environment variables for your deployed application.

## Backend Environment Variables (Render)

Set these in your Render dashboard under your backend service → Environment:

```
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
DATABASE_URL=postgresql://bloguser:KIK5k4N1z349pUlFHEmBbfdJJIVIM4z0@dpg-d55087re5dus73bsqpd0-a/blogdb_qmgm
CORS_ORIGINS=https://blog-application-theta-sand.vercel.app,http://localhost:5173
```

### How to Set on Render:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service: `blog-application-fastapi`
3. Go to "Environment" tab
4. Add each variable:
   - **SECRET_KEY**: Generate a secure random string (use: `openssl rand -hex 32`)
   - **ALGORITHM**: `HS256`
   - **DATABASE_URL**: `postgresql://bloguser:KIK5k4N1z349pUlFHEmBbfdJJIVIM4z0@dpg-d55087re5dus73bsqpd0-a/blogdb_qmgm`
   - **CORS_ORIGINS**: `https://blog-application-theta-sand.vercel.app,http://localhost:5173`
5. Click "Save Changes"
6. Service will automatically redeploy

## Frontend Environment Variables (Vercel)

Set this in your Vercel dashboard under your project → Settings → Environment Variables:

```
VITE_API_URL=https://blog-application-fastapi.onrender.com
```

### How to Set on Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `blog-application-theta-sand`
3. Go to "Settings" → "Environment Variables"
4. Add variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://blog-application-fastapi.onrender.com`
   - **Environment**: Production, Preview, Development (select all)
5. Click "Save"
6. Redeploy your application (or it will auto-deploy on next push)

## Production URLs

- **Frontend**: https://blog-application-theta-sand.vercel.app/
- **Backend**: https://blog-application-fastapi.onrender.com
- **Database**: PostgreSQL on Render

## Important Notes

1. **SECRET_KEY**: Generate a new secure random key for production. Never use the default!
   ```bash
   openssl rand -hex 32
   ```

2. **Database URL**: The PostgreSQL connection string is already configured. Make sure the database is running on Render.

3. **CORS**: The backend is configured to accept requests from:
   - Production frontend: `https://blog-application-theta-sand.vercel.app`
   - Local development: `http://localhost:5173`

4. **Environment Variables**: 
   - Backend variables are set in Render dashboard
   - Frontend variables are set in Vercel dashboard
   - Never commit `.env` files with real credentials to GitHub

## Verification Steps

After setting environment variables:

1. **Backend**:
   - Check Render logs to ensure no errors
   - Visit: `https://blog-application-fastapi.onrender.com/docs` (should show FastAPI docs)
   - Test: `https://blog-application-fastapi.onrender.com/posts` (should return posts or empty array)

2. **Frontend**:
   - Visit: `https://blog-application-theta-sand.vercel.app/`
   - Open browser console (F12) → Network tab
   - Try logging in - API calls should go to `https://blog-application-fastapi.onrender.com`

3. **Database**:
   - Check Render dashboard → Database section
   - Verify database is running
   - Tables should be created automatically on first startup

## Troubleshooting

### Backend Issues

**Problem**: CORS errors in browser console
- **Solution**: Verify `CORS_ORIGINS` includes your frontend URL exactly (with https://)

**Problem**: Database connection errors
- **Solution**: Check `DATABASE_URL` is correct, verify database is running on Render

**Problem**: 500 errors
- **Solution**: Check Render logs, ensure all environment variables are set

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Verify `VITE_API_URL` is set correctly in Vercel, check browser console for errors

**Problem**: Still using localhost API
- **Solution**: Clear browser cache, hard refresh (Ctrl+Shift+R), verify environment variable is set for Production environment

## Security Checklist

- [ ] SECRET_KEY is a strong random string (not default)
- [ ] Database password is secure
- [ ] CORS_ORIGINS only includes trusted domains
- [ ] Environment variables are set in hosting dashboard (not in code)
- [ ] .env files are in .gitignore
- [ ] No credentials committed to GitHub

