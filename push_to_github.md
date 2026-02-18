# 手动将项目推送到 GitHub 步骤

由于 GitHub MCP 工具遇到认证问题，以下是手动将项目推送到 GitHub 的详细步骤：

## 步骤 1: 初始化 Git 仓库

打开命令提示符或 PowerShell，进入项目目录：

```bash
cd d:\develop\TraeWorkspace\DTN_Tool
```

初始化 Git 仓库：

```bash
git init
```

## 步骤 2: 添加文件到暂存区

```bash
git add .
```

## 步骤 3: 提交文件

```bash
git commit -m "Initial commit: Auto_Tool backend management system"
```

## 步骤 4: 添加远程仓库

```bash
git remote add origin https://github.com/b1414925013/DTN_Tool.git
```

## 步骤 5: 推送代码到 GitHub

```bash
git push -u origin main
```

## 步骤 6: 验证推送结果

打开浏览器访问 https://github.com/b1414925013/DTN_Tool 查看项目是否成功推送。

## 注意事项

1. 如果遇到权限错误，请确保您的 GitHub 账户有权限访问该仓库
2. 如果提示需要输入用户名和密码，请使用 GitHub 用户名和个人访问令牌（而非密码）
3. 如果仓库已经存在且有内容，可能需要先拉取最新代码再推送：
   ```bash
   git pull origin main --rebase
   git push -u origin main
   ```

## 项目结构

推送的项目包含以下主要文件和目录：

- `main.py` - FastAPI 应用入口点
- `app/` - 应用代码目录
  - `routes/` - API 路由
  - `models/` - 数据模型
  - `schemas/` - Pydantic 模型
  - `database.py` - 数据库配置
- `frontend/` - 前端代码目录
  - `index.html` - 主页面
  - `pages/` - 子页面
  - `css/` - 样式文件
  - `js/` - JavaScript 文件
- `requirements.txt` - 依赖包列表
- `.env` - 环境变量配置
- `database_init.sql` - 数据库初始化脚本