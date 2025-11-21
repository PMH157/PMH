// script_cart.js - File chính xử lý giỏ hàng
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    setupUserInfo();
    loadCart();
    setupCheckout();
    updateCartCount();
});

// Khởi tạo giỏ hàng trong localStorage
function initializeCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

// Thiết lập thông tin user
function setupUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userInfo = document.getElementById('userInfo');
    
    if (currentUser) {
        userInfo.innerHTML = `
            <div class="user-welcome">
                <span class="welcome-text">Xin chào,</span>
                <span class="username">${currentUser.username}</span>
            </div>
            <button class="logout-btn">Đăng xuất</button>
        `;
        
        document.querySelector('.logout-btn').addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index_user.html';
        });
    } else {
        userInfo.innerHTML = `
            <div class="auth-buttons">
                <button class="auth-btn login-btn">Đăng nhập</button>
                <button class="auth-btn register-btn">Đăng ký</button>
            </div>
        `;
        
        document.querySelector('.login-btn').addEventListener('click', function() {
            window.location.href = 'login.html';
        });
        
        document.querySelector('.register-btn').addEventListener('click', function() {
            window.location.href = 'register.html';
        });
    }
}

// Hàm để debug - kiểm tra giỏ hàng
function debugCart() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    console.log('Current cart:', cart);
    console.log('Cart count:', cart.reduce((total, item) => total + item.quantity, 0));
}

// Xuất các hàm để sử dụng toàn cục (nếu cần)
window.loadCart = loadCart;
window.decreaseQuantity = decreaseQuantity;
window.increaseQuantity = increaseQuantity;
window.removeOneItem = removeOneItem;
window.removeAllItems = removeAllItems;
window.updateCartCount = updateCartCount;