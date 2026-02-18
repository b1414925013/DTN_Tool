// API 基础 URL
const API_BASE_URL = 'http://localhost:8000/api';
const PAGES_BASE_URL = '/frontend/pages';

// API 请求封装
class ApiService {
    /**
     * 发送 GET 请求
     * @param {string} endpoint - API 端点
     * @returns {Promise<any>} - 返回数据
     */
    static async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('GET request error:', error);
            throw error;
        }
    }
    
    /**
     * 发送 POST 请求
     * @param {string} endpoint - API 端点
     * @param {object} data - 请求数据
     * @returns {Promise<any>} - 返回数据
     */
    static async post(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('POST request error:', error);
            throw error;
        }
    }
    
    /**
     * 发送 PUT 请求
     * @param {string} endpoint - API 端点
     * @param {object} data - 请求数据
     * @returns {Promise<any>} - 返回数据
     */
    static async put(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('PUT request error:', error);
            throw error;
        }
    }
    
    /**
     * 发送 DELETE 请求
     * @param {string} endpoint - API 端点
     * @returns {Promise<void>}
     */
    static async delete(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('DELETE request error:', error);
            throw error;
        }
    }
}

// 图数据库密码相关 API
export const GraphDBPasswordApi = {
    /**
     * 获取所有图数据库密码
     * @param {number} skip - 跳过的记录数
     * @param {number} limit - 返回的记录数
     * @returns {Promise<any[]>} - 密码列表
     */
    getAll: async (skip = 0, limit = 100) => {
        return await ApiService.get(`/dtn/graph-db-passwords?skip=${skip}&limit=${limit}`);
    },
    
    /**
     * 获取图数据库密码总数
     * @returns {Promise<number>} - 密码总数
     */
    getTotalCount: async () => {
        // 由于后端没有提供获取总数的API，我们通过获取所有记录来计算总数
        // 在实际生产环境中，应该添加一个专门的API来获取总数
        const allPasswords = await ApiService.get('/dtn/graph-db-passwords?skip=0&limit=1000');
        return allPasswords.length;
    },
    
    /**
     * 根据 ID 获取图数据库密码
     * @param {number} id - 密码 ID
     * @returns {Promise<any>} - 密码信息
     */
    getById: async (id) => {
        return await ApiService.get(`/dtn/graph-db-passwords/${id}`);
    },
    
    /**
     * 创建图数据库密码
     * @param {object} password - 密码信息
     * @returns {Promise<any>} - 创建的密码信息
     */
    create: async (password) => {
        return await ApiService.post('/dtn/graph-db-passwords', password);
    },
    
    /**
     * 更新图数据库密码
     * @param {number} id - 密码 ID
     * @param {object} password - 密码信息
     * @returns {Promise<any>} - 更新后的密码信息
     */
    update: async (id, password) => {
        return await ApiService.put(`/dtn/graph-db-passwords/${id}`, password);
    },
    
    /**
     * 删除图数据库密码
     * @param {number} id - 密码 ID
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        return await ApiService.delete(`/dtn/graph-db-passwords/${id}`);
    }
};

// 用户相关 API
export const UserApi = {
    /**
     * 获取所有用户
     * @param {number} skip - 跳过的记录数
     * @param {number} limit - 返回的记录数
     * @returns {Promise<any[]>} - 用户列表
     */
    getAll: async (skip = 0, limit = 100) => {
        return await ApiService.get(`/system/users?skip=${skip}&limit=${limit}`);
    },
    
    /**
     * 获取用户总数
     * @returns {Promise<number>} - 用户总数
     */
    getTotalCount: async () => {
        // 由于后端没有提供获取总数的API，我们通过获取所有记录来计算总数
        // 在实际生产环境中，应该添加一个专门的API来获取总数
        const allUsers = await ApiService.get('/system/users?skip=0&limit=1000');
        return allUsers.length;
    },
    
    /**
     * 根据 ID 获取用户
     * @param {number} id - 用户 ID
     * @returns {Promise<any>} - 用户信息
     */
    getById: async (id) => {
        return await ApiService.get(`/system/users/${id}`);
    },
    
    /**
     * 创建用户
     * @param {object} user - 用户信息
     * @returns {Promise<any>} - 创建的用户信息
     */
    create: async (user) => {
        return await ApiService.post('/system/users', user);
    },
    
    /**
     * 更新用户
     * @param {number} id - 用户 ID
     * @param {object} user - 用户信息
     * @returns {Promise<any>} - 更新后的用户信息
     */
    update: async (id, user) => {
        return await ApiService.put(`/system/users/${id}`, user);
    },
    
    /**
     * 删除用户
     * @param {number} id - 用户 ID
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        return await ApiService.delete(`/system/users/${id}`);
    },
    
    /**
     * 用户登录
     * @param {object} credentials - 登录凭证
     * @returns {Promise<any>} - 登录结果
     */
    login: async (credentials) => {
        return await ApiService.post('/system/login', credentials);
    }
};

// 工具函数
export const Utils = {
    /**
     * 格式化日期时间
     * @param {string} dateTimeString - 日期时间字符串
     * @returns {string} - 格式化后的日期时间
     */
    formatDateTime: (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    },
    
    /**
     * 显示提示信息
     * @param {string} message - 提示信息
     * @param {string} type - 提示类型 (success, danger, warning, info)
     */
    showAlert: (message, type = 'info') => {
        const alertDiv = $(`<div class="alert alert-${type} position-fixed top-0 end-0 m-4 z-500" style="z-index: 9999;" role="alert">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'danger' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'} mr-2"></i>
            ${message}
        </div>`);
        $('body').append(alertDiv);
        setTimeout(() => alertDiv.fadeOut(), 3000);
    },
    
    /**
     * 加载页面
     * @param {string} pageName - 页面名称
     */
    loadPage: (pageName) => {
        // 显示加载动画
        $('#content-container').html(`
            <div class="page-loading">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">加载中...</span>
                </div>
            </div>
        `);

        // 根据页面名称设置页面标题
        const pageTitles = {
            'dashboard': '首页',
            'graph-db-password': '图数据库密码管理',
            'user-management': '用户管理'
        };

        // 更新页面标题
        $('#page-title').text(pageTitles[pageName] || 'Auto_Tool 后台管理系统');

        // 加载对应的页面文件
        $.ajax({
            url: `/frontend/pages/${pageName}.html`,
            method: 'GET',
            dataType: 'html',
            success: function(html) {
                // 将页面内容加载到容器中
                $('#content-container').html(html);
                
                // 执行页面特定的初始化函数
                window.initPage(pageName);
            },
            error: function(xhr, status, error) {
                console.error(`Error loading page ${pageName}:`, error);
                $('#content-container').html(`
                    <div class="alert alert-danger text-center py-5">
                        <i class="fas fa-exclamation-circle fa-3x mb-3"></i>
                        <h4 class="alert-heading">页面加载失败</h4>
                        <p>无法加载页面内容，请检查网络连接或服务器状态</p>
                        <button class="btn btn-primary mt-3" onclick="Utils.loadPage('${pageName}')">
                            <i class="fas fa-sync-alt mr-1"></i> 重试
                        </button>
                    </div>
                `);
            }
        });
    }
};
