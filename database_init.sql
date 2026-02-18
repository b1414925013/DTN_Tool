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
('admin', 'admin@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '系统管理员', 'admin'),
('user1', 'user1@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '测试用户1', 'user'),
('user2', 'user2@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '测试用户2', 'user')
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    password_hash = VALUES(password_hash),
    full_name = VALUES(full_name),
    role = VALUES(role),
    updated_at = CURRENT_TIMESTAMP;

-- 查询数据验证
SELECT '图数据库密码表数据' AS table_name;
SELECT * FROM graph_db_passwords;

SELECT '用户表数据' AS table_name;
SELECT id, username, email, full_name, role, created_at FROM users;