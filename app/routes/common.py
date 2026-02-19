from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, Dict, List
import time
import platform
import sys
from sqlalchemy.orm import Session
from sqlalchemy import text, desc
from app.database import get_db, engine
from app.models.user import User
from app.models.graph_db_password import GraphDBPassword
from app.models.operation_log import OperationLog
from app.schemas.operation_log import OperationLogCreate, OperationLogResponse
import fastapi

router = APIRouter()

# 自定义任务请求模型
class CustomTaskRequest(BaseModel):
    base_url: str
    username: str
    password: str
    params: Optional[Dict] = None

# 健康检查接口
@router.get("/health")
def health_check():
    return {"status": "healthy", "message": "DTN_Tool API is running"}

# 获取系统信息
@router.get("/info")
def get_system_info():
    return {
        "app_name": "DTN_Tool",
        "version": "1.0.0",
        "description": "DTN_Tool 后台管理系统"
    }

# 获取仪表盘统计数据
@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """获取仪表盘统计数据，包括用户数量、图数据库连接数等"""
    try:
        # 获取用户数量
        user_count = db.query(User).count()
        
        # 获取图数据库密码数量
        graph_db_count = db.query(GraphDBPassword).count()
        
        # 检查数据库连接状态
        db_connected = True
        try:
            db.execute(text("SELECT 1"))
        except Exception:
            db_connected = False
        
        # 获取当前时间
        from datetime import datetime
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        return {
            "success": True,
            "data": {
                "system_status": "运行正常",
                "graph_db_count": graph_db_count,
                "user_count": user_count,
                "last_activity": current_time,
                "db_connected": db_connected
            }
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"获取统计数据失败: {str(e)}",
            "data": {
                "system_status": "异常",
                "graph_db_count": 0,
                "user_count": 0,
                "last_activity": "-",
                "db_connected": False
            }
        }

# 获取操作日志列表
@router.get("/operation-logs", response_model=List[OperationLogResponse])
def get_operation_logs(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    获取操作日志列表，按时间倒序排列
    """
    logs = db.query(OperationLog).order_by(desc(OperationLog.created_at)).offset(skip).limit(limit).all()
    return logs

# 创建操作日志（内部使用，也可通过API调用）
def create_operation_log(db: Session, log_data: OperationLogCreate):
    """
    创建操作日志
    """
    db_log = OperationLog(**log_data.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

# 获取系统详细信息
@router.get("/dashboard/system-info")
def get_system_info():
    """获取系统详细信息，包括版本号、数据库状态等"""
    try:
        # 检查数据库连接状态
        db_connected = True
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
        except Exception:
            db_connected = False
        
        # 获取当前时间
        from datetime import datetime
        current_time = datetime.now().strftime("%Y-%m-%d")
        
        return {
            "success": True,
            "data": {
                "app_name": "DTN_Tool",
                "app_version": "1.0.0",
                "python_version": f"{sys.version_info.major}.{sys.version_info.minor}",
                "fastapi_version": fastapi.__version__,
                "db_status": "已连接" if db_connected else "未连接",
                "db_status_color": "text-success" if db_connected else "text-danger",
                "last_update": current_time,
                "platform": platform.system(),
                "architecture": platform.architecture()[0]
            }
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"获取系统信息失败: {str(e)}",
            "data": {
                "app_name": "DTN_Tool",
                "app_version": "1.0.0",
                "python_version": "3.8",
                "fastapi_version": "0.124.4",
                "db_status": "未知",
                "db_status_color": "text-warning",
                "last_update": "-",
                "platform": "-",
                "architecture": "-"
            }
        }

# 自定义长耗时任务接口
@router.post("/custom-task")
def custom_task(request: CustomTaskRequest):
    """
    自定义长耗时任务接口
    模拟执行需要5分钟左右的任务
    """
    # 记录开始时间
    start_time = time.time()
    
    # 模拟长耗时操作（5秒用于演示，实际项目中可改为300秒=5分钟）
    # 这里暂时使用5秒作为演示，后续可以根据实际需要修改
    time.sleep(5)
    
    # 计算耗时
    elapsed_time = time.time() - start_time
    
    # 返回结果
    return {
        "success": True,
        "message": "任务执行完成",
        "input_params": {
            "base_url": request.base_url,
            "username": request.username,
            "password": "***",  # 隐藏密码
            "params": request.params
        },
        "execution_time": f"{elapsed_time:.2f}秒",
        "estimated_time": "5分钟",
        "status": "completed"
    }