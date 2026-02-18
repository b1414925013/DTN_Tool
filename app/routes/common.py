from fastapi import APIRouter

router = APIRouter()

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