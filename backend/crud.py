from sqlalchemy.orm import Session
import models, schemas, auth

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate, is_admin: bool = False):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        hashed_password=hashed_password,
        is_admin=is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    return user

# Posts
def create_post(db: Session, post: schemas.PostCreate, user_id: int):
    db_post = models.Post(**post.dict(), author_id=user_id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def get_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Post).order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()

def get_post(db: Session, post_id: int):
    return db.query(models.Post).filter(models.Post.id == post_id).first()

def delete_post(db: Session, post_id: int):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if post:
        db.delete(post)
        db.commit()
    return post

# Comments
def create_comment(db: Session, comment: schemas.CommentCreate, user_id: int, post_id: int):
    db_comment = models.Comment(**comment.dict(), user_id=user_id, post_id=post_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

# Social
def like_post(db: Session, post_id: int, user_id: int):
    post = get_post(db, post_id)
    user = get_user(db, user_id)
    if post and user:
        if user not in post.liked_by:
            post.liked_by.append(user)
            db.commit()
            return True
    return False

def unlike_post(db: Session, post_id: int, user_id: int):
    post = get_post(db, post_id)
    user = get_user(db, user_id)
    if post and user:
        if user in post.liked_by:
            post.liked_by.remove(user)
            db.commit()
            return True
    return False

def follow_user(db: Session, follower_id: int, followed_id: int):
    follower = get_user(db, follower_id)
    followed = get_user(db, followed_id)
    if follower and followed:
        if followed not in follower.following:
            follower.following.append(followed)
            db.commit()
            return True
    return False

def unfollow_user(db: Session, follower_id: int, followed_id: int):
    follower = get_user(db, follower_id)
    followed = get_user(db, followed_id)
    if follower and followed:
        if followed in follower.following:
            follower.following.remove(followed)
            db.commit()
            return True
    return False

def get_feed(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    # This acts as a global feed or we can filter by following
    # For now, let's return all posts (global feed)
    return get_posts(db, skip, limit)
