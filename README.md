# Auto_Tool 后台管理系统

一个基于 FastAPI 和 Bootstrap 5 开发的后台管理系统，用于管理图数据库密码和用户信息。

## 技术栈

- **后端**: FastAPI + Python 3.8
- **数据库**: MySQL
- **前端**: Bootstrap 5 + jQuery
- **ORM**: SQLAlchemy
- **认证**: JWT
- **密码加密**: bcrypt

## 项目结构

```
Auto_Tool/
├── app/
│   ├── routes/         # API 路由
│   │   ├── common.py   # 公共路由
│   │   ├── dtn.py      # DTN 相关路由
│   │   └── system.py   # 系统管理路由
│   ├── models/         # 数据模型
│   │   ├── graph_db_password.py  # 图数据库密码模型
│   │   └── user.py     # 用户模型
│   ├── schemas/        # Pydantic 模型
│   │   ├── graph_db_password.py  # 图数据库密码 schema
│   │   └── user.py     # 用户 schema
│   └── database.py     # 数据库配置
├── frontend/           # 前端代码
│   ├── index.html      # 主页面
│   ├── pages/          # 子页面
│   │   ├── graph-db-password.html  # 图数据库密码管理页面
│   │   └── user-management.html    # 用户管理页面
│   ├── css/            # 样式文件
│   │   └── style.css   # 主样式文件
│   └── js/             # JavaScript 文件
│       ├── api.js              # API 服务
│       ├── graph-db-password.js  # 图数据库密码管理逻辑
│       └── user-management.js    # 用户管理逻辑
├── main.py             # FastAPI 应用入口
├── requirements.txt    # 依赖包列表
├── database_init.sql   # 数据库初始化脚本
├── .env                # 环境变量配置
└── README.md           # 项目说明
```

## 环境要求

- **Python**: 3.8
- **MySQL**: 5.7+

## 安装步骤

1. **克隆仓库**

   ```bash
   git clone https://github.com/b1414925013/DTN_Tool.git
   cd DTN_Tool
   ```

2. **创建虚拟环境**

   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **安装依赖**

   ```bash
   pip install -r requirements.txt
   ```

4. **配置环境变量**

   复制 `.env` 文件并修改配置：

   ```bash
   # 数据库连接信息
   DATABASE_URL="mysql+mysqlconnector://用户名:密码@localhost:3306/数据库名"

   # JWT 密钥
   SECRET_KEY="your-secret-key"

   # 应用配置
   APP_NAME="Auto_Tool"
   APP_VERSION="1.0.0"
   ```

5. **初始化数据库**

   运行 `database_init.sql` 脚本创建数据库和表结构：

   ```bash
   mysql -u 用户名 -p < database_init.sql
   ```

6. **启动应用**

   ```bash
   python main.py
   ```

   应用将在 `http://localhost:8000` 启动。

## 功能特性

### 1. 图数据库密码管理

- 查看所有图数据库密码
- 添加新的图数据库密码
- 编辑现有图数据库密码
- 删除图数据库密码

### 2. 用户管理

- 查看所有用户
- 添加新用户
- 编辑现有用户
- 删除用户
- 用户密码加密存储

### 3. 系统特性

- 响应式设计，支持移动端
- 模块化前端架构，按需加载页面
- 完善的错误处理
- 实时通知系统

## API 文档

启动应用后，可以访问以下地址查看 API 文档：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 开发指南

### 后端开发

1. **添加新路由**：在 `app/routes/` 目录下创建新的路由文件
2. **添加新模型**：在 `app/models/` 目录下创建新的数据模型
3. **添加新 Schema**：在 `app/schemas/` 目录下创建新的 Pydantic 模型

### 前端开发

1. **添加新页面**：在 `frontend/pages/` 目录下创建新的 HTML 页面
2. **添加页面逻辑**：在 `frontend/js/` 目录下创建对应的 JavaScript 文件
3. **修改样式**：在 `frontend/css/style.css` 文件中添加或修改样式

## 部署

### 生产环境部署

1. **使用 Gunicorn 作为 WSGI 服务器**

   ```bash
   pip install gunicorn
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```

2. **使用 Nginx 作为反向代理**

   配置 Nginx 转发请求到 Gunicorn 服务器。

## 注意事项

1. **Python 版本**：本项目要求 Python 3.8 版本
2. **数据库配置**：需要在 `.env` 文件中正确配置数据库连接信息
3. **生产环境**：生产环境中应修改 CORS 配置，限制允许的源
4. **安全**：生产环境中应使用强密钥并定期更新

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

- 项目地址：https://github.com/b1414925013/DTN_Tool