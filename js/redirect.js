// redirect.js - File này sẽ được thêm vào tất cả các trang
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentPage = window.location.pathname.split('/').pop();
    
    // Nếu chưa đăng nhập và không ở trang unlog.html
    if (!currentUser && currentPage !== 'unlog.html' && currentPage !== 'login.html' && currentPage !== 'register.html') {
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
        
        // Nếu là user và đang ở trang không phải index_user.html
        if (currentUser.role === 'user' && currentPage !== 'index_user.html' && currentPage !== 'cart.html') {
            window.location.href = 'index_user.html';
            return;
        }
    }
});