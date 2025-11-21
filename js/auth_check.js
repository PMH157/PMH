// Kiểm tra đăng nhập khi trang load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentPage = window.location.pathname.split('/').pop();
    
    // Danh sách trang không cần đăng nhập
    const publicPages = ['unlog.html', 'login.html', 'register.html'];
    
    // Nếu chưa đăng nhập và không ở trang public
    if (!currentUser && !publicPages.includes(currentPage)) {
        window.location.href = 'unlog.html';
        return;
    }
    
    // Nếu đã đăng nhập
    if (currentUser) {
        // Nếu là admin và đang ở trang không phải index.html
        if (currentUser.role === 'admin' && currentPage !== 'index.html') {
            window.location.href = 'index.html';
            return;
        }
        
        // Nếu là user và đang ở trang admin
        if (currentUser.role === 'user' && currentPage === 'index.html') {
            window.location.href = 'index_user.html';
            return;
        }
    }
});