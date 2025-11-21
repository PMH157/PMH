document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - checking elements...');
    
    // Kiểm tra xem tất cả các phần tử có tồn tại không
    const registerForm = document.getElementById('registerForm');
    const regUsername = document.getElementById('regUsername');
    const regPassword = document.getElementById('regPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    console.log('Form:', registerForm);
    console.log('Username input:', regUsername);
    console.log('Password input:', regPassword);
    console.log('Confirm password input:', confirmPassword);
    
    if (!registerForm || !regUsername || !regPassword || !confirmPassword) {
        console.error('Một hoặc nhiều phần tử không tồn tại!');
        alert('Có lỗi xảy ra khi tải trang. Vui lòng thử lại!');
        return;
    }
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted successfully');
        
        // Lấy giá trị từ các input
        const username = regUsername.value.trim();
        const password = regPassword.value.trim();
        const confirmPass = confirmPassword.value.trim();
        
        console.log('Values:', { username, password, confirmPass });
        
        // Kiểm tra các trường không được để trống
        if (!username || !password || !confirmPass) {
            showErrorModal('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        
        // Kiểm tra mật khẩu xác nhận
        if (password !== confirmPass) {
            showPasswordMismatchModal();
            return;
        }
        
        // Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            showPasswordShortModal();
            return;
        }
        
        // Xử lý đăng ký
        handleRegistration(username, password);
    });
    
    // Thiết lập sự kiện cho các nút đóng modal
    setupModalCloseButtons();
});

function setupModalCloseButtons() {
    // Lấy tất cả các nút đóng modal
    const closeButtons = document.querySelectorAll('.modal-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Ẩn tất cả modal
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
    
    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function showErrorModal(message) {
    // Tạo modal lỗi tạm thời
    const tempModal = document.createElement('div');
    tempModal.className = 'modal';
    tempModal.style.display = 'block';
    tempModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon error">⚠️</div>
            <h3>Lỗi</h3>
            <p>${message}</p>
            <button class="modal-close-btn">OK</button>
        </div>
    `;
    document.body.appendChild(tempModal);
    
    // Thêm sự kiện cho nút đóng
    tempModal.querySelector('.modal-close-btn').addEventListener('click', function() {
        document.body.removeChild(tempModal);
    });
    
    // Tự động đóng sau 3 giây
    setTimeout(() => {
        if (document.body.contains(tempModal)) {
            document.body.removeChild(tempModal);
        }
    }, 3000);
}

function showPasswordMismatchModal() {
    const modal = document.getElementById('passwordMismatchModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        showErrorModal('Mật khẩu xác nhận không khớp!');
    }
}

function showPasswordShortModal() {
    const modal = document.getElementById('passwordShortModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        showErrorModal('Mật khẩu phải có ít nhất 6 ký tự!');
    }
}

function showUsernameExistsModal() {
    const modal = document.getElementById('usernameExistsModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        showErrorModal('Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.');
    }
}

function handleRegistration(username, password) {
    console.log('Handling registration...');
    
    // Lấy danh sách users từ localStorage
    let users = [];
    try {
        const usersData = localStorage.getItem('users');
        if (usersData) {
            users = JSON.parse(usersData);
        }
    } catch (error) {
        console.error('Error parsing users data:', error);
        users = [];
    }
    
    // Kiểm tra username đã tồn tại chưa
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        showUsernameExistsModal();
        return;
    }
    
    // Lưu thông tin đăng ký
    users.push({ 
        username: username, 
        password: password 
    });
    
    try {
        localStorage.setItem('users', JSON.stringify(users));
        console.log('User registered successfully');
        
        // Hiển thị modal thông báo thành công
        showSuccessModal();
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showErrorModal('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!');
    }
}

function showSuccessModal() {
    console.log('Showing success modal');
    const modal = document.getElementById('successModal');
    const okBtn = document.getElementById('modalOkBtn');
    
    if (!modal || !okBtn) {
        console.error('Modal elements not found!');
        // Fallback: dùng alert và chuyển hướng
        showErrorModal('Đã đăng ký tài khoản thành công!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return;
    }
    
    modal.style.display = 'block';
    
    // Xử lý nút OK trong modal
    okBtn.onclick = function() {
        console.log('OK button clicked');
        window.location.href = 'login.html';
    };
    
    // Tự động chuyển hướng sau 3 giây
    setTimeout(function() {
        if (modal.style.display === 'block') {
            console.log('Auto redirecting to login page');
            window.location.href = 'login.html';
        }
    }, 3000);
}