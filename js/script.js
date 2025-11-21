// script.js - Quản lý sản phẩm Admin

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPage();
    loadProductsTable();
    setupEventListeners();
});

// Khởi tạo trang admin
function initializeAdminPage() {
    checkAdminAuth();
    setupNavigation();
    updateAdminUsername();
}

// Kiểm tra xác thực admin
function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
}

// Cập nhật tên admin
function updateAdminUsername() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const usernameElement = document.getElementById('adminUsername');
    
    if (usernameElement && currentUser) {
        usernameElement.textContent = currentUser.username;
    }
}

// Thiết lập navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.querySelector('a').getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                document.getElementById('pageTitle').textContent = this.querySelector('span').textContent;
            }
        });
    });
    
    // Logout functionality
    const logoutBtn = document.getElementById('adminLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
}

// Tải bảng sản phẩm
function loadProductsTable() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tableBody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <p>Chưa có sản phẩm nào</p>
                    <button class="btn btn-primary mt-2" id="addFirstProduct">
                        <i class="fas fa-plus"></i> Thêm Sản Phẩm Đầu Tiên
                    </button>
                </td>
            </tr>
        `;
        
        document.getElementById('addFirstProduct').addEventListener('click', function() {
            showProductForm();
        });
        return;
    }
    
    tableBody.innerHTML = products.map((product, index) => `
        <tr>
            <td>
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='images/default-product.jpg'" 
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
            </td>
            <td>
                <strong>${product.name}</strong>
                ${product.description ? `<br><small class="text-muted">${product.description}</small>` : ''}
            </td>
            <td>
                <span class="category-badge">${getCategoryName(product.type)}</span>
            </td>
            <td>
                <strong class="text-primary">${formatPrice(product.price)}₫</strong>
                ${product.originalPrice ? `<br><small class="text-muted"><s>${formatPrice(product.originalPrice)}₫</s></small>` : ''}
            </td>
            <td>
                <span class="stock-badge ${product.stock > 10 ? 'in-stock' : 'low-stock'}">
                    ${product.stock || 1}
                </span>
            </td>
            <td>
                <span class="status completed">Đang bán</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline edit-product" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline delete-product" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    setupProductActions();
}

// Lấy tên danh mục
function getCategoryName(type) {
    const categories = {
        'ao': 'Áo',
        'ao-thun': 'Áo Thun',
        'ao-so-mi': 'Áo Sơ Mi',
        'ao-khoac': 'Áo Khoác',
        'ao-len': 'Áo Len',
        'quan': 'Quần',
        'quan-jeans': 'Quần Jeans',
        'quan-tay': 'Quần Tây',
        'quan-kaki': 'Quần Kaki',
        'quan-short': 'Quần Short',
        'vay': 'Váy & Đầm',
        'vay-lien': 'Váy Liền',
        'vay-xoe': 'Váy Xòe',
        'vay-midi': 'Váy Midi',
        'vay-maxi': 'Váy Maxi',
        'phu-kien': 'Phụ Kiện',
        'mu': 'Mũ',
        'khan-choang': 'Khăn Choàng',
        'tui-xach': 'Túi Xách',
        'that-lung': 'Thắt Lưng'
    };
    
    return categories[type] || type;
}

// Thiết lập sự kiện
function setupEventListeners() {
    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', showProductForm);
    }
    
    // Cancel form button
    const cancelForm = document.getElementById('cancelForm');
    if (cancelForm) {
        cancelForm.addEventListener('click', hideProductForm);
    }
    
    // Product form submission
    const productForm = document.getElementById('adminProductForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
}

// Hiển thị form sản phẩm
function showProductForm(product = null) {
    const form = document.getElementById('productForm');
    const formTitle = document.getElementById('formTitle');
    const productId = document.getElementById('productId');
    
    if (product) {
        // Edit mode
        formTitle.textContent = 'Chỉnh Sửa Sản Phẩm';
        productId.value = product.id || '';
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.type;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productOriginalPrice').value = product.originalPrice || '';
        document.getElementById('productImage').value = product.image;
        document.getElementById('productStock').value = product.stock || 1;
        document.getElementById('productDescription').value = product.description || '';
    } else {
        // Add mode
        formTitle.textContent = 'Thêm Sản Phẩm Mới';
        productId.value = '';
        document.getElementById('adminProductForm').reset();
    }
    
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
}

// Ẩn form sản phẩm
function hideProductForm() {
    document.getElementById('productForm').style.display = 'none';
}

// Xử lý submit form
function handleProductSubmit(e) {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        type: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        originalPrice: document.getElementById('productOriginalPrice').value ? 
                      parseInt(document.getElementById('productOriginalPrice').value) : null,
        image: document.getElementById('productImage').value,
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value
    };
    
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (productId) {
        // Edit existing product
        const index = products.findIndex(p => p.id == productId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            showToast('Cập nhật sản phẩm thành công!', 'success');
        }
    } else {
        // Add new product
        productData.id = Date.now(); // Simple ID generation
        products.push(productData);
        showToast('Thêm sản phẩm thành công!', 'success');
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    hideProductForm();
    loadProductsTable();
}

// Thiết lập hành động sản phẩm
function setupProductActions() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.edit-product');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            const products = JSON.parse(localStorage.getItem('products')) || [];
            if (products[index]) {
                showProductForm(products[index]);
            }
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-product');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
                deleteProduct(index);
            }
        });
    });
}

// Xóa sản phẩm
function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    showToast('Xóa sản phẩm thành công!', 'success');
    loadProductsTable();
}

// Định dạng giá
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Hiển thị thông báo
function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#f39c12'};
    `;
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// CSS for animations
const style = document.createElement('style');
style.textContent = `
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
    
    .category-badge {
        background: #e3f2fd;
        color: #1976d2;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .stock-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .stock-badge.in-stock {
        background: #d4edda;
        color: #155724;
    }
    
    .stock-badge.low-stock {
        background: #fff3cd;
        color: #856404;
    }
    
    .action-buttons {
        display: flex;
        gap: 5px;
    }
    
    .btn-outline {
        background: transparent;
        border: 1px solid #ddd;
        color: #666;
    }
    
    .btn-outline:hover {
        background: #f8f9fa;
        border-color: #e60012;
        color: #e60012;
    }
`;
document.head.appendChild(style);