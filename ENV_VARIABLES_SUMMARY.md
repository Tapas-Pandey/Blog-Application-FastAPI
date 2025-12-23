# Environment Variables Summary

## 🚀 Production Configuration

### Backend (Render) - Set in Dashboard

Go to: https://dashboard.render.com → Your Service → Environment

```env
SECRET_KEY=<generate-with-openssl-rand-hex-32>
ALGORITHM=HS256
DATABASE_URL=postgresql://bloguser:KIK5k4N1z349pUlFHEmBbfdJJIVIM4z0@dpg-d55087re5dus73bsqpd0-a/blogdb_qmgm
CORS_ORIGINS=https://blog-application-theta-sand.vercel.app,http://localhost:5173
```

### Frontend (Vercel) - Set in Dashboard

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

```env
VITE_API_URL=https://blog-application-fastapi.onrender.com
```

## 📍 Production URLs

- **Frontend**: https://blog-application-theta-sand.vercel.app/
- **Backend**: https://blog-application-fastapi.onrender.com
- **API Docs**: https://blog-application-fastapi.onrender.com/docs

## 🔑 Generate SECRET_KEY

```bash
openssl rand -hex 32
```

Copy the output and use it as your `SECRET_KEY` value in Render.

## ✅ Quick Checklist

### Render (Backend)
- [ ] `SECRET_KEY` - Generated secure key
- [ ] `ALGORITHM` - Set to `HS256`
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `CORS_ORIGINS` - Frontend URL + localhost

### Vercel (Frontend)
- [ ] `VITE_API_URL` - Backend URL

### Verification
- [ ] Backend accessible at: https://blog-application-fastapi.onrender.com/docs
- [ ] Frontend accessible at: https://blog-application-theta-sand.vercel.app/
- [ ] Can login/register
- [ ] Can create posts
- [ ] No CORS errors in browser console

## 📝 Notes

1. **Never commit `.env` files** with real credentials to GitHub
2. **SECRET_KEY** must be a strong random string (not the default)
3. **CORS_ORIGINS** must include your exact frontend URL (with https://)
4. After setting variables, services will auto-redeploy
5. For Vercel, you may need to manually redeploy after setting env vars

## 🔧 Files Updated

- ✅ `backend/main.py` - CORS includes production frontend URL
- ✅ `backend/auth.py` - Uses environment variable for SECRET_KEY
- ✅ `backend/database.py` - Supports PostgreSQL from DATABASE_URL
- ✅ `frontend/src/api/axios.js` - Uses VITE_API_URL environment variable

## 📚 Documentation

- [SETUP_PRODUCTION.md](./SETUP_PRODUCTION.md) - Quick setup guide
- [PRODUCTION_ENV_SETUP.md](./PRODUCTION_ENV_SETUP.md) - Detailed instructions
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Full deployment guide

