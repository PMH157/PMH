// script_login.js - Xử lý đăng nhập

document.addEventListener('DOMContentLoaded', function() {
    initializeLoginPage();
    setupEventListeners();
});

// Khởi tạo trang đăng nhập
function initializeLoginPage() {
    // Kiểm tra nếu đã đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        redirectBasedOnRole(currentUser.role);
        return;
    }
    
    // Khởi tạo dữ liệu mẫu nếu chưa có
    initializeSampleData();
}

// Khởi tạo dữ liệu mẫu
function initializeSampleData() {
    let users = JSON.parse(localStorage.getItem('users'));
    
    if (!users) {
        users = [
            {
                username: 'admin',
                password: 'admin',
                role: 'admin',
                email: 'admin@1nt3rnet.com',
                fullName: 'Quản Trị Viên'
            },
            {
                username: 'user',
                password: 'user123',
                role: 'user',
                email: 'user@example.com',
                fullName: 'Người Dùng'
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Khởi tạo sản phẩm mẫu nếu chưa có
    if (!localStorage.getItem('products')) {
        const defaultProducts = [
            {
                id: 1,
                name: "Áo Thun Cotton Basic",
                type: "ao-thun",
                price: 199000,
                originalPrice: 299000,
                image: "images/ao-thun-basic.jpg",
                description: "Áo thun cotton 100% thoáng mát, form dáng chuẩn",
                stock: 50
            },
            {
                id: 2,
                name: "Áo Sơ Mi Trắng",
                type: "ao-so-mi",
                price: 399000,
                image: "images/ao-so-mi-trang.jpg",
                description: "Áo sơ mi trắng thanh lịch, chất liệu cao cấp",
                stock: 30
            },
            {
                id: 3,
                name: "Áo Khoác Denim",
                type: "ao-khoac",
                price: 599000,
                image: "images/ao-khoac-denim.jpg",
                description: "Áo khoác denim phong cách, bền đẹp",
                stock: 25
            },
            {
                id: 4,
                name: "Quần Jeans Slim",
                type: "quan-jeans",
                price: 499000,
                image: "images/quan-jeans-slim.jpg",
                description: "Quần jeans slim fit ôm vừa vặn",
                stock: 40
            },
            {
                id: 5,
                name: "Váy Liền Body",
                type: "vay-lien",
                price: 699000,
                image: "images/vay-lien-body.jpg",
                description: "Váy liền body quyến rũ, chất liệu mềm mại",
                stock: 20
            }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
}

// Thiết lập event listeners
function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    // Xử lý submit form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Close modal
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            closeModal('loginErrorModal');
        });
    }
    
    // Social login buttons (demo)
    const googleBtn = document.querySelector('.btn-google');
    const facebookBtn = document.querySelector('.btn-facebook');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            showToast('Tính năng đăng nhập bằng Google đang phát triển', 'info');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            showToast('Tính năng đăng nhập bằng Facebook đang phát triển', 'info');
        });
    }
}

// Xử lý đăng nhập
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Hiển thị loading
    showLoading(true);
    
    // Giả lập delay xử lý
    setTimeout(() => {
        const loginResult = authenticateUser(username, password);
        
        if (loginResult.success) {
            // Lưu thông tin đăng nhập
            localStorage.setItem('currentUser', JSON.stringify(loginResult.user));
            
            if (rememberMe) {
                localStorage.setItem('rememberedUser', username);
            }
            
            showToast('Đăng nhập thành công!', 'success');
            
            // Chuyển hướng sau 1 giây
            setTimeout(() => {
                redirectBasedOnRole(loginResult.user.role);
            }, 1000);
            
        } else {
            showLoading(false);
            showErrorModal(loginResult.message);
        }
    }, 1500);
}

// Xác thực người dùng
function authenticateUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Tìm user trong database
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        return {
            success: true,
            user: {
                username: user.username,
                role: user.role,
                email: user.email,
                fullName: user.fullName
            }
        };
    } else {
        return {
            success: false,
            message: 'Tên đăng nhập hoặc mật khẩu không đúng!'
        };
    }
}

// Chuyển hướng dựa trên role
function redirectBasedOnRole(role) {
    switch(role) {
        case 'admin':
            window.location.href = 'admin.html';
            break;
        case 'user':
            window.location.href = 'index.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

// Hiển thị loading
function showLoading(show) {
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    
    if (show) {
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
    } else {
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
    }
}

// Hiển thị modal lỗi
function showErrorModal(message) {
    const modal = document.getElementById('loginErrorModal');
    const errorMessage = document.getElementById('errorMessage');
    
    if (modal && errorMessage) {
        errorMessage.textContent = message;
        modal.style.display = 'block';
    }
}

// Đóng modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Hiển thị toast message
function showToast(message, type = 'info') {
    // Tạo toast element
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
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
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

// Thêm CSS cho toast
const toastStyle = document.createElement('style');
toastStyle.textContent = `
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
    
    .hidden {
        display: none !important;
    }
`;
document.head.appendChild(toastStyle);

// Đóng modal khi click bên ngoài
window.addEventListener('click', function(event) {
    const modal = document.getElementById('loginErrorModal');
    if (event.target === modal) {
        closeModal('loginErrorModal');
    }
});

// Đóng modal bằng phím ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal('loginErrorModal');
    }
});