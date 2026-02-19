-- 创建数据库
CREATE DATABASE IF NOT EXISTS dtn_tool CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE dtn_tool;

-- 创建图数据库密码表
CREATE TABLE IF NOT EXISTS graph_db_passwords (
    id INT PRIMARY KEY AUTO_INCREMENT,
    environment VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_environment (environment)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_username (username),
    UNIQUE KEY idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入模拟数据：图数据库密码
INSERT INTO graph_db_passwords (environment, password, description) VALUES
('开发环境', 'dev_password_123', '开发环境图数据库密码'),
('测试环境', 'test_password_456', '测试环境图数据库密码'),
('预发环境', 'staging_password_789', '预发环境图数据库密码'),
('生产环境', 'prod_password_000', '生产环境图数据库密码')
ON DUPLICATE KEY UPDATE
    password = VALUES(password),
    description = VALUES(description),
    updated_at = CURRENT_TIMESTAMP;

-- 插入模拟数据：用户（密码哈希为 '123456' 的 bcrypt 加密结果）
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@example.com', '$2b$12$Jl5xQPsCcxu5BfI/MLLDAuy2rD8aywy2DZzNSe4NbBCjHWi3NIuOu', '系统管理员', 'admin'),
('user', 'user@example.com', '$2b$12$PafoqN4HZllv1DfifOnUzu.kpWZ5YCgnwD3FQRbsoTI.eAGcfiaMW', '测试用户', 'user')
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    password_hash = VALUES(password_hash),
    full_name = VALUES(full_name),
    role = VALUES(role),
    updated_at = CURRENT_TIMESTAMP;

-- 创建操作日志表
CREATE TABLE IF NOT EXISTS operation_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    operation_type VARCHAR(50) NOT NULL,
    operation_desc VARCHAR(255) NOT NULL,
    username VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'success',
    request_url VARCHAR(255),
    request_method VARCHAR(10),
    ip_address VARCHAR(50),
    user_agent VARCHAR(255),
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_operation_type (operation_type),
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入模拟数据：操作日志
INSERT INTO operation_logs (operation_type, operation_desc, username, status, created_at) VALUES
('登录', '系统登录', '管理员', 'success', DATE_SUB(NOW(), INTERVAL 75 MINUTE)),
('查询', '查看图数据库密码列表', '管理员', 'success', DATE_SUB(NOW(), INTERVAL 60 MINUTE)),
('创建', '添加图数据库密码', '管理员', 'success', DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
('查询', '查看用户列表', '管理员', 'success', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
('更新', '更新用户信息', '管理员', 'success', DATE_SUB(NOW(), INTERVAL 15 MINUTE));

-- 查询数据验证
SELECT '图数据库密码表数据' AS table_name;
SELECT * FROM graph_db_passwords;

SELECT '用户表数据' AS table_name;
SELECT id, username, email, full_name, role, created_at FROM users;

SELECT '操作日志表数据' AS table_name;
SELECT * FROM operation_logs ORDER BY created_at DESC;