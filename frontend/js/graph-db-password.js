// 图数据库密码管理页面脚本
import { GraphDBPasswordApi, Utils } from './api.js';

// 初始化图数据库密码页面
export async function initGraphDBPasswordPage() {
    // 加载密码数据
    await loadPasswords();

    // 绑定新增密码按钮事件
    $('#add-password-btn').on('click', function() {
        resetPasswordForm();
        $('#password-modal-label').text('新增图数据库密码');
        $('#password-modal').modal('show');
    });

    // 绑定保存密码按钮事件
    $('#save-password-btn').on('click', function() {
        savePassword();
    });

    // 绑定搜索按钮事件
    $('#search-btn').on('click', function() {
        searchPasswords();
    });

    // 绑定搜索输入框回车事件
    $('#search-input').on('keypress', function(e) {
        if (e.which === 13) {
            searchPasswords();
        }
    });
}

// 加载图数据库密码数据
async function loadPasswords() {
    // 显示加载动画
    $('#password-table-body').html(`
        <tr>
            <td colspan="6" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">加载中...</span>
                </div>
                <span class="ml-2 text-muted">加载中...</span>
            </td>
        </tr>
    `);
    
    try {
        const data = await GraphDBPasswordApi.getAll();
        renderPasswordTable(data);
    } catch (error) {
        console.error('Error loading passwords:', error);
        $('#password-table-body').html(`
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="alert alert-danger d-inline-block">
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        加载失败，请检查网络连接或服务器状态
                    </div>
                    <button class="btn btn-primary mt-2" onclick="loadPasswords()">
                        <i class="fas fa-sync-alt mr-1"></i> 重试
                    </button>
                </td>
            </tr>
        `);
    }
}

// 渲染密码表格
function renderPasswordTable(passwords) {
    let html = '';
    
    if (passwords.length === 0) {
        html = '<tr><td colspan="6" class="text-center py-4">暂无数据</td></tr>';
    } else {
        passwords.forEach(password => {
            html += `
                <tr>
                    <td>${password.id}</td>
                    <td>${password.environment}</td>
                    <td>${password.password}</td>
                    <td>${password.description || '-'}</td>
                    <td>${Utils.formatDateTime(password.created_at)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary mr-1" onclick="editPassword(${password.id})"><i class="fas fa-edit"></i> 编辑</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deletePassword(${password.id})"><i class="fas fa-trash"></i> 删除</button>
                    </td>
                </tr>
            `;
        });
    }
    
    $('#password-table-body').html(html);
}

// 重置密码表单
function resetPasswordForm() {
    $('#password-form')[0].reset();
    $('#password-id').val('');
}

// 编辑密码
async function editPassword(id) {
    try {
        const password = await GraphDBPasswordApi.getById(id);
        $('#password-id').val(password.id);
        $('#environment').val(password.environment);
        $('#password').val(password.password);
        $('#description').val(password.description || '');
        $('#password-modal-label').text('编辑图数据库密码');
        $('#password-modal').modal('show');
    } catch (error) {
        console.error('Error loading password:', error);
        Utils.showAlert('加载密码信息失败', 'danger');
    }
}

// 保存密码
async function savePassword() {
    const id = $('#password-id').val();
    const environment = $('#environment').val();
    const password = $('#password').val();
    const description = $('#description').val();

    if (!environment || !password) {
        Utils.showAlert('请填写必填字段', 'warning');
        return;
    }

    const data = {
        environment: environment,
        password: password,
        description: description
    };

    // 禁用保存按钮并显示加载状态
    const saveBtn = $('#save-password-btn');
    const originalText = saveBtn.html();
    saveBtn.prop('disabled', true).html(`
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        保存中...
    `);

    try {
        if (id) {
            await GraphDBPasswordApi.update(id, data);
            Utils.showAlert('密码更新成功', 'success');
        } else {
            await GraphDBPasswordApi.create(data);
            Utils.showAlert('密码新增成功', 'success');
        }
        $('#password-modal').modal('hide');
        await loadPasswords();
    } catch (error) {
        console.error('Error saving password:', error);
        Utils.showAlert('保存失败，请重试', 'danger');
    } finally {
        // 恢复保存按钮状态
        saveBtn.prop('disabled', false).html(originalText);
    }
}

// 删除密码
async function deletePassword(id) {
    if (confirm('确定要删除这个密码吗？')) {
        // 显示加载状态
        const row = $(`button[onclick="deletePassword(${id})"]`).closest('tr');
        const originalContent = row.html();
        row.html(`
            <td colspan="6" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">删除中...</span>
                </div>
                <span class="ml-2 text-muted">删除中...</span>
            </td>
        `);
        
        try {
            await GraphDBPasswordApi.delete(id);
            await loadPasswords();
            Utils.showAlert('密码删除成功', 'success');
        } catch (error) {
            console.error('Error deleting password:', error);
            row.html(originalContent);
            Utils.showAlert('删除失败，请重试', 'danger');
        }
    }
}

// 搜索密码
function searchPasswords() {
    const searchTerm = $('#search-input').val().toLowerCase();
    const rows = $('#password-table-body tr');
    
    rows.each(function() {
        const environment = $(this).find('td:eq(1)').text().toLowerCase();
        const description = $(this).find('td:eq(3)').text().toLowerCase();
        
        if (environment.includes(searchTerm) || description.includes(searchTerm)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

// 暴露全局函数
window.loadPasswords = loadPasswords;
window.editPassword = editPassword;
window.deletePassword = deletePassword;
