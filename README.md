# DTN_Tool 后台管理系统

一个基于 FastAPI 和 Bootstrap 5 开发的功能完善的后台管理系统，提供图数据库密码管理、用户管理、操作日志记录、公共工具等功能。

## 技术栈

- **后端**: FastAPI + Python 3.8
- **数据库**: MySQL
- **前端**: Bootstrap 5 + jQuery
- **ORM**: SQLAlchemy
- **认证**: JWT
- **密码加密**: bcrypt
- **AOP 中间件**: FastAPI 自定义中间件

## 项目结构

```
DTN_Tool/
├── app/
│   ├── middleware/       # 中间件
│   │   ├── __init__.py
│   │   └── operation_log.py  # 操作日志 AOP 中间件
│   ├── routes/           # API 路由
│   │   ├── common.py     # 公共路由（仪表盘、操作日志、工具）
│   │   ├── dtn.py        # DTN 相关路由
│   │   └── system.py     # 系统管理路由
│   ├── models/           # 数据模型
│   │   ├── graph_db_password.py  # 图数据库密码模型
│   │   ├── operation_log.py       # 操作日志模型
│   │   └── user.py                 # 用户模型
│   ├── schemas/          # Pydantic 模型
│   │   ├── graph_db_password.py
│   │   ├── operation_log.py
│   │   └── user.py
│   └── database.py       # 数据库配置
├── frontend/             # 前端代码
│   ├── index.html        # 主页面
│   ├── pages/            # 子页面
│   │   ├── dashboard.html        # 首页仪表盘
│   │   ├── login.html            # 登录页面
│   │   ├── graph-db-password.html  # 图数据库密码管理
│   │   ├── user-management.html    # 用户管理
│   │   ├── common-tools.html       # 公共工具
│   │   └── custom-tools.html       # 自定义工具
│   ├── css/              # 样式文件
│   │   └── style.css
│   └── js/               # JavaScript 文件
│       ├── api.js
│       ├── dashboard.js
│       ├── login.js
│       ├── graph-db-password.js
│       ├── user-management.js
│       ├── common-tools.js
│       └── custom-tools.js
├── main.py               # FastAPI 应用入口
├── requirements.txt      # 依赖包列表
├── database_init.sql     # 数据库初始化脚本
├── .env                  # 环境变量配置
├── .gitignore
└── README.md             # 项目说明
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
   python -m venv .venv
   .venv\Scripts\activate

   # Linux/Mac
   python3 -m venv .venv
   source .venv/bin/activate
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
   APP_NAME="DTN_Tool"
   APP_VERSION="1.0.0"
   ```

5. **初始化数据库**

   运行 `database_init.sql` 脚本创建数据库和表结构：

   ```bash
   mysql -u 用户名 -p < database_init.sql
   ```

   该脚本会创建：
   - `graph_db_passwords` 表（图数据库密码）
   - `users` 表（用户）
   - `operation_logs` 表（操作日志）
   - 并插入示例数据

6. **启动应用**

   ```bash
   python main.py
   ```

   应用将在 `http://localhost:8000` 启动。

## 功能特性

### 1. 首页仪表盘

- 实时显示系统状态
- 统计用户数量、图数据库密码数量
- 最近操作日志展示
- 系统详细信息展示

### 2. 图数据库密码管理

- 查看所有图数据库密码
- 添加新的图数据库密码
- 编辑现有图数据库密码
- 删除图数据库密码

### 3. 用户管理

- 查看所有用户
- 添加新用户
- 编辑现有用户
- 删除用户
- 用户密码加密存储（bcrypt）

### 4. 操作日志系统

- **AOP 中间件自动记录**：所有 API 操作自动记录到数据库
- 记录信息包括：操作类型、操作描述、用户、状态、请求 URL、请求方法、IP 地址、User-Agent、错误信息、时间戳
- 首页实时展示最近操作日志
- 支持查询操作日志列表

### 5. 公共工具

- **变量命名转换工具**：支持多种命名格式互相转换
  - 驼峰命名法 (camelCase)
  - 帕斯卡命名法 (PascalCase)
  - 下划线+小写 (snake_case)
  - 下划线+大写 (SNAKE_CASE)
  - 包名格式 (package.name)
  - 中横线+小写 (kebab-case)

### 6. 自定义工具

- **自定义长耗时任务**：支持配置参数执行长时间任务

### 7. 系统特性

- 响应式设计，支持移动端
- 模块化前端架构，按需加载页面
- 完善的错误处理
- 实时通知系统
- 左侧导航栏，支持多级菜单

## API 文档

启动应用后，可以访问以下地址查看 API 文档：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 主要 API 端点

#### 公共接口 (`/api/common`)

- `GET /api/common/health` - 健康检查
- `GET /api/common/info` - 获取系统信息
- `GET /api/common/dashboard/stats` - 获取仪表盘统计数据
- `GET /api/common/dashboard/system-info` - 获取系统详细信息
- `GET /api/common/operation-logs` - 获取操作日志列表
- `POST /api/common/custom-task` - 自定义长耗时任务

#### DTN 接口 (`/api/dtn`)

- `GET /api/dtn/graph-db-passwords` - 获取图数据库密码列表
- `POST /api/dtn/graph-db-passwords` - 创建图数据库密码
- `GET /api/dtn/graph-db-passwords/{id}` - 获取图数据库密码详情
- `PUT /api/dtn/graph-db-passwords/{id}` - 更新图数据库密码
- `DELETE /api/dtn/graph-db-passwords/{id}` - 删除图数据库密码

#### 系统管理接口 (`/api/system`)

- `GET /api/system/users` - 获取用户列表
- `POST /api/system/users` - 创建用户
- `GET /api/system/users/{id}` - 获取用户详情
- `PUT /api/system/users/{id}` - 更新用户
- `DELETE /api/system/users/{id}` - 删除用户
- `POST /api/system/login` - 用户登录

## 开发指南

### 后端开发

1. **添加新路由**：在 `app/routes/` 目录下创建新的路由文件
2. **添加新模型**：在 `app/models/` 目录下创建新的数据模型
3. **添加新 Schema**：在 `app/schemas/` 目录下创建新的 Pydantic 模型
4. **添加新中间件**：在 `app/middleware/` 目录下创建中间件

#### 操作日志中间件使用

系统已内置操作日志中间件，会自动记录 API 操作。如需自定义操作描述，可修改 `app/middleware/operation_log.py` 中的 `OPERATION_DESC_MAP` 字典：

```python
OPERATION_DESC_MAP = {
    '/api/your-path': {
        'GET': '查询操作',
        'POST': '创建操作',
    },
}
```

### 前端开发

1. **添加新页面**：在 `frontend/pages/` 目录下创建新的 HTML 页面
2. **添加页面逻辑**：在 `frontend/js/` 目录下创建对应的 JavaScript 文件
3. **修改样式**：在 `frontend/css/style.css` 文件中添加或修改样式
4. **在 `index.html` 中注册页面**：添加新页面到菜单和路由配置

## 部署

### 生产环境部署

1. **使用 Gunicorn 作为 WSGI 服务器**

   ```bash
   pip install gunicorn
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```

2. **使用 Nginx 作为反向代理**

   配置 Nginx 转发请求到 Gunicorn 服务器：

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

## 注意事项

1. **Python 版本**：本项目要求 Python 3.8 版本
2. **数据库配置**：需要在 `.env` 文件中正确配置数据库连接信息
3. **生产环境**：生产环境中应修改 CORS 配置，限制允许的源
4. **安全**：生产环境中应使用强密钥并定期更新
5. **操作日志**：系统会自动记录所有 API 操作，避免循环记录（操作日志查询接口本身不被记录）

## 常见问题

### Q: 如何重置数据库？

A: 删除数据库后重新运行 `database_init.sql` 脚本：

```bash
mysql -u 用户名 -p -e "DROP DATABASE IF EXISTS dtn_tool;"
mysql -u 用户名 -p < database_init.sql
```

### Q: 如何修改中间件记录的操作？

A: 编辑 `app/middleware/operation_log.py` 中的 `OPERATION_DESC_MAP` 字典，添加或修改路径和操作描述的映射。

### Q: 如何添加新的公共工具？

A: 在 `frontend/pages/common-tools.html` 中添加新工具的 HTML 结构，并在 `frontend/js/common-tools.js` 中添加对应的 JavaScript 逻辑。

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

- 项目地址：https://github.com/b1414925013/DTN_Tool
