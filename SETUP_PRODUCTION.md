# Quick Production Setup Guide

## Your Production URLs

- **Frontend**: https://blog-application-theta-sand.vercel.app/
- **Backend**: https://blog-application-fastapi.onrender.com
- **Database**: PostgreSQL on Render

## Step 1: Set Backend Environment Variables (Render)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your service: `blog-application-fastapi`
3. Go to **Environment** tab
4. Add these variables:

```
SECRET_KEY=<generate-with-openssl-rand-hex-32>
ALGORITHM=HS256
DATABASE_URL=postgresql://bloguser:KIK5k4N1z349pUlFHEmBbfdJJIVIM4z0@dpg-d55087re5dus73bsqpd0-a/blogdb_qmgm
CORS_ORIGINS=https://blog-application-theta-sand.vercel.app,http://localhost:5173
```

5. Click **Save Changes**
6. Service will auto-redeploy

## Step 2: Set Frontend Environment Variable (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project: `blog-application-theta-sand`
3. Go to **Settings** → **Environment Variables**
4. Add variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://blog-application-fastapi.onrender.com`
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**
6. Go to **Deployments** tab
7. Click **⋯** (three dots) on latest deployment → **Redeploy**

## Step 3: Verify Everything Works

1. **Test Backend**:
   - Visit: https://blog-application-fastapi.onrender.com/docs
   - Should show FastAPI documentation

2. **Test Frontend**:
   - Visit: https://blog-application-theta-sand.vercel.app/
   - Try logging in
   - Check browser console (F12) for any errors

3. **Test Database**:
   - Create a test post
   - Verify it appears in the feed

## Generate SECRET_KEY

Run this command to generate a secure secret key:

```bash
openssl rand -hex 32
```

Copy the output and use it as your `SECRET_KEY` value.

## Troubleshooting

### CORS Errors
- Make sure `CORS_ORIGINS` in Render includes your Vercel URL exactly
- Format: `https://blog-application-theta-sand.vercel.app` (no trailing slash)

### API Not Working
- Verify `VITE_API_URL` is set in Vercel
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Check browser console for errors

### Database Errors
- Verify `DATABASE_URL` is correct in Render
- Check Render database is running
- Check Render logs for connection errors

## Need More Help?

See [PRODUCTION_ENV_SETUP.md](./PRODUCTION_ENV_SETUP.md) for detailed instructions.

