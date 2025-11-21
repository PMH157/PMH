// Lấy danh sách từ localStorage
let clothingList = JSON.parse(localStorage.getItem("clothes")) || [];

// DOM
const form = document.getElementById("clothing-form");
const listContainer = document.getElementById("clothing-list");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const itemId = document.getElementById("item-id");

// HIỂN THỊ DANH SÁCH
function renderList() {
    listContainer.innerHTML = "";

    if (clothingList.length === 0) {
        listContainer.innerHTML = `<p class="empty-message">Chưa có sản phẩm nào.</p>`;
        return;
    }

    clothingList.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "clothing-item";

        div.innerHTML = `
            <div class="item-info">
                <h3>${item.name}</h3>
                <div class="item-details">
                    <span>${item.type}</span>
                    <span>${item.color}</span>
                    <span>${item.size}</span>
                    <span>${item.brand}</span>
                    <span>${item.price} VNĐ</span>
                    <span>Số lượng: ${item.quantity}</span>
                    <span>${item.status}</span>
                </div>
                <p class="item-notes">${item.notes || ""}</p>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editItem(${index})">Sửa</button>
                <button class="delete-btn" onclick="deleteItem(${index})">Xóa</button>
            </div>
        `;

        listContainer.appendChild(div);
    });
}

// XỬ LÝ THÊM / CẬP NHẬT SẢN PHẨM
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const newItem = {
        name: document.getElementById("name").value,
        type: document.getElementById("type").value,
        color: document.getElementById("color").value,
        size: document.getElementById("size").value,
        brand: document.getElementById("brand").value,
        price: document.getElementById("price").value,
        quantity: document.getElementById("quantity").value,
        status: document.getElementById("status").value,
        notes: document.getElementById("notes").value,
    };

    const id = itemId.value;

    if (id === "") {
        clothingList.push(newItem);
    } else {
        clothingList[id] = newItem;
        saveBtn.textContent = "Thêm Mới";
        itemId.value = "";
    }

    localStorage.setItem("clothes", JSON.stringify(clothingList));

    form.reset();
    renderList();
});

// NÚT SỬA
function editItem(index) {
    const item = clothingList[index];

    document.getElementById("name").value = item.name;
    document.getElementById("type").value = item.type;
    document.getElementById("color").value = item.color;
    document.getElementById("size").value = item.size;
    document.getElementById("brand").value = item.brand;
    document.getElementById("price").value = item.price;
    document.getElementById("quantity").value = item.quantity;
    document.getElementById("status").value = item.status;
    document.getElementById("notes").value = item.notes;

    itemId.value = index;
    saveBtn.textContent = "Cập Nhật";
}

// NÚT XÓA
function deleteItem(index) {
    if (confirm("Bạn chắc chắn muốn xóa?")) {
        clothingList.splice(index, 1);
        localStorage.setItem("clothes", JSON.stringify(clothingList));
        renderList();
    }
}

// NÚT HỦY
cancelBtn.addEventListener("click", function() {
    form.reset();
    itemId.value = "";
    saveBtn.textContent = "Thêm Mới";
});

// KHỞI TẠO
renderList();