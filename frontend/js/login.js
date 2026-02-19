/**
 * 登录页面 JavaScript 模块
 */

/**
 * 初始化登录页面
 */
function initLoginPage() {
    // 检查是否已登录
    if (localStorage.getItem('token')) {
        window.location.href = '/frontend/index.html';
    }
    
    // 登录表单提交事件
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#username').val();
        const password = $('#password').val();
        
        // 显示加载状态
        $('#error-message').addClass('d-none');
        
        // 发送登录请求
        $.ajax({
            url: '/api/system/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function(response) {
                // 存储token和用户信息
                localStorage.setItem('token', response.access_token);
                localStorage.setItem('token_type', response.token_type);
                
                // 获取用户信息
                getUserInfo(response.access_token);
            },
            error: function(xhr) {
                let errorMessage = '登录失败，请检查用户名和密码';
                if (xhr.responseJSON && xhr.responseJSON.detail) {
                    errorMessage = xhr.responseJSON.detail;
                }
                $('#error-message').text(errorMessage).removeClass('d-none');
            }
        });
    });
}

/**
 * 获取用户信息
 * @param {string} token - 访问令牌
 */
function getUserInfo(token) {
    $.ajax({
        url: '/api/system/users/me',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(user) {
            // 存储用户信息
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('user_role', user.role);
            localStorage.setItem('username', user.username);
            
            // 跳转到首页
            window.location.href = '/frontend/index.html';
        },
        error: function() {
            // 如果获取用户信息失败，仍然跳转到首页
            window.location.href = '/frontend/index.html';
        }
    });
}
