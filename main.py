from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 导入路由
from app.routes import dtn, system, common
from app.database import engine, Base

# 尝试创建数据库表
try:
    Base.metadata.create_all(bind=engine)
    print("数据库连接成功，表结构已创建")
except Exception as e:
    print(f"警告：数据库连接失败，部分功能可能无法使用: {e}")

# 创建 FastAPI 应用
app = FastAPI(
    title=os.getenv("APP_NAME", "DTN_Tool"),
    version=os.getenv("APP_VERSION", "1.0.0"),
    description="DTN_Tool 后台管理系统"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境中应该设置具体的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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