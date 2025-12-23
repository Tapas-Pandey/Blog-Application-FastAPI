from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    name: str
    phone: str
    password: str

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    name: str
    phone: str
    is_admin: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    created_at: datetime.datetime
    user_id: int
    user: UserResponse

    class Config:
        from_attributes = True

class PostBase(BaseModel):
    title: str
    content: str

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id: int
    title: str
    content: str
    created_at: datetime.datetime
    author_id: int
    author: UserResponse
    like_count: int = 0
    is_liked: bool = False
    
    class Config:
        from_attributes = True

class PostDetail(PostResponse):
    comments: List[CommentResponse] = []
