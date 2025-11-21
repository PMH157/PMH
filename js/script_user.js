// Xử lý hiển thị thông tin user và giỏ hàng
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userInfo = document.getElementById('userInfo');
    
    // Hiển thị thông tin user
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
            window.location.reload();
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
    
    // Khởi tạo giỏ hàng và sự kiện
    initializeCart();
    setupCartEventListeners();
    updateCartDisplay();
    loadProducts();
});

// Tải sản phẩm từ localStorage
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const grid = document.querySelector('.grid');
    
    if (products.length === 0) {
        grid.innerHTML = '<p>Chưa có sản phẩm nào.</p>';
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="item">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='images/default-product.jpg'">
            <h3>${product.name}</h3>
            <p class="price">${formatPrice(product.price)}₫</p>
            <button class="buy-btn" data-product='${JSON.stringify(product).replace(/'/g, "&#39;")}'>Mua ngay</button>
        </div>
    `).join('');
    
    // Thêm lại sự kiện cho các nút mua hàng
    setupCartEventListeners();
}

// Các hàm giỏ hàng (giữ nguyên từ script_cart.js)
function initializeCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

function setupCartEventListeners() {
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productData = this.getAttribute('data-product');
            if (productData) {
                const product = JSON.parse(productData);
                addToCart(product);
            }
        });
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
        showAddToCartMessage(`Đã thêm "${product.name}" vào giỏ hàng (Số lượng: ${cart[existingProductIndex].quantity})`);
    } else {
        const cartProduct = {
            id: product.id || generateId(),
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        };
        cart.push(cartProduct);
        showAddToCartMessage(`Đã thêm "${product.name}" vào giỏ hàng`);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function generateId() {
    return 'product_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function showAddToCartMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">✓</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}