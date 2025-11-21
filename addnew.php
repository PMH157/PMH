<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thêm Sản Phẩm Mới</title>
    <style>
        .form-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        input, select, textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 3px;
            box-sizing: border-box;
        }
        
        .form-buttons {
            margin-top: 20px;
            text-align: center;
        }
        
        button {
            padding: 10px 20px;
            margin: 0 10px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        
        .btn-save {
            background: #28a745;
            color: white;
        }
        
        .btn-cancel {
            background: #6c757d;
            color: white;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>Thêm Sản Phẩm Mới</h2>
        
        <?php
        if($_SERVER["REQUEST_METHOD"] == "POST"){
            include_once("db_config.php");
            
            $cn = new mysqli($servername, $username, $password, $dbname);
            if($cn->connect_error){
                die("Lỗi kết nối: ". $cn->connect_error);
            }
            
            // Lấy dữ liệu từ form
            $tenSP = $_POST['tenSP'];
            $giaBan = $_POST['giaBan'];
            $maDM = $_POST['maDM'];
            $maTH = $_POST['maTH'];
            $mauSac = $_POST['mauSac'];
            $kichThuoc = $_POST['kichThuoc'];
            $moTa = $_POST['moTa'];
            
            // Tạo mã sản phẩm mới
            $sql = "SELECT COUNT(*) as count FROM sanpham";
            $result = $cn->query($sql);
            $row = $result->fetch_assoc();
            $count = $row['count'] + 1;
            $maSP = 'SP' . str_pad($count, 3, '0', STR_PAD_LEFT);
            
            // Thêm sản phẩm mới
            $sql = "INSERT INTO sanpham (MaSP, TenSP, GiaBan, GiaGoc, MoTa, SoLuongTon, MaDM, MaTH, GioiTinh, ChatLieu, MauSac, KichThuoc, TrangThai) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $cn->prepare($sql);
            
            // Thiết lập các giá trị mặc định
            $giaGoc = $giaBan * 0.9;
            $soLuongTon = 1;
            $gioiTinh = 'unisex';
            $chatLieu = 'Cotton';
            $trangThai = 'con_hang';
            
            $stmt->bind_param("ssddsssssssss", 
                $maSP, $tenSP, $giaBan, $giaGoc, $moTa, $soLuongTon, 
                $maDM, $maTH, $gioiTinh, $chatLieu, $mauSac, $kichThuoc, $trangThai
            );
            
            if($stmt->execute()){
                header("Location: index.php?message=Sản phẩm đã được thêm thành công&type=success");
                exit();
            } else {
                echo "<p style='color: red;'>Lỗi khi thêm sản phẩm: " . $stmt->error . "</p>";
            }
            
            $stmt->close();
            $cn->close();
        }
        ?>
        
        <form method="POST">
            <div class="form-group">
                <label for="tenSP">Tên sản phẩm:</label>
                <input type="text" id="tenSP" name="tenSP" required>
            </div>
            
            <div class="form-group">
                <label for="giaBan">Giá bán (VNĐ):</label>
                <input type="number" id="giaBan" name="giaBan" min="0" required>
            </div>
            
            <div class="form-group">
                <label for="maDM">Danh mục:</label>
                <select id="maDM" name="maDM" required>
                    <option value="">Chọn danh mục</option>
                    <?php
                    include_once("db_config.php");
                    $cn = new mysqli($servername, $username, $password, $dbname);
                    $sql = "SELECT MaDM, TenDM FROM danhmuc WHERE TrangThai = 1 ORDER BY TenDM";
                    $result = $cn->query($sql);
                    
                    while($row = $result->fetch_assoc()){
                        echo "<option value='{$row['MaDM']}'>{$row['TenDM']}</option>";
                    }
                    $cn->close();
                    ?>
                </select>
            </div>
            
            <div class="form-group">
                <label for="maTH">Thương hiệu:</label>
                <select id="maTH" name="maTH" required>
                    <option value="">Chọn thương hiệu</option>
                    <?php
                    include_once("db_config.php");
                    $cn = new mysqli($servername, $username, $password, $dbname);
                    $sql = "SELECT MaTH, TenTH FROM thuonghieu ORDER BY TenTH";
                    $result = $cn->query($sql);
                    
                    while($row = $result->fetch_assoc()){
                        echo "<option value='{$row['MaTH']}'>{$row['TenTH']}</option>";
                    }
                    $cn->close();
                    ?>
                </select>
            </div>
            
            <div class="form-group">
                <label for="mauSac">Màu sắc:</label>
                <input type="text" id="mauSac" name="mauSac" required>
            </div>
            
            <div class="form-group">
                <label for="kichThuoc">Kích thước:</label>
                <select id="kichThuoc" name="kichThuoc" required>
                    <option value="">Chọn kích thước</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="moTa">Mô tả:</label>
                <textarea id="moTa" name="moTa" rows="4"></textarea>
            </div>
            
            <div class="form-buttons">
                <button type="submit" class="btn-save">Lưu</button>
                <a href="index.php"><button type="button" class="btn-cancel">Hủy</button></a>
            </div>
        </form>
    </div>
</body>
</html>