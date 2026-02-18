// 用户管理页面脚本
import { UserApi, Utils } from './api.js';

// 分页参数
let currentPage = 1;
const itemsPerPage = 10;

// 初始化用户管理页面
export async function initUserManagementPage() {
    // 加载用户数据
    await loadUsers(currentPage, itemsPerPage);

    // 绑定新增用户按钮事件
    $('#add-user-btn').on('click', function() {
        resetUserForm();
        $('#user-modal-label').text('新增用户');
        $('#user-modal').modal('show');
    });

    // 绑定保存用户按钮事件
    $('#save-user-btn').on('click', function() {
        saveUser();
    });

    // 绑定搜索按钮事件
    $('#user-search-btn').on('click', function() {
        currentPage = 1;
        searchUsers();
    });

    // 绑定搜索输入框回车事件
    $('#user-search-input').on('keypress', function(e) {
        if (e.which === 13) {
            currentPage = 1;
            searchUsers();
        }
    });
}

// 加载用户数据
async function loadUsers(page = 1, limit = 10) {
    // 显示加载动画
    $('#user-table-body').html(`
        <tr>
            <td colspan="7" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">加载中...</span>
                </div>
                <span class="ml-2 text-muted">加载中...</span>
            </td>
        </tr>
    `);
    
    try {
        const skip = (page - 1) * limit;
        const data = await UserApi.getAll(skip, limit);
        const totalCount = await UserApi.getTotalCount();
        renderUserTable(data, totalCount, page, limit);
    } catch (error) {
        console.error('Error loading users:', error);
        $('#user-table-body').html(`
            <tr>
                <td colspan="7" class="text-center py-4">
                    <div class="alert alert-danger d-inline-block">
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        加载失败，请检查网络连接或服务器状态
                    </div>
                    <button class="btn btn-primary mt-2" onclick="loadUsers(${page}, ${limit})">
                        <i class="fas fa-sync-alt mr-1"></i> 重试
                    </button>
                </td>
            </tr>
        `);
    }
}

// 渲染用户表格
function renderUserTable(users, totalCount, currentPage, itemsPerPage) {
    let html = '';
    
    if (users.length === 0) {
        html = '<tr><td colspan="7" class="text-center py-4">暂无数据</td></tr>';
    } else {
        users.forEach(user => {
            html += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.full_name || '-'}</td>
                    <td>${user.role === 'admin' ? '管理员' : '普通用户'}</td>
                    <td>${Utils.formatDateTime(user.created_at)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary mr-1" onclick="editUser(${user.id})"><i class="fas fa-edit"></i> 编辑</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i> 删除</button>
                    </td>
                </tr>
            `;
        });
    }
    
    $('#user-table-body').html(html);
    
    // 渲染分页控件
    renderPagination(totalCount, currentPage, itemsPerPage);
}

// 渲染分页控件
function renderPagination(totalCount, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    
    let paginationHtml = '';
    
    if (totalPages > 1) {
        paginationHtml = `
            <nav class="mt-4">
                <ul class="pagination justify-content-center">
                    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                        <button class="page-link" onclick="loadUsers(${currentPage - 1}, ${itemsPerPage})">&laquo;</button>
                    </li>
        `;
        
        // 计算显示的页码范围
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // 添加页码按钮
        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <button class="page-link" onclick="loadUsers(${i}, ${itemsPerPage})"><strong>${i}</strong></button>
                </li>
            `;
        }
        
        paginationHtml += `
                    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                        <button class="page-link" onclick="loadUsers(${currentPage + 1}, ${itemsPerPage})">&raquo;</button>
                    </li>
                </ul>
            </nav>
        `;
    }
    
    // 移除旧的分页控件（如果存在）
    $('.card-footer').remove();
    
    // 添加新的分页控件
    $('.card').append(`
        <div class="card-footer bg-white border-top">
            <div class="d-flex justify-content-between align-items-center">
                <div class="text-muted">
                    共 <strong>${totalCount}</strong> 条记录，每页显示 <strong>${itemsPerPage}</strong> 条
                </div>
                <div>
                    ${paginationHtml}
                </div>
            </div>
        </div>
    `);
}

// 重置用户表单
function resetUserForm() {
    $('#user-form')[0].reset();
    $('#user-id').val('');
}

// 编辑用户
async function editUser(id) {
    try {
        const user = await UserApi.getById(id);
        $('#user-id').val(user.id);
        $('#username').val(user.username);
        $('#email').val(user.email);
        $('#full_name').val(user.full_name || '');
        $('#role').val(user.role);
        $('#user-password').val(''); // 密码不回显
        $('#user-modal-label').text('编辑用户');
        $('#user-modal').modal('show');
    } catch (error) {
        console.error('Error loading user:', error);
        Utils.showAlert('加载用户信息失败', 'danger');
    }
}

// 保存用户
async function saveUser() {
    const id = $('#user-id').val();
    const username = $('#username').val();
    const email = $('#email').val();
    const full_name = $('#full_name').val();
    const role = $('#role').val();
    const password = $('#user-password').val();

    // 新增用户时，密码是必填的；编辑用户时，密码是可选的
    if (!username || !email || !role || (!id && !password)) {
        Utils.showAlert('请填写必填字段', 'warning');
        return;
    }

    const data = {
        username: username,
        email: email,
        full_name: full_name,
        role: role
    };

    if (password) {
        data.password = password;
    }

    // 禁用保存按钮并显示加载状态
    const saveBtn = $('#save-user-btn');
    const originalText = saveBtn.html();
    saveBtn.prop('disabled', true).html(`
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        保存中...
    `);

    try {
        if (id) {
            await UserApi.update(id, data);
            Utils.showAlert('用户更新成功', 'success');
        } else {
            await UserApi.create(data);
            Utils.showAlert('用户新增成功', 'success');
        }
        $('#user-modal').modal('hide');
        await loadUsers();
    } catch (error) {
        console.error('Error saving user:', error);
        Utils.showAlert('保存失败，请重试', 'danger');
    } finally {
        // 恢复保存按钮状态
        saveBtn.prop('disabled', false).html(originalText);
    }
}

// 删除用户
async function deleteUser(id) {
    if (confirm('确定要删除这个用户吗？')) {
        // 显示加载状态
        const row = $(`button[onclick="deleteUser(${id})"]`).closest('tr');
        const originalContent = row.html();
        row.html(`
            <td colspan="7" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">删除中...</span>
                </div>
                <span class="ml-2 text-muted">删除中...</span>
            </td>
        `);
        
        try {
            await UserApi.delete(id);
            await loadUsers();
            Utils.showAlert('用户删除成功', 'success');
        } catch (error) {
            console.error('Error deleting user:', error);
            row.html(originalContent);
            Utils.showAlert('删除失败，请重试', 'danger');
        }
    }
}

// 搜索用户
function searchUsers() {
    const searchTerm = $('#user-search-input').val().toLowerCase();
    const rows = $('#user-table-body tr');
    
    rows.each(function() {
        const username = $(this).find('td:eq(1)').text().toLowerCase();
        const email = $(this).find('td:eq(2)').text().toLowerCase();
        const fullName = $(this).find('td:eq(3)').text().toLowerCase();
        
        if (username.includes(searchTerm) || email.includes(searchTerm) || fullName.includes(searchTerm)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

// 暴露全局函数
window.loadUsers = loadUsers;
window.editUser = editUser;
window.deleteUser = deleteUser;
