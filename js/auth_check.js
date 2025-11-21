// auth_check.js - Kiểm tra xác thực trên tất cả trang

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupAuthInterceptors();
});

// Kiểm tra xác thực
function checkAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentPage = window.location.pathname.split('/').pop();
    
    // Danh sách trang public không cần đăng nhập
    const publicPages = ['login.html', 'register.html', 'unlog.html'];
    
    // Nếu chưa đăng nhập và không ở trang public
    if (!currentUser && !publicPages.includes(currentPage)) {
        window.location.href = 'unlog.html';
        return;
    }
    
    // Nếu đã đăng nhập
    if (currentUser) {
        // Chuyển hướng nếu đang ở trang login/register
        if (currentPage === 'login.html' || currentPage === 'register.html') {
            redirectBasedOnRole(currentUser.role);
            return;
        }
        
        // Kiểm tra quyền truy cập
        checkPageAccess(currentUser.role, currentPage);
    }
}

// Kiểm tra quyền truy cập trang
function checkPageAccess(userRole, currentPage) {
    const adminPages = ['admin.html'];
    const userPages = ['index.html', 'category.html', 'cart.html'];
    
    if (userRole === 'admin' && userPages.includes(currentPage)) {
        // Admin có thể truy cập tất cả trang
        return true;
    }
    
    if (userRole === 'user' && adminPages.includes(currentPage)) {
        // User không thể truy cập trang admin
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Chuyển hướng dựa trên role
function redirectBasedOnRole(role) {
    switch(role) {
        case 'admin':
            window.location.href = 'admin.html';
            break;
        case 'user':
            window.location.href = 'index.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

// Thiết lập auth interceptors
function setupAuthInterceptors() {
    // Intercept tất cả link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link) {
            const href = link.getAttribute('href');
            if (href && !isExternalLink(href)) {
                if (!checkLinkAccess(href)) {
                    e.preventDefault();
                    showAccessDeniedMessage();
                }
            }
        }
    });
}

// Kiểm tra quyền truy cập link
function checkLinkAccess(href) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        return href === 'login.html' || href === 'register.html' || href === 'unlog.html';
    }
    
    if (currentUser.role === 'admin') {
        return true; // Admin có quyền truy cập tất cả
    }
    
    // User không được truy cập trang admin
    if (href === 'admin.html') {
        return false;
    }
    
    return true;
}

// Kiểm tra link external
function isExternalLink(href) {
    return href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:');
}

// Hiển thị thông báo truy cập bị từ chối
function showAccessDeniedMessage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        showToast('Vui lòng đăng nhập để truy cập trang này!', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        showToast('Bạn không có quyền truy cập trang này!', 'error');
    }
}

// Hiển thị toast message
function showToast(message, type = 'info') {
    // Kiểm tra xem đã có toast style chưa
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .auth-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .auth-toast.success { background: #27ae60; }
            .auth-toast.error { background: #e74c3c; }
            .auth-toast.warning { background: #f39c12; }
            .auth-toast.info { background: #3498db; }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    const toast = document.createElement('div');
    toast.className = `auth-toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Lấy icon cho toast
function getToastIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Hàm logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Kiểm tra session timeout (30 phút)
function checkSessionTimeout() {
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
        const now = Date.now();
        const timeDiff = now - parseInt(lastActivity);
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (timeDiff > thirtyMinutes) {
            logout();
            showToast('Phiên đăng nhập đã hết hạn!', 'warning');
        }
    }
    
    // Cập nhật thời gian hoạt động
    localStorage.setItem('lastActivity', Date.now().toString());
}

// Cập nhật thời gian hoạt động khi user tương tác
document.addEventListener('click', checkSessionTimeout);
document.addEventListener('keypress', checkSessionTimeout);

// Kiểm tra session timeout mỗi phút
setInterval(checkSessionTimeout, 60000);

// Khởi tạo lastActivity nếu chưa có
if (!localStorage.getItem('lastActivity')) {
    localStorage.setItem('lastActivity', Date.now().toString());
}