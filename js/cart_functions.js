// cart_functions.js - Tách từ cart.html

// Tải và hiển thị giỏ hàng
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.querySelector('.cart-content');
    
    if (cart.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartContent.style.display = 'flex';
    emptyCart.style.display = 'none';
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItem);
    });
    
    updateCartSummary();
}

// Tạo phần tử HTML cho mỗi sản phẩm trong giỏ hàng
function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price)}₫</div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn minus-btn" onclick="decreaseQuantity(${index})">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn plus-btn" onclick="increaseQuantity(${index})">+</button>
                </div>
                <button class="remove-btn" onclick="removeOneItem(${index})">
                    Xóa 1 SP
                </button>
                <button class="remove-all-btn" onclick="removeAllItems(${index})">
                    Xóa Tất Cả
                </button>
            </div>
        </div>
    `;
    
    return cartItem;
}

// Giảm số lượng sản phẩm
function decreaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Tăng số lượng sản phẩm
function increaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity += 1;
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Xóa 1 sản phẩm
function removeOneItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Xóa toàn bộ sản phẩm
function removeAllItems(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Cập nhật tổng tiền
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 30000;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal) + '₫';
    document.getElementById('total').textContent = formatPrice(total) + '₫';
}

// Định dạng giá tiền
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Cập nhật số lượng trên icon giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
}

// Xử lý thanh toán
function setupCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            handleCheckout();
        });
    }
}

// Xử lý thanh toán
function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }
    
    // Hiển thị thông báo thanh toán thành công
    alert('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
    
    // Xóa giỏ hàng
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Cập nhật hiển thị
    loadCart();
    updateCartCount();
    
    // Chuyển hướng về trang chủ sau 2 giây
    setTimeout(() => {
        window.location.href = 'index_user.html';
    }, 2000);
}