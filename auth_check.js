// auth_check.js - Kiểm tra đăng nhập đơn giản
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Checking authentication...');
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log('Current user:', currentUser);
    console.log('Current page:', currentPage);
    
    // Danh sách trang không cần đăng nhập
    const publicPages = ['unlog.html', 'login.html', 'register.html'];
    
    // Nếu đang ở trang public thì không làm gì
    if (publicPages.includes(currentPage)) {
        console.log('📍 Public page, no redirect needed');
        return;
    }
    
    // Nếu chưa đăng nhập và không ở trang public
    if (!currentUser) {
        console.log('🚫 No user logged in, redirecting to unlog.html');
        window.location.href = 'unlog.html';
        return;
    }
    
    // Nếu đã đăng nhập, kiểm tra role và trang
    console.log('✅ User logged in:', currentUser.username, 'Role:', currentUser.role);
    
    // Admin chỉ được ở index.html
    if (currentUser.role === 'admin' && currentPage !== 'index.html' && currentPage !== 'index.php') {
        console.log('🛑 Admin trying to access user page, redirecting to index.html');
        window.location.href = 'index.html';
        return;
    }
    
    // User chỉ được ở index_user.html và cart.html
    if (currentUser.role === 'user') {
        const allowedUserPages = ['index_user.html', 'cart.html'];
        if (!allowedUserPages.includes(currentPage)) {
            console.log('🛑 User trying to access admin page, redirecting to index_user.html');
            window.location.href = 'index_user.html';
            return;
        }
    }
    
    console.log('✅ Authentication check passed');
});