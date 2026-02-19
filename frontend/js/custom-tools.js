/**
 * 自定义工具页面 JavaScript 模块
 */

/**
 * 初始化自定义工具页面
 */
function initCustomToolsPage() {
    // 绑定工具卡片点击事件
    $('.tool-card').on('click', function() {
        const toolType = $(this).data('tool');
        openToolModal(toolType);
    });
    
    // 绑定工具执行按钮点击事件
    $('#tool-execute').on('click', function() {
        const toolType = $('#tool-modal').data('tool');
        executeTool(toolType);
    });
}

/**
 * 打开工具模态框
 * @param {string} toolType - 工具类型
 */
function openToolModal(toolType) {
    let title = '';
    let content = '';
    
    switch (toolType) {
        case 'custom-task':
            title = '自定义长耗时任务';
            content = `
                <div class="form-group">
                    <label class="form-label">Base URL</label>
                    <input type="text" class="form-control" id="custom-base-url" placeholder="输入基础URL">
                </div>
                <div class="form-group">
                    <label class="form-label">Username</label>
                    <input type="text" class="form-control" id="custom-username" placeholder="输入用户名">
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" id="custom-password" placeholder="输入密码">
                </div>
                <div class="form-group">
                    <label class="form-label">其他参数（可选）</label>
                    <textarea class="form-control" id="custom-params" rows="3" placeholder="输入其他参数（JSON格式）"></textarea>
                </div>
                <div class="result-container d-none" id="custom-task-result">
                    <div class="result-title">任务结果</div>
                    <div class="result-content" id="custom-task-result-content"></div>
                </div>
            `;
            break;
    }
    
    // 设置模态框标题和内容
    $('#tool-modal-label').text(title);
    $('#tool-content').html(content);
    $('#tool-modal').data('tool', toolType);
    
    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('tool-modal'));
    modal.show();
}

/**
 * 执行工具
 * @param {string} toolType - 工具类型
 */
function executeTool(toolType) {
    switch (toolType) {
        case 'custom-task':
            executeCustomTaskTool();
            break;
    }
}

/**
 * 执行自定义长耗时任务工具
 */
function executeCustomTaskTool() {
    const baseUrl = $('#custom-base-url').val();
    const username = $('#custom-username').val();
    const password = $('#custom-password').val();
    const paramsText = $('#custom-params').val();
    
    // 验证必填字段
    if (!baseUrl || !username || !password) {
        alert('请填写Base URL、Username和Password');
        return;
    }
    
    // 解析参数
    let params = null;
    if (paramsText) {
        try {
            params = JSON.parse(paramsText);
        } catch (error) {
            alert('参数格式错误，请输入有效的JSON格式');
            return;
        }
    }
    
    // 显示加载中遮罩
    $('#loading-overlay').removeClass('d-none');
    
    // 调用后端API
    $.ajax({
        url: '/api/common/custom-task',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            base_url: baseUrl,
            username: username,
            password: password,
            params: params
        }),
        success: function(response) {
            // 隐藏加载中遮罩
            $('#loading-overlay').addClass('d-none');
            
            // 显示结果
            const result = `
任务执行完成！

响应信息:
成功: ${response.success}
消息: ${response.message}
状态: ${response.status}

输入参数:
Base URL: ${response.input_params.base_url}
Username: ${response.input_params.username}
Password: ${response.input_params.password}
Params: ${JSON.stringify(response.input_params.params, null, 2) || '无'}

执行信息:
实际耗时: ${response.execution_time}
预计时间: ${response.estimated_time}
            `.trim();
            
            $('#custom-task-result-content').text(result);
            $('#custom-task-result').removeClass('d-none');
        },
        error: function(xhr, status, error) {
            // 隐藏加载中遮罩
            $('#loading-overlay').addClass('d-none');
            
            // 显示错误
            const result = `
任务执行失败！

错误信息:
状态: ${status}
错误: ${error}
响应: ${xhr.responseText || '无'}
            `.trim();
            
            $('#custom-task-result-content').text(result);
            $('#custom-task-result').removeClass('d-none');
        }
    });
}
