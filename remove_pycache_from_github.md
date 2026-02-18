# 从 GitHub 仓库中删除 __pycache__ 文件夹

## 问题描述

__pycache__ 文件夹已经被上传到 GitHub 仓库中，需要从仓库中删除这些文件。

## 解决方案

### 方法 1: 使用 Git 命令删除（推荐）

1. **打开命令提示符或 PowerShell**，进入项目目录：

   ```bash
   cd d:\develop\TraeWorkspace\DTN_Tool
   ```

2. **删除本地的 __pycache__ 文件夹**（如果存在）：

   ```bash
   # Windows PowerShell 命令
   Remove-Item -Recurse -Force __pycache__ 2>$null
   Remove-Item -Recurse -Force app\__pycache__ 2>$null
   Remove-Item -Recurse -Force app\models\__pycache__ 2>$null
   Remove-Item -Recurse -Force app\routes\__pycache__ 2>$null
   Remove-Item -Recurse -Force app\schemas\__pycache__ 2>$null
   ```

3. **从 Git 中移除 __pycache__ 文件夹**：

   ```bash
   # 移除所有 __pycache__ 文件夹
   git rm -r --cached **/__pycache__
   git rm -r --cached **/*.pyc
   ```

4. **提交更改**：

   ```bash
   git commit -m "Remove __pycache__ folders and .pyc files"
   ```

5. **推送到 GitHub**：

   ```bash
   git push origin main
   ```

### 方法 2: 通过 GitHub 网页界面删除

1. **打开 GitHub 仓库**：https://github.com/b1414925013/DTN_Tool

2. **导航到 __pycache__ 文件夹**，点击文件夹名称进入

3. **点击右上角的 "Delete" 按钮**

4. **输入提交信息**，例如 "Remove __pycache__ folder"

5. **点击 "Commit changes" 按钮**

6. **重复上述步骤**，删除所有 __pycache__ 文件夹

## 防止 __pycache__ 文件夹再次被上传

我们已经创建了 `.gitignore` 文件，其中包含了对 __pycache__ 文件夹的忽略规则。确保这个文件被正确提交到仓库中：

```bash
git add .gitignore
git commit -m "Add .gitignore file"
git push origin main
```

这样，Git 就会自动忽略所有 __pycache__ 文件夹和 .pyc 文件，不会将它们提交到仓库中。

## 验证

执行完上述步骤后，打开 GitHub 仓库页面，确认 __pycache__ 文件夹已经被删除。