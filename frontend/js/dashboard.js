/**
 * 首页仪表盘功能模块
 * 负责加载和显示动态统计数据
 */

/**
 * 初始化首页仪表盘
 */
function initDashboardPage() {
    console.log('初始化首页仪表盘...');
    
    // 加载统计数据
    loadDashboardStats();
    
    // 加载系统信息
    loadSystemInfo();
    
    // 加载操作日志
    loadOperationLogs();
}

/**
 * 加载仪表盘统计数据
 */
async function loadDashboardStats() {
    try {
        const response = await fetch('/api/common/dashboard/stats');
        const result = await response.json();
        
        if (result.success) {
            updateDashboardStats(result.data);
        } else {
            console.error('获取统计数据失败:', result.message);
            showNotification('获取统计数据失败', 'danger');
        }
    } catch (error) {
        console.error('加载统计数据时出错:', error);
        showNotification('加载统计数据时出错', 'danger');
    }
}

/**
 * 更新仪表盘统计数据显示
 * @param {Object} stats - 统计数据对象
 */
function updateDashboardStats(stats) {
    // 更新系统状态
    const systemStatusEl = document.getElementById('system-status');
    if (systemStatusEl) {
        systemStatusEl.textContent = stats.system_status;
    }
    
    // 更新图数据库数量
    const graphDbCountEl = document.getElementById('graph-db-count');
    if (graphDbCountEl) {
        graphDbCountEl.textContent = `${stats.graph_db_count} 个连接`;
    }
    
    // 更新用户数量
    const userCountEl = document.getElementById('user-count');
    if (userCountEl) {
        userCountEl.textContent = `${stats.user_count} 位用户`;
    }
    
    // 更新最近活动时间
    const lastActivityEl = document.getElementById('last-activity');
    if (lastActivityEl) {
        lastActivityEl.textContent = formatLastActivity(stats.last_activity);
    }
}

/**
 * 加载系统详细信息
 */
async function loadSystemInfo() {
    try {
        const response = await fetch('/api/common/dashboard/system-info');
        const result = await response.json();
        
        if (result.success) {
            updateSystemInfo(result.data);
        } else {
            console.error('获取系统信息失败:', result.message);
            showNotification('获取系统信息失败', 'danger');
        }
    } catch (error) {
        console.error('加载系统信息时出错:', error);
        showNotification('加载系统信息时出错', 'danger');
    }
}

/**
 * 更新系统信息显示
 * @param {Object} info - 系统信息对象
 */
function updateSystemInfo(info) {
    // 系统版本
    const appVersionEl = document.getElementById('app-version');
    if (appVersionEl) {
        appVersionEl.textContent = info.app_version;
    }
    
    // Python 版本
    const pythonVersionEl = document.getElementById('python-version');
    if (pythonVersionEl) {
        pythonVersionEl.textContent = info.python_version;
    }
    
    // FastAPI 版本
    const fastapiVersionEl = document.getElementById('fastapi-version');
    if (fastapiVersionEl) {
        fastapiVersionEl.textContent = info.fastapi_version;
    }
    
    // 数据库状态
    const dbStatusEl = document.getElementById('db-status');
    if (dbStatusEl) {
        dbStatusEl.textContent = info.db_status;
        // 移除旧的颜色类，添加新的
        dbStatusEl.classList.remove('text-success', 'text-danger', 'text-warning');
        dbStatusEl.classList.add(info.db_status_color);
    }
    
    // 最后更新
    const lastUpdateEl = document.getElementById('last-update');
    if (lastUpdateEl) {
        lastUpdateEl.textContent = info.last_update;
    }
}

/**
 * 格式化最近活动时间显示
 * @param {string} timeStr - 时间字符串
 * @returns {string} 格式化后的时间显示
 */
function formatLastActivity(timeStr) {
    if (!timeStr || timeStr === '-') {
        return '-';
    }
    
    try {
        const now = new Date();
        const activityTime = new Date(timeStr);
        const diffMs = now - activityTime;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMinutes < 1) {
            return '刚刚';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} 分钟前`;
        } else if (diffHours < 24) {
            return `${diffHours} 小时前`;
        } else if (diffDays < 7) {
            return `${diffDays} 天前`;
        } else {
            return timeStr.split(' ')[0];
        }
    } catch (error) {
        return timeStr;
    }
}

/**
 * 加载操作日志
 */
async function loadOperationLogs() {
    try {
        const response = await fetch('/api/common/operation-logs?limit=10');
        const logs = await response.json();
        
        if (logs && logs.length > 0) {
            updateOperationLogs(logs);
        } else {
            const tbody = document.getElementById('activity-tbody');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center text-muted">暂无操作记录</td>
                    </tr>
                `;
            }
        }
    } catch (error) {
        console.error('加载操作日志时出错:', error);
        showNotification('加载操作日志时出错', 'danger');
    }
}

/**
 * 更新操作日志显示
 * @param {Array} logs - 操作日志数组
 */
function updateOperationLogs(logs) {
    const tbody = document.getElementById('activity-tbody');
    if (!tbody) {
        return;
    }
    
    let html = '';
    for (const log of logs) {
        const formattedTime = formatOperationTime(log.created_at);
        const statusBadge = getStatusBadge(log.status);
        
        html += `
            <tr>
                <td>${formattedTime}</td>
                <td>${escapeHtml(log.operation_desc)}</td>
                <td>${escapeHtml(log.username || '系统')}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }
    
    tbody.innerHTML = html;
}

/**
 * 格式化操作时间显示
 * @param {string} timeStr - 时间字符串
 * @returns {string} 格式化后的时间
 */
function formatOperationTime(timeStr) {
    if (!timeStr) {
        return '-';
    }
    
    try {
        const date = new Date(timeStr);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return timeStr;
    }
}

/**
 * 获取状态徽章
 * @param {string} status - 状态
 * @returns {string} HTML徽章
 */
function getStatusBadge(status) {
    const statusMap = {
        'success': '<span class="badge bg-success">成功</span>',
        'failed': '<span class="badge bg-danger">失败</span>',
        'warning': '<span class="badge bg-warning">警告</span>'
    };
    return statusMap[status] || '<span class="badge bg-secondary">未知</span>';
}

/**
 * HTML转义，防止XSS
 * @param {string} str - 字符串
 * @returns {string} 转义后的字符串
 */
function escapeHtml(str) {
    if (!str) {
        return '';
    }
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * 显示通知消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, danger, warning, info)
 */
function showNotification(message, type = 'info') {
    console.log(`[${type}] ${message}`);
}

// 导出模块
export { initDashboardPage };
