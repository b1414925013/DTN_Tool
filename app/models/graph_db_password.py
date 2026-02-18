from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base

class GraphDBPassword(Base):
    __tablename__ = "graph_db_passwords"
    
    id = Column(Integer, primary_key=True, index=True)
    environment = Column(String(50), nullable=False, index=True)  # 环境名称
    password = Column(String(255), nullable=False)  # 密码
    description = Column(String(255), nullable=True)  # 描述
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())