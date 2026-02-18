from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str = Field(..., min_length=1, max_length=50, description="用户名")
    email: EmailStr = Field(..., description="邮箱")
    full_name: Optional[str] = Field(None, max_length=100, description="全名")
    role: str = Field(default="user", max_length=50, description="角色")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=50, description="密码")

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = Field(None, description="邮箱")
    full_name: Optional[str] = Field(None, max_length=100, description="全名")
    role: Optional[str] = Field(None, max_length=50, description="角色")
    password: Optional[str] = Field(None, min_length=6, max_length=50, description="密码")

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str = Field(..., description="用户名")
    password: str = Field(..., description="密码")

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"