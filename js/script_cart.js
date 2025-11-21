// script_cart.js - Xử lý giỏ hàng

document.addEventListener('DOMContentLoaded', function() {
    initializeCartPage();
    loadCart();
    setupEventListeners();
    loadRecommendedProducts();
});

// Khởi tạo trang giỏ hàng
function initializeCartPage() {
    checkUserAuth();
    setupMobileSidebar();
    initializeCart();
}

// Thiết lập event listeners
function setupEventListeners() {
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Promo code
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoInput = document.getElementById('promoInput');
    
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    if (promoInput) {
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
    }
    
    // Checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', startCheckout);
    }
    
    // Modal events
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');
    const cancelCheckout = document.getElementById('cancelCheckout');
    const confirmCheckout = document.getElementById('confirmCheckout');
    
    if (closeCheckoutModal) {
        closeCheckoutModal.addEventListener('click', function() {
            closeModal('checkoutModal');
        });
    }
    
    if (cancelCheckout) {
        cancelCheckout.addEventListener('click', function() {
            closeModal('checkoutModal');
        });
    }
    
    if (confirmCheckout) {
        confirmCheckout.addEventListener('click', confirmOrder);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('checkoutModal');
        if (event.target === modal) {
            closeModal('checkoutModal');
        }
    });
}

// Tải giỏ hàng
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const recommendedProducts = document.getElementById('recommendedProducts');
    
    if (cart.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        recommendedProducts.style.display = 'none';
        return;
    }
    
    cartContent.style.display = 'grid';
    emptyCart.style.display = 'none';
    recommendedProducts.style.display = 'block';
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItem);
    });
    
    updateCartSummary();
    updateCartCount();
}

// Tạo phần tử cart item
function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" 
             onerror="this.src='images/default-product.jpg'">
        <div class="cart-item-details">
            <div class="cart-item-header">
                <h3 class="cart-item-name">${item.name}</h3>
                <div class="cart-item-price">${formatPrice(item.price)}₫</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${index})" 
                            ${item.quantity <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn" onclick="increaseQuantity(${index})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">
                    <i class="fas fa-trash"></i>
                    Xóa
                </button>
            </div>
        </div>
    `;
    
    return cartItem;
}

// Giảm số lượng
function decreaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        showToast(`Đã giảm số lượng ${cart[index].name}`, 'info');
    } else {
        if (confirm(`Bạn có chắc muốn xóa ${cart[index].name} khỏi giỏ hàng?`)) {
            cart.splice(index, 1);
            showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
        } else {
            return;
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Tăng số lượng
function increaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity += 1;
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    showToast(`Đã tăng số lượng ${cart[index].name}`, 'info');
}

// Xóa item
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    const itemName = cart[index].name;
    
    if (confirm(`Bạn có chắc muốn xóa ${itemName} khỏi giỏ hàng?`)) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
    }
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    
    if (cart.length === 0) {
        showToast('Giỏ hàng của bạn đang trống!', 'info');
        return;
    }
    
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
        localStorage.setItem('cart', JSON.stringify([]));
        loadCart();
        showToast('Đã xóa toàn bộ giỏ hàng', 'info');
    }
}

// Cập nhật tổng quan giỏ hàng
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingFee = 30000;
    const discount = getCurrentDiscount();
    const total = subtotal + shippingFee - discount;
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal) + '₫';
    document.getElementById('shippingFee').textContent = formatPrice(shippingFee) + '₫';
    document.getElementById('discount').textContent = '-' + formatPrice(discount) + '₫';
    document.getElementById('total').textContent = formatPrice(total) + '₫';
}

// Áp dụng mã giảm giá
function applyPromoCode() {
    const promoInput = document.getElementById('promoInput');
    const promoFeedback = document.getElementById('promoFeedback');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    const validPromoCodes = {
        'WELCOME10': 0.1,    // 10% discount
        'FREESHIP': 30000,   // Free shipping
        'SAVE20': 0.2,       // 20% discount
        'NEW50': 0.5         // 50% discount (max 100k)
    };
    
    if (!promoCode) {
        promoFeedback.textContent = 'Vui lòng nhập mã giảm giá';
        promoFeedback.className = 'promo-feedback error';
        return;
    }
    
    if (validPromoCodes[promoCode]) {
        localStorage.setItem('appliedPromo', JSON.stringify({
            code: promoCode,
            discount: validPromoCodes[promoCode],
            type: typeof validPromoCodes[promoCode] === 'number' && validPromoCodes[promoCode] <= 1 ? 'percentage' : 'fixed'
        }));
        
        promoFeedback.textContent = `Áp dụng mã ${promoCode} thành công!`;
        promoFeedback.className = 'promo-feedback success';
        promoInput.disabled = true;
        
        updateCartSummary();
        showToast('Áp dụng mã giảm giá thành công!', 'success');
        
    } else {
        promoFeedback.textContent = 'Mã giảm giá không hợp lệ hoặc đã hết hạn';
        promoFeedback.className = 'promo-feedback error';
    }
}

// Lấy discount hiện tại
function getCurrentDiscount() {
    const appliedPromo = JSON.parse(localStorage.getItem('appliedPromo'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    if (!appliedPromo) return 0;
    
    let discount = 0;
    
    if (appliedPromo.type === 'percentage') {
        discount = subtotal * appliedPromo.discount;
        // Giới hạn discount tối đa 100k cho mã NEW50
        if (appliedPromo.code === 'NEW50') {
            discount = Math.min(discount, 100000);
        }
    } else {
        discount = appliedPromo.discount;
    }
    
    return discount;
}

// Bắt đầu thanh toán
function startCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    
    if (!cart || cart.length === 0) {
        showToast('Giỏ hàng của bạn đang trống!', 'error');
        return;
    }
    
    showCheckoutModal();
}

// Hiển thị modal thanh toán
function showCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const orderSummary = document.getElementById('modalOrderSummary');
    const cart = JSON.parse(localStorage.getItem('cart'));
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingFee = 30000;
    const discount = getCurrentDiscount();
    const total = subtotal + shippingFee - discount;
    
    let summaryHTML = '';
    
    cart.forEach(item => {
        summaryHTML += `
            <div class="order-summary-item">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatPrice(item.price * item.quantity)}₫</span>
            </div>
        `;
    });
    
    summaryHTML += `
        <div class="order-summary-item">
            <span>Tạm tính:</span>
            <span>${formatPrice(subtotal)}₫</span>
        </div>
        <div class="order-summary-item">
            <span>Phí vận chuyển:</span>
            <span>${formatPrice(shippingFee)}₫</span>
        </div>
        <div class="order-summary-item">
            <span>Giảm giá:</span>
            <span>-${formatPrice(discount)}₫</span>
        </div>
        <div class="order-summary-item order-summary-total">
            <span>Tổng cộng:</span>
            <span>${formatPrice(total)}₫</span>
        </div>
    `;
    
    orderSummary.innerHTML = summaryHTML;
    modal.style.display = 'block';
}

// Xác nhận đặt hàng
function confirmOrder() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    
    if (!cart || cart.length === 0) {
        showToast('Có lỗi xảy ra! Vui lòng thử lại.', 'error');
        return;
    }
    
    // Tạo đơn hàng
    const order = {
        id: 'ORD-' + Date.now(),
        items: cart,
        total: document.getElementById('total').textContent,
        date: new Date().toLocaleString('vi-VN'),
        status: 'pending',
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
    };
    
    // Lưu đơn hàng
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Xóa giỏ hàng và mã giảm giá
    localStorage.setItem('cart', JSON.stringify([]));
    localStorage.removeItem('appliedPromo');
    
    // Đóng modal
    closeModal('checkoutModal');
    
    // Hiển thị thông báo thành công
    showToast('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.', 'success');
    
    // Chuyển hướng sau 2 giây
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Tải sản phẩm gợi ý
function loadRecommendedProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const recommendedGrid = document.getElementById('recommendedGrid');
    
    if (products.length === 0) return;
    
    // Lấy ngẫu nhiên 4 sản phẩm
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const recommended = shuffled.slice(0, 4);
    
    recommendedGrid.innerHTML = recommended.map(product => `
        <div class="product-item">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='images/default-product.jpg'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}₫</span>
                    ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}₫</span>` : ''}
                </div>
                <button class="buy-btn" data-product='${JSON.stringify(product).replace(/'/g, "&#39;")}'>
                    <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                </button>
            </div>
        </div>
    `).join('');
    
    setupCartEventListeners();
}

// Đóng modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Helper functions
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Xuất các hàm toàn cục
window.decreaseQuantity = decreaseQuantity;
window.increaseQuantity = increaseQuantity;
window.removeItem = removeItem;