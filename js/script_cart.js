// script_cart.js - Đặt file này trong cùng thư mục
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    setupCartEventListeners();
    updateCartDisplay();
});

// Khởi tạo giỏ hàng trong localStorage
function initializeCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

// Thiết lập sự kiện cho các nút "Mua ngay"
function setupCartEventListeners() {
    // Thêm sự kiện cho tất cả các nút "Mua ngay"
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productElement = this.closest('.item');
            addToCart(productElement);
        });
    });
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productElement) {
    console.log('Adding to cart...');
    
    const product = {
        id: generateProductId(productElement),
        name: productElement.querySelector('h3').textContent,
        price: parsePrice(productElement.querySelector('.price').textContent),
        image: productElement.querySelector('img').src,
        quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem('cart'));
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Nếu đã có, tăng số lượng lên 1
        cart[existingProductIndex].quantity += 1;
        showAddToCartMessage(`Đã thêm "${product.name}" vào giỏ hàng (Số lượng: ${cart[existingProductIndex].quantity})`);
    } else {
        // Nếu chưa có, thêm sản phẩm mới
        cart.push(product);
        showAddToCartMessage(`Đã thêm "${product.name}" vào giỏ hàng`);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Tạo ID duy nhất cho sản phẩm
function generateProductId(productElement) {
    const name = productElement.querySelector('h3').textContent;
    return 'product_' + name.replace(/\s+/g, '_').toLowerCase();
}

// Chuyển đổi giá từ chuỗi sang số
function parsePrice(priceString) {
    return parseInt(priceString.replace(/[^\d]/g, ''));
}

// Cập nhật hiển thị giỏ hàng (số lượng trên icon)
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Hiển thị thông báo khi thêm vào giỏ hàng
function showAddToCartMessage(message) {
    // Tạo toast message
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">✓</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    // Thêm styles nếu chưa có
    if (!document.querySelector('#cart-toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'cart-toast-styles';
        styles.textContent = `
            .cart-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #27ae60;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
            }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .toast-icon {
                font-weight: bold;
                font-size: 18px;
            }
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
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(toast);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Hàm để debug - kiểm tra giỏ hàng
function debugCart() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    console.log('Current cart:', cart);
    console.log('Cart count:', cart.reduce((total, item) => total + item.quantity, 0));
}