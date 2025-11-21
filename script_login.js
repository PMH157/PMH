document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    console.log('Login attempt:', { username, password });
    
    // Lấy danh sách users từ localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Available users:', users);
    
    // Kiểm tra thông tin đăng nhập
    if (username === 'admin' && password === 'admin') {
        // Đăng nhập với quyền admin
        localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            role: 'admin'
        }));
        console.log('Admin login successful');
        window.location.href = 'index.html';
        return;
    }
    
    // Kiểm tra trong danh sách users đã đăng ký
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // Đăng nhập với quyền user
        localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            role: 'user'
        }));
        console.log('User login successful:', username);
        window.location.href = 'index_user.html';
        return;
    }
    
    // Nếu không đúng cả admin và user
    console.log('Login failed - no matching user found');
    showLoginErrorModal();
});

function showLoginErrorModal() {
    const modal = document.getElementById('loginErrorModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Xử lý nút OK
        const okBtn = modal.querySelector('.modal-close-btn');
        okBtn.onclick = function() {
            modal.style.display = 'none';
        };
        
        // Tự động đóng sau 3 giây
        setTimeout(function() {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        }, 3000);
    } else {
        // Fallback
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

// Đóng modal khi click bên ngoài
window.addEventListener('click', function(event) {
    const modal = document.getElementById('loginErrorModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Debug
document.addEventListener('DOMContentLoaded', function() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('👥 Danh sách tài khoản:', users);
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    console.log('Login attempt:', { username, password });
    
    // Lấy danh sách users từ localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Available users:', users);
    
    // Kiểm tra thông tin đăng nhập
    if (username === 'admin' && password === 'admin') {
        // Đăng nhập với quyền admin
        localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            role: 'admin'
        }));
        console.log('Admin login successful');
        window.location.href = 'index.html';  // Chuyển đến trang admin
        return;
    }
    
    // Kiểm tra trong danh sách users đã đăng ký
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // Đăng nhập với quyền user
        localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            role: 'user'
        }));
        console.log('User login successful:', username);
        window.location.href = 'index_user.html';  // Chuyển đến trang user
        return;
    }
    
    // Nếu không đúng cả admin và user
    console.log('Login failed - no matching user found');
    showLoginErrorModal();
});