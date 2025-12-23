from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import models, schemas, crud, auth, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS - Allow local dev and production URLs
CORS_ORIGINS_ENV = os.getenv("CORS_ORIGINS", "")
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_ENV.split(",") if origin.strip()]
# Always allow localhost for development and production frontend
CORS_ORIGINS.append("http://localhost:5173")
CORS_ORIGINS.append("https://blog-application-theta-sand.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS_ENV else ["*"],  # Allow all if not set (dev mode)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed Admin
@app.on_event("startup")
def startup_event():
    db = database.SessionLocal()
    admin_email = "admin@example.com"
    existing_admin = crud.get_user_by_email(db, email=admin_email)
    if not existing_admin:
        admin_data = schemas.UserCreate(
            name="Admin User",
            email=admin_email,
            phone="0000000000",
            password="adminpassword"
        )
        crud.create_user(db=db, user=admin_data, is_admin=True)
        print("Admin user created: admin@example.com / adminpassword")
    db.close()

# Auth Routes
@app.post("/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/auth/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# Post Routes
@app.post("/posts", response_model=schemas.PostResponse)
def create_post(post: schemas.PostCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_post(db=db, post=post, user_id=current_user.id)

@app.get("/posts", response_model=List[schemas.PostResponse]) # Use PostDetail if we want comments in list, but standard list usually omits comments
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: Optional[models.User] = Depends(auth.get_current_user_optional)):
    posts = crud.get_posts(db, skip=skip, limit=limit)
    result = []
    for post in posts:
        like_count = len(post.liked_by)
        is_liked = current_user is not None and current_user in post.liked_by
        post_dict = {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "created_at": post.created_at,
            "author_id": post.author_id,
            "author": post.author,
            "like_count": like_count,
            "is_liked": is_liked
        }
        result.append(post_dict)
    return result

@app.get("/posts/{post_id}", response_model=schemas.PostDetail)
def read_post(post_id: int, db: Session = Depends(database.get_db), current_user: Optional[models.User] = Depends(auth.get_current_user_optional)):
    post = crud.get_post(db, post_id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    like_count = len(post.liked_by)
    is_liked = current_user is not None and current_user in post.liked_by
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "created_at": post.created_at,
        "author_id": post.author_id,
        "author": post.author,
        "comments": post.comments,
        "like_count": like_count,
        "is_liked": is_liked
    }

@app.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    post = crud.get_post(db, post_id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    crud.delete_post(db, post_id=post_id)
    return None

# Social Routes
@app.post("/posts/{post_id}/comments", response_model=schemas.CommentResponse)
def create_comment(post_id: int, comment: schemas.CommentCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    post = crud.get_post(db, post_id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return crud.create_comment(db=db, comment=comment, user_id=current_user.id, post_id=post_id)

@app.post("/posts/{post_id}/like")
def like_post(post_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    success = crud.like_post(db, post_id=post_id, user_id=current_user.id)
    if not success:
         raise HTTPException(status_code=400, detail="Cannot like post")
    return {"message": "Post liked"}

@app.post("/posts/{post_id}/unlike")
def unlike_post(post_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    success = crud.unlike_post(db, post_id=post_id, user_id=current_user.id)
    if not success:
         raise HTTPException(status_code=400, detail="Cannot unlike post")
    return {"message": "Post unliked"}

@app.post("/users/{user_id}/follow")
def follow_user(user_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    success = crud.follow_user(db, follower_id=current_user.id, followed_id=user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot follow user")
    return {"message": "Followed user"}

@app.post("/users/{user_id}/unfollow")
def unfollow_user(user_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    success = crud.unfollow_user(db, follower_id=current_user.id, followed_id=user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot unfollow user")
    return {"message": "Unfollowed user"}

# Admin Routes
@app.get("/admin/users", response_model=List[schemas.UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_admin)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.delete("/admin/users/{user_id}", response_model=schemas.UserResponse)
def delete_user(user_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_admin)):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
    user = crud.delete_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
