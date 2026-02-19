"""
操作日志中间件
实现类似Java AOP的功能，自动记录API操作日志
"""
import time
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.operation_log import OperationLog


# 定义需要记录日志的路径和操作描述映射
OPERATION_DESC_MAP = {
    # 图数据库密码相关
    '/api/dtn/graph-db-passwords': {
        'GET': '查询图数据库密码列表',
        'POST': '创建图数据库密码',
    },
    '/api/dtn/graph-db-passwords/': {
        'GET': '查询图数据库密码详情',
        'PUT': '更新图数据库密码',
        'DELETE': '删除图数据库密码',
    },
    # 用户管理相关
    '/api/system/users': {
        'GET': '查询用户列表',
        'POST': '创建用户',
    },
    '/api/system/users/': {
        'GET': '查询用户详情',
        'PUT': '更新用户',
        'DELETE': '删除用户',
    },
    # 登录相关
    '/api/system/login': {
        'POST': '用户登录',
    },
    # 自定义任务相关
    '/api/common/custom-long-task': {
        'POST': '执行自定义长耗时任务',
    },
    # 操作日志查询本身不记录，避免循环
}


def get_operation_desc(path: str, method: str) -> tuple:
    """
    根据请求路径和方法获取操作类型和描述
    返回 (operation_type, operation_desc)
    """
    # 检查精确匹配
    if path in OPERATION_DESC_MAP:
        desc = OPERATION_DESC_MAP[path].get(method)
        if desc:
            return (desc[:2], desc)  # 前两个字作为操作类型
    
    # 检查带路径参数的匹配（如 /api/dtn/graph-db-passwords/1）
    for base_path, methods in OPERATION_DESC_MAP.items():
        if base_path.endswith('/') and path.startswith(base_path):
            desc = methods.get(method)
            if desc:
                return (desc[:2], desc)
    
    # 默认返回
    default_type_map = {
        'GET': '查询',
        'POST': '创建',
        'PUT': '更新',
        'DELETE': '删除',
    }
    op_type = default_type_map.get(method, '操作')
    return (op_type, f'{op_type}操作')


class OperationLogMiddleware(BaseHTTPMiddleware):
    """
    操作日志中间件
    自动记录API请求的操作日志
    """
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()
        
        # 跳过静态文件和非API路径
        path = request.url.path
        if path.startswith('/frontend/') or path == '/' or '/operation-logs' in path:
            return await call_next(request)
        
        # 获取请求信息
        method = request.method
        client_host = request.client.host if request.client else 'unknown'
        user_agent = request.headers.get('user-agent', '')
        
        # 获取操作描述
        operation_type, operation_desc = get_operation_desc(path, method)
        
        # 初始化日志数据
        log_data = {
            'operation_type': operation_type,
            'operation_desc': operation_desc,
            'username': '系统',  # 后续可以从请求中获取当前登录用户
            'status': 'success',
            'request_url': path,
            'request_method': method,
            'ip_address': client_host,
            'user_agent': user_agent,
        }
        
        error_message = None
        response = None
        
        try:
            # 执行请求
            response = await call_next(request)
            
            # 检查响应状态码
            if response.status_code >= 400:
                log_data['status'] = 'failed'
                error_message = f'HTTP {response.status_code}'
            
            return response
            
        except Exception as e:
            log_data['status'] = 'failed'
            error_message = str(e)
            raise
        finally:
            # 记录操作日志到数据库
            try:
                db = SessionLocal()
                log_entry = OperationLog(**log_data)
                if error_message:
                    log_entry.error_message = error_message
                db.add(log_entry)
                db.commit()
            except Exception as log_error:
                print(f'记录操作日志失败: {log_error}')
                db.rollback()
            finally:
                db.close()


# 提供一个装饰器函数，用于手动标记需要记录日志的函数
def log_operation(operation_type: str, operation_desc: str):
    """
    操作日志装饰器
    用于手动标记需要记录日志的函数
    
    Args:
        operation_type: 操作类型
        operation_desc: 操作描述
    """
    def decorator(func):
        func._operation_type = operation_type
        func._operation_desc = operation_desc
        return func
    return decorator
