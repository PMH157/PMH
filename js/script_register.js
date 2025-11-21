// script_register.js - Xử lý đăng ký

document.addEventListener('DOMContentLoaded', function() {
    initializeRegisterPage();
    setupEventListeners();
});

// Khởi tạo trang đăng ký
function initializeRegisterPage() {
    // Kiểm tra nếu đã đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        redirectBasedOnRole(currentUser.role);
        return;
    }
    
    // Khởi tạo dữ liệu mẫu nếu chưa có
    initializeSampleData();
}

// Thiết lập event listeners
function setupEventListeners() {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('regUsername');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Xử lý submit form
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Real-time validation
    if (usernameInput) {
        usernameInput.addEventListener('input', debounce(validateUsername, 500));
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', debounce(validateEmail, 500));
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePasswordStrength(this.value);
            validatePasswordMatch();
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
    
    // Toggle password visibility
    setupPasswordToggle('toggleRegPassword', 'regPassword');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');
    
    // Modal events
    const goToLoginBtn = document.getElementById('goToLogin');
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
    
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            closeModal('successModal');
        });
    }
}

// Xử lý đăng ký
function handleRegister(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = {
        username: document.getElementById('regUsername').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        fullName: document.getElementById('regFullName').value.trim(),
        password: document.getElementById('regPassword').value,
        phone: document.getElementById('phoneNumber').value.trim(),
        newsletter: document.getElementById('newsletter').checked,
        role: 'user'
    };
    
    // Hiển thị loading
    showLoading(true);
    
    // Giả lập delay xử lý
    setTimeout(() => {
        const registerResult = registerUser(formData);
        
        if (registerResult.success) {
            showLoading(false);
            showSuccessModal();
            
            // Tự động chuyển hướng sau 5 giây
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 5000);
            
        } else {
            showLoading(false);
            showError(registerResult.message);
        }
    }, 2000);
}

// Validate form
function validateForm() {
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const fullName = document.getElementById('regFullName').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    let isValid = true;
    
    // Validate username
    if (!username) {
        showInputError('regUsername', 'Vui lòng nhập tên đăng nhập');
        isValid = false;
    } else if (username.length < 3) {
        showInputError('regUsername', 'Tên đăng nhập phải có ít nhất 3 ký tự');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showInputError('regUsername', 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showInputError('regEmail', 'Vui lòng nhập email');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showInputError('regEmail', 'Email không hợp lệ');
        isValid = false;
    }
    
    // Validate full name
    if (!fullName) {
        showInputError('regFullName', 'Vui lòng nhập họ và tên');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showInputError('regPassword', 'Vui lòng nhập mật khẩu');
        isValid = false;
    } else if (password.length < 6) {
        showInputError('regPassword', 'Mật khẩu phải có ít nhất 6 ký tự');
        isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
        showInputError('confirmPassword', 'Vui lòng xác nhận mật khẩu');
        isValid = false;
    } else if (password !== confirmPassword) {
        showInputError('confirmPassword', 'Mật khẩu xác nhận không khớp');
        isValid = false;
    }
    
    // Validate terms
    if (!agreeTerms) {
        showToast('Vui lòng đồng ý với điều khoản dịch vụ', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Validate username
function validateUsername() {
    const username = document.getElementById('regUsername').value.trim();
    const feedback = document.getElementById('usernameFeedback');
    
    if (!username) {
        showInputError('regUsername', '');
        return;
    }
    
    if (username.length < 3) {
        showInputError('regUsername', 'Tên đăng nhập quá ngắn (tối thiểu 3 ký tự)');
        return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showInputError('regUsername', 'Chỉ cho phép chữ cái, số và dấu gạch dưới');
        return;
    }
    
    // Kiểm tra username đã tồn tại
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const usernameExists = users.some(user => user.username === username);
    
    if (usernameExists) {
        showInputError('regUsername', 'Tên đăng nhập đã được sử dụng');
    } else {
        showInputSuccess('regUsername', 'Tên đăng nhập có thể sử dụng');
    }
}

// Validate email
function validateEmail() {
    const email = document.getElementById('regEmail').value.trim();
    
    if (!email) {
        showInputError('regEmail', '');
        return;
    }
    
    if (!isValidEmail(email)) {
        showInputError('regEmail', 'Email không hợp lệ');
        return;
    }
    
    // Kiểm tra email đã tồn tại
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const emailExists = users.some(user => user.email === email);
    
    if (emailExists) {
        showInputError('regEmail', 'Email đã được đăng ký');
    } else {
        showInputSuccess('regEmail', 'Email hợp lệ');
    }
}

// Validate password strength
function validatePasswordStrength(password) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
        strengthFill.style.width = '0%';
        strengthText.textContent = 'Mật khẩu yếu';
        strengthFill.style.background = '#e74c3c';
        return;
    }
    
    let strength = 0;
    let feedback = '';
    
    // Length check
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    
    // Character variety
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    
    // Update UI
    strengthFill.style.width = strength + '%';
    
    if (strength < 50) {
        strengthFill.style.background = '#e74c3c';
        strengthText.textContent = 'Mật khẩu yếu';
    } else if (strength < 75) {
        strengthFill.style.background = '#f39c12';
        strengthText.textContent = 'Mật khẩu trung bình';
    } else {
        strengthFill.style.background = '#27ae60';
        strengthText.textContent = 'Mật khẩu mạnh';
    }
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!confirmPassword) {
        showInputError('confirmPassword', '');
        return;
    }
    
    if (password !== confirmPassword) {
        showInputError('confirmPassword', 'Mật khẩu xác nhận không khớp');
    } else {
        showInputSuccess('confirmPassword', 'Mật khẩu khớp');
    }
}

// Đăng ký user mới
function registerUser(userData) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Kiểm tra trùng username
    const usernameExists = users.some(user => user.username === userData.username);
    if (usernameExists) {
        return {
            success: false,
            message: 'Tên đăng nhập đã được sử dụng!'
        };
    }
    
    // Kiểm tra trùng email
    const emailExists = users.some(user => user.email === userData.email);
    if (emailExists) {
        return {
            success: false,
            message: 'Email đã được đăng ký!'
        };
    }
    
    // Thêm user mới
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    return {
        success: true,
        message: 'Đăng ký thành công!'
    };
}

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showInputError(inputId, message) {
    const input = document.getElementById(inputId);
    const feedback = document.getElementById(inputId + 'Feedback');
    
    if (input) {
        input.style.borderColor = '#e74c3c';
    }
    
    if (feedback) {
        feedback.textContent = message;
        feedback.style.color = '#e74c3c';
        feedback.style.fontSize = '0.8rem';
        feedback.style.marginTop = '5px';
    }
}

function showInputSuccess(inputId, message) {
    const input = document.getElementById(inputId);
    const feedback = document.getElementById(inputId + 'Feedback');
    
    if (input) {
        input.style.borderColor = '#27ae60';
    }
    
    if (feedback) {
        feedback.textContent = message;
        feedback.style.color = '#27ae60';
        feedback.style.fontSize = '0.8rem';
        feedback.style.marginTop = '5px';
    }
}

function showError(message) {
    showToast(message, 'error');
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

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

function setupPasswordToggle(toggleId, passwordId) {
    const toggle = document.getElementById(toggleId);
    const passwordInput = document.getElementById(passwordId);
    
    if (toggle && passwordInput) {
        toggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Thêm CSS cho password strength
const passwordStrengthStyle = document.createElement('style');
passwordStrengthStyle.textContent = `
    .password-strength {
        margin-top: 10px;
    }
    
    .strength-bar {
        width: 100%;
        height: 6px;
        background: #e9ecef;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 5px;
    }
    
    .strength-fill {
        height: 100%;
        width: 0%;
        transition: all 0.3s ease;
        border-radius: 3px;
    }
    
    .strength-text {
        font-size: 0.8rem;
        color: #666;
    }
    
    .btn-outline {
        background: transparent;
        border: 2px solid #e60012;
        color: #e60012;
    }
    
    .btn-outline:hover {
        background: #e60012;
        color: white;
    }
    
    .hidden {
        display: none !important;
    }
`;
document.head.appendChild(passwordStrengthStyle);

// Đóng modal khi click bên ngoài
window.addEventListener('click', function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        closeModal('successModal');
    }
});

// Đóng modal bằng phím ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal('successModal');
    }
});