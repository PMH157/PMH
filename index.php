<?php
include("db_config.php");
include(__DIR__ . "/db_config.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản Lý Quần Áo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Quản Lý Tủ Quần Áo</h1>
            <p class="subtitle">Thêm, xem, sửa và xóa các món đồ trong tủ quần áo của bạn</p>
        </header>

        <div class="main-content">
            <section class="form-section">
                <h2>Thông Tin Quần Áo</h2>
                <form id="clothing-form">
                    <input type="hidden" id="item-id">
                    <div class="form-group">
                        <label for="name">Tên sản phẩm:</label>
                        <input type="text" id="name" placeholder="Ví dụ: Áo thun trắng" required>
                    </div>
                    <div class="form-group">
                        <label for="type">Loại:</label>
                        <select id="type" required>
                            <option value="">Chọn loại</option>
                            <option value="Áo">Áo</option>
                            <option value="Quần">Quần</option>
                            <option value="Váy">Váy</option>
                            <option value="Áo khoác">Áo khoác</option>
                            <option value="Phụ kiện">Phụ kiện</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="color">Màu sắc:</label>
                        <input type="text" id="color" placeholder="Ví dụ: Đen, Trắng, Xanh" required>
                    </div>
                    <div class="form-group">
                        <label for="size">Kích cỡ:</label>
                        <select id="size" required>
                            <option value="">Chọn kích cỡ</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="brand">Thương hiệu:</label>
                        <input type="text" id="brand" placeholder="Ví dụ: Nike, Zara">
                    </div>
                    <div class="form-group">
                        <label for="price">Giá (VNĐ):</label>
                        <input type="number" id="price" min="0" placeholder="Ví dụ: 250000">
                    </div>
                    <div class="form-group">
                        <label for="quantity">Số lượng:</label>
                        <input type="number" id="quantity" min="1" value="1" required>
                    </div>
                    <div class="form-group">
                        <label for="status">Tình trạng:</label>
                        <select id="status" required>
                            <option value="">Chọn tình trạng</option>
                            <option value="Mới">Mới</option>
                            <option value="Đã sử dụng">Đã sử dụng</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="notes">Ghi chú:</label>
                        <textarea id="notes" rows="3" placeholder="Ghi chú thêm về sản phẩm..."></textarea>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" id="save-btn">Thêm Mới</button>
                        <button type="button" id="cancel-btn" class="cancel">Hủy</button>
                    </div>
                </form>
            </section>

            <section class="list-section">
                <h2>Danh Sách Quần Áo</h2>
                <div class="clothing-list" id="clothing-list">
                </div>
            </section>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
