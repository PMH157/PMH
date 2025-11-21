// Lấy danh sách từ localStorage
let productList = JSON.parse(localStorage.getItem("products")) || [];

// DOM
const form = document.getElementById("product-form");
const listContainer = document.getElementById("product-list");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const productId = document.getElementById("product-id");

// HIỂN THỊ DANH SÁCH
function renderList() {
    listContainer.innerHTML = "";

    if (productList.length === 0) {
        listContainer.innerHTML = `<p class="empty-message">Chưa có sản phẩm nào.</p>`;
        return;
    }

    productList.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "product-item";

        div.innerHTML = `
            <div class="item-info">
                <h3>${item.name}</h3>
                <div class="item-details">
                    <span>${item.type}</span>
                    <span>${item.color}</span>
                    <span>${item.size}</span>
                    <span>${item.brand}</span>
                    <span>${formatPrice(item.price)}₫</span>
                    <span>Số lượng: ${item.quantity}</span>
                    <span>${item.status}</span>
                </div>
                <p class="item-notes">${item.notes || ""}</p>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editProduct(${index})">Sửa</button>
                <button class="delete-btn" onclick="deleteProduct(${index})">Xóa</button>
            </div>
        `;

        listContainer.appendChild(div);
    });
}

// XỬ LÝ THÊM / CẬP NHẬT SẢN PHẨM
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const newProduct = {
        name: document.getElementById("name").value,
        type: document.getElementById("type").value,
        color: document.getElementById("color").value,
        size: document.getElementById("size").value,
        brand: document.getElementById("brand").value,
        price: parseInt(document.getElementById("price").value),
        image: document.getElementById("image").value,
        quantity: parseInt(document.getElementById("quantity").value),
        status: document.getElementById("status").value,
        notes: document.getElementById("notes").value,
    };

    const id = productId.value;

    if (id === "") {
        productList.push(newProduct);
    } else {
        productList[id] = newProduct;
        saveBtn.textContent = "Thêm Mới";
        productId.value = "";
    }

    localStorage.setItem("products", JSON.stringify(productList));

    form.reset();
    renderList();
});

// NÚT SỬA
function editProduct(index) {
    const product = productList[index];

    document.getElementById("name").value = product.name;
    document.getElementById("type").value = product.type;
    document.getElementById("color").value = product.color;
    document.getElementById("size").value = product.size;
    document.getElementById("brand").value = product.brand;
    document.getElementById("price").value = product.price;
    document.getElementById("image").value = product.image;
    document.getElementById("quantity").value = product.quantity;
    document.getElementById("status").value = product.status;
    document.getElementById("notes").value = product.notes;

    productId.value = index;
    saveBtn.textContent = "Cập Nhật";
}

// NÚT XÓA
function deleteProduct(index) {
    if (confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
        productList.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(productList));
        renderList();
    }
}

// NÚT HỦY
cancelBtn.addEventListener("click", function() {
    form.reset();
    productId.value = "";
    saveBtn.textContent = "Thêm Mới";
});

// ĐỊNH DẠNG GIÁ
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// CHUYỂN VỀ TRANG USER
document.addEventListener('DOMContentLoaded', function() {
    const switchToUserBtn = document.getElementById('switchToUserBtn');
    if (switchToUserBtn) {
        switchToUserBtn.addEventListener('click', function() {
            switchToUserMode();
        });
    }
});

function switchToUserMode() {
    const defaultUser = {
        username: 'user',
        password: 'user123',
        role: 'user'
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.username === defaultUser.username);
    
    if (!userExists) {
        users.push(defaultUser);
        localStorage.setItem('users', JSON.stringify(users));
    }

    localStorage.setItem('currentUser', JSON.stringify({
        username: defaultUser.username,
        role: defaultUser.role
    }));

    window.location.href = 'index_user.html';
}

// KHỞI TẠO
renderList();