from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class OperationLogBase(BaseModel):
    """操作日志基础模型"""
    operation_type: str
    operation_desc: str
    username: Optional[str] = None
    status: str = "success"
    request_url: Optional[str] = None
    request_method: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    error_message: Optional[str] = None


class OperationLogCreate(OperationLogBase):
    """创建操作日志模型"""
    pass


class OperationLogResponse(OperationLogBase):
    """操作日志响应模型"""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
