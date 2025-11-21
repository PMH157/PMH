// script_user.js - Xử lý trang chủ user

document.addEventListener('DOMContentLoaded', function() {
    initializeUserPage();
    loadFeaturedProducts();
    loadNewArrivals();
    setupEventListeners();
    updateCartCount();
});

// Khởi tạo trang user
function initializeUserPage() {
    checkUserAuth();
    setupMobileSidebar();
    initializeCart();
}

// Kiểm tra xác thực user
function checkUserAuth() {
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
            window.location.reload();
        });
    }
}

// Thiết lập sidebar mobile
function setupMobileSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebarToggle && overlay) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

// Khởi tạo giỏ hàng
function initializeCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

// Tải sản phẩm nổi bật
function loadFeaturedProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
    const featuredContainer = document.getElementById('featuredProducts');
    
    // Lấy 8 sản phẩm đầu tiên làm featured
    const featuredProducts = products.slice(0, 8);
    
    if (featuredProducts.length === 0) {
        featuredContainer.innerHTML = '<p class="text-center">Chưa có sản phẩm nào</p>';
        return;
    }
    
    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-item">
            ${product.price > 500000 ? '<span class="product-badge">Hot</span>' : ''}
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='images/default-product.jpg'">
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

// Tải sản phẩm mới
function loadNewArrivals() {
    const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
    const newArrivalsContainer = document.getElementById('newArrivals');
    
    // Lấy 8 sản phẩm tiếp theo làm new arrivals
    const newArrivals = products.slice(8, 16);
    
    if (newArrivals.length === 0) {
        newArrivalsContainer.innerHTML = '<p class="text-center">Chưa có sản phẩm mới</p>';
        return;
    }
    
    newArrivalsContainer.innerHTML = newArrivals.map(product => `
        <div class="product-item">
            <span class="product-badge">Mới</span>
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='images/default-product.jpg'">
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

// Sản phẩm mặc định
function getDefaultProducts() {
    const defaultProducts = [
        {
            id: 1,
            name: "Áo Thun Cotton Basic",
            type: "Áo thun",
            price: 199000,
            originalPrice: 299000,
            image: "images/ao-thun-basic.jpg",
            description: "Áo thun cotton 100% thoáng mát"
        },
        {
            id: 2,
            name: "Áo Sơ Mi Trắng",
            type: "Áo sơ mi",
            price: 399000,
            image: "images/ao-so-mi-trang.jpg",
            description: "Áo sơ mi trắng thanh lịch"
        },
        {
            id: 3,
            name: "Áo Khoác Denim",
            type: "Áo khoác",
            price: 599000,
            image: "images/ao-khoac-denim.jpg",
            description: "Áo khoác denim phong cách"
        },
        {
            id: 4,
            name: "Quần Jeans Slim",
            type: "Quần jeans",
            price: 499000,
            image: "images/quan-jeans-slim.jpg",
            description: "Quần jeans slim fit"
        },
        {
            id: 5,
            name: "Quần Tây Âu",
            type: "Quần tây",
            price: 459000,
            image: "images/quan-tay-au.jpg",
            description: "Quần tây âu thanh lịch"
        },
        {
            id: 6,
            name: "Váy Liền Body",
            type: "Váy liền",
            price: 699000,
            image: "images/vay-lien-body.jpg",
            description: "Váy liền body quyến rũ"
        },
        {
            id: 7,
            name: "Áo Len Cashmere",
            type: "Áo len",
            price: 899000,
            image: "images/ao-len-cashmere.jpg",
            description: "Áo len cashmere cao cấp"
        },
        {
            id: 8,
            name: "Túi Xách Da",
            type: "Túi xách",
            price: 799000,
            image: "images/tui-xach-da.jpg",
            description: "Túi xách da thật"
        },
        {
            id: 9,
            name: "Áo Hoodie Unisex",
            type: "Áo hoodie",
            price: 349000,
            image: "images/ao-hoodie-unisex.jpg",
            description: "Áo hoodie unisex thoải mái"
        },
        {
            id: 10,
            name: "Quần Short Kaki",
            type: "Quần short",
            price: 279000,
            image: "images/quan-short-kaki.jpg",
            description: "Quần short kaki mát mẻ"
        },
        {
            id: 11,
            name: "Váy Xòe Hoa",
            type: "Váy xòe",
            price: 559000,
            image: "images/vay-xoe-hoa.jpg",
            description: "Váy xòe hoa điệu đà"
        },
        {
            id: 12,
            name: "Mũ Lưỡi Trai",
            type: "Mũ",
            price: 159000,
            image: "images/mu-luoi-trai.jpg",
            description: "Mũ lưỡi trai thời trang"
        },
        {
            id: 13,
            name: "Áo Khoác Gió",
            type: "Áo khoác",
            price: 389000,
            image: "images/ao-khoac-gio.jpg",
            description: "Áo khoác gió thể thao"
        },
        {
            id: 14,
            name: "Quần Jogger",
            type: "Quần jogger",
            price: 329000,
            image: "images/quan-jogger.jpg",
            description: "Quần jogger năng động"
        },
        {
            id: 15,
            name: "Khăn Choàng Len",
            type: "Khăn choàng",
            price: 189000,
            image: "images/khan-choang-len.jpg",
            description: "Khăn choàng len ấm áp"
        },
        {
            id: 16,
            name: "Thắt Lưng Da",
            type: "Thắt lưng",
            price: 229000,
            image: "images/that-lung-da.jpg",
            description: "Thắt lưng da cao cấp"
        }
    ];
    
    // Lưu sản phẩm mặc định nếu chưa có
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    
    return defaultProducts;
}

// Thiết lập event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            showToast('Cảm ơn bạn đã đăng ký nhận tin!', 'success');
            this.reset();
        });
    }
}

// Tìm kiếm sản phẩm
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `category.html?search=${encodeURIComponent(query)}`;
    }
}

// Thiết lập sự kiện cho nút thêm vào giỏ
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

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
        showToast(`Đã thêm "${product.name}" vào giỏ hàng (Số lượng: ${cart[existingProductIndex].quantity})`, 'success');
    } else {
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        };
        cart.push(cartProduct);
        showToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Cập nhật số lượng giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart count in header
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
    
    // Update cart count in sidebar
    const sidebarCartCount = document.querySelector('.cart-count-sidebar');
    if (sidebarCartCount) {
        sidebarCartCount.textContent = cartCount;
    }
}

// Định dạng giá
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Hiển thị thông báo
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Xuất các hàm để sử dụng toàn cục
window.addToCart = addToCart;
window.formatPrice = formatPrice;