# Blog Application

A modern full-stack blog application built with React (Vite) and FastAPI.

## Features

- 🔐 User authentication (Login/Register)
- ✍️ Create and manage blog posts
- 💬 Comment on posts
- ❤️ Like posts
- 👥 User profiles
- 🔒 Admin dashboard for user management
- 📱 Responsive design with modern UI

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- Modern CSS with glassmorphism effects

### Backend
- FastAPI
- SQLAlchemy (SQLite/PostgreSQL)
- JWT Authentication
- Python-JOSE for token management
- Passlib for password hashing

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the server:
```bash
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
VITE_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Default Admin Account

- Email: `admin@example.com`
- Password: `adminpassword`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to:
- Vercel/Netlify (Frontend)
- Render/Railway (Backend)

## Project Structure

```
.
├── backend/
│   ├── main.py          # FastAPI application
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── crud.py          # Database operations
│   ├── auth.py          # Authentication utilities
│   ├── database.py      # Database configuration
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── api/         # API configuration
│   │   └── App.jsx      # Main app component
│   └── package.json    # Node dependencies
└── DEPLOYMENT.md        # Deployment guide
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/token` - Login (get JWT token)
- `GET /users/me` - Get current user

### Posts
- `GET /posts` - Get all posts
- `GET /posts/{id}` - Get post by ID
- `POST /posts` - Create new post (authenticated)
- `DELETE /posts/{id}` - Delete post (authenticated)

### Social Features
- `POST /posts/{id}/like` - Like a post
- `POST /posts/{id}/unlike` - Unlike a post
- `POST /posts/{id}/comments` - Add comment

### Admin
- `GET /admin/users` - Get all users (admin only)
- `DELETE /admin/users/{id}` - Delete user (admin only)

## Environment Variables

### Backend
- `SECRET_KEY` - JWT secret key (generate with: `openssl rand -hex 32`)
- `ALGORITHM` - JWT algorithm (default: HS256)
- `DATABASE_URL` - Database connection string
- `CORS_ORIGINS` - Comma-separated list of allowed origins

**Production Values:**
- `DATABASE_URL`: `postgresql://bloguser:KIK5k4N1z349pUlFHEmBbfdJJIVIM4z0@dpg-d55087re5dus73bsqpd0-a/blogdb_qmgm`
- `CORS_ORIGINS`: `https://blog-application-theta-sand.vercel.app,http://localhost:5173`

### Frontend
- `VITE_API_URL` - Backend API URL

**Production Value:**
- `VITE_API_URL`: `https://blog-application-fastapi.onrender.com`

### Production URLs
- **Frontend**: https://blog-application-theta-sand.vercel.app/
- **Backend**: https://blog-application-fastapi.onrender.com

See [PRODUCTION_ENV_SETUP.md](./PRODUCTION_ENV_SETUP.md) for detailed setup instructions.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

