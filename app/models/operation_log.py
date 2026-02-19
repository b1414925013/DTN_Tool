from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base


class OperationLog(Base):
    """操作日志模型"""
    __tablename__ = "operation_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    operation_type = Column(String(50), nullable=False, index=True)  # 操作类型
    operation_desc = Column(String(255), nullable=False)  # 操作描述
    username = Column(String(50), nullable=True, index=True)  # 操作用户
    status = Column(String(20), nullable=False, default="success")  # 操作状态 success/failed
    request_url = Column(String(255), nullable=True)  # 请求URL
    request_method = Column(String(10), nullable=True)  # 请求方法
    ip_address = Column(String(50), nullable=True)  # IP地址
    user_agent = Column(String(255), nullable=True)  # 用户代理
    error_message = Column(Text, nullable=True)  # 错误信息
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)  # 创建时间
