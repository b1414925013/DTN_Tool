from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 导入路由和模型
from app.routes import dtn, system, common
from app.database import engine, Base
from app.models import user, graph_db_password, operation_log
from app.middleware import OperationLogMiddleware

# 尝试创建数据库表
try:
    Base.metadata.create_all(bind=engine)
    print("数据库连接成功，表结构已创建")
except Exception as e:
    print(f"警告：数据库连接失败，部分功能可能无法使用: {e}")


# 初始化示例操作日志函数
def init_sample_logs():
    """初始化示例操作日志"""
    print("开始初始化示例操作日志...")
    from sqlalchemy.orm import sessionmaker
    from datetime import datetime, timedelta
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # 检查是否已有操作日志
        from app.models.operation_log import OperationLog
        log_count = db.query(OperationLog).count()
        print(f"当前操作日志数量: {log_count}")
        
        if log_count == 0:
            print("添加示例操作日志...")
            
            # 创建示例操作日志
            sample_logs = [
                {
                    "operation_type": "登录",
                    "operation_desc": "系统登录",
                    "username": "管理员",
                    "status": "success"
                },
                {
                    "operation_type": "查询",
                    "operation_desc": "查看图数据库密码列表",
                    "username": "管理员",
                    "status": "success"
                },
                {
                    "operation_type": "创建",
                    "operation_desc": "添加图数据库密码",
                    "username": "管理员",
                    "status": "success"
                },
                {
                    "operation_type": "查询",
                    "operation_desc": "查看用户列表",
                    "username": "管理员",
                    "status": "success"
                },
                {
                    "operation_type": "更新",
                    "operation_desc": "更新用户信息",
                    "username": "管理员",
                    "status": "success"
                }
            ]
            
            # 插入示例日志，设置不同的时间
            now = datetime.now()
            for i, log_data in enumerate(sample_logs):
                log_data["created_at"] = now - timedelta(minutes=(len(sample_logs) - i) * 15)
                db_log = OperationLog(**log_data)
                db.add(db_log)
            
            db.commit()
            print(f"已添加 {len(sample_logs)} 条示例操作日志")
        else:
            print("已有操作日志，跳过初始化")
    except Exception as e:
        print(f"初始化示例操作日志失败: {e}")
        import traceback
        print(f"错误详情: {traceback.format_exc()}")
        db.rollback()
    finally:
        db.close()


# 创建 FastAPI 应用
app = FastAPI(
    title=os.getenv("APP_NAME", "DTN_Tool"),
    version=os.getenv("APP_VERSION", "1.0.0"),
    description="DTN_Tool 后台管理系统"
)

# 在应用启动后初始化示例数据
init_sample_logs()

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境中应该设置具体的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加操作日志中间件
app.add_middleware(OperationLogMiddleware)

# 注册路由
app.include_router(dtn.router, prefix="/api/dtn", tags=["DTN"])
app.include_router(system.router, prefix="/api/system", tags=["系统管理"])
app.include_router(common.router, prefix="/api/common", tags=["公共"])

# 添加静态文件服务
from fastapi.staticfiles import StaticFiles

app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

# 根路径返回前端页面
from fastapi.responses import FileResponse

@app.get("/")
def read_root():
    return FileResponse("frontend/index.html")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)