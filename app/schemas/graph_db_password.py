from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class GraphDBPasswordBase(BaseModel):
    environment: str = Field(..., min_length=1, max_length=50, description="环境名称")
    password: str = Field(..., min_length=1, max_length=255, description="密码")
    description: Optional[str] = Field(None, max_length=255, description="描述")

class GraphDBPasswordCreate(GraphDBPasswordBase):
    pass

class GraphDBPasswordUpdate(BaseModel):
    environment: Optional[str] = Field(None, min_length=1, max_length=50, description="环境名称")
    password: Optional[str] = Field(None, min_length=1, max_length=255, description="密码")
    description: Optional[str] = Field(None, max_length=255, description="描述")

class GraphDBPassword(GraphDBPasswordBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True