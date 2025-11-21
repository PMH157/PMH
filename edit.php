<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chỉnh Sửa Sản Phẩm</title>
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
        <h2>Chỉnh Sửa Sản Phẩm</h2>
        
        <?php
        if(!isset($_GET['id'])){
            header("Location: index.php");
            exit();
        }
        
        $maSP = $_GET['id'];
        
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
            $trangThai = $_POST['trangThai'];
            
            // Cập nhật sản phẩm
            $sql = "UPDATE sanpham SET TenSP=?, GiaBan=?, MaDM=?, MaTH=?, MauSac=?, KichThuoc=?, MoTa=?, TrangThai=? WHERE MaSP=?";
            
            $stmt = $cn->prepare($sql);
            $stmt->bind_param("sdsssssss", $tenSP, $giaBan, $maDM, $maTH, $mauSac, $kichThuoc, $moTa, $trangThai, $maSP);
            
            if($stmt->execute()){
                header("Location: index.php?message=Sản phẩm đã được cập nhật thành công&type=success");
                exit();
            } else {
                echo "<p style='color: red;'>Lỗi khi cập nhật sản phẩm: " . $stmt->error . "</p>";
            }
            
            $stmt->close();
            $cn->close();
        }
        
        // Lấy thông tin sản phẩm hiện tại
        include_once("db_config.php");
        $cn = new mysqli($servername, $username, $password, $dbname);
        $sql = "SELECT * FROM sanpham WHERE MaSP = ?";
        $stmt = $cn->prepare($sql);
        $stmt->bind_param("s", $maSP);
        $stmt->execute();
        $result = $stmt->get_result();
        $product = $result->fetch_assoc();
        
        if(!$product){
            header("Location: index.php");
            exit();
        }
        ?>
        
        <form method="POST">
            <div class="form-group">
                <label for="tenSP">Tên sản phẩm:</label>
                <input type="text" id="tenSP" name="tenSP" value="<?php echo $product['TenSP']; ?>" required>
            </div>
            
            <div class="form-group">
                <label for="giaBan">Giá bán (VNĐ):</label>
                <input type="number" id="giaBan" name="giaBan" value="<?php echo $product['GiaBan']; ?>" min="0" required>
            </div>
            
            <div class="form-group">
                <label for="maDM">Danh mục:</label>
                <select id="maDM" name="maDM" required>
                    <?php
                    $sql = "SELECT MaDM, TenDM FROM danhmuc WHERE TrangThai = 1 ORDER BY TenDM";
                    $result = $cn->query($sql);
                    
                    while($row = $result->fetch_assoc()){
                        $selected = ($row['MaDM'] == $product['MaDM']) ? 'selected' : '';
                        echo "<option value='{$row['MaDM']}' {$selected}>{$row['TenDM']}</option>";
                    }
                    ?>
                </select>
            </div>
            
            <div class="form-group">
                <label for="maTH">Thương hiệu:</label>
                <select id="maTH" name="maTH" required>
                    <?php
                    $sql = "SELECT MaTH, TenTH FROM thuonghieu ORDER BY TenTH";
                    $result = $cn->query($sql);
                    
                    while($row = $result->fetch_assoc()){
                        $selected = ($row['MaTH'] == $product['MaTH']) ? 'selected' : '';
                        echo "<option value='{$row['MaTH']}' {$selected}>{$row['TenTH']}</option>";
                    }
                    ?>
                </select>
            </div>
            
            <div class="form-group">
                <label for="mauSac">Màu sắc:</label>
                <input type="text" id="mauSac" name="mauSac" value="<?php echo $product['MauSac']; ?>" required>
            </div>
            
            <div class="form-group">
                <label for="kichThuoc">Kích thước:</label>
                <select id="kichThuoc" name="kichThuoc" required>
                    <option value="S" <?php echo ($product['KichThuoc'] == 'S') ? 'selected' : ''; ?>>S</option>
                    <option value="M" <?php echo ($product['KichThuoc'] == 'M') ? 'selected' : ''; ?>>M</option>
                    <option value="L" <?php echo ($product['KichThuoc'] == 'L') ? 'selected' : ''; ?>>L</option>
                    <option value="XL" <?php echo ($product['KichThuoc'] == 'XL') ? 'selected' : ''; ?>>XL</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="trangThai">Tình trạng:</label>
                <select id="trangThai" name="trangThai" required>
                    <option value="con_hang" <?php echo ($product['TrangThai'] == 'con_hang') ? 'selected' : ''; ?>>Còn hàng</option>
                    <option value="het_hang" <?php echo ($product['TrangThai'] == 'het_hang') ? 'selected' : ''; ?>>Hết hàng</option>
                    <option value="ngung_ban" <?php echo ($product['TrangThai'] == 'ngung_ban') ? 'selected' : ''; ?>>Ngừng bán</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="moTa">Mô tả:</label>
                <textarea id="moTa" name="moTa" rows="4"><?php echo $product['MoTa']; ?></textarea>
            </div>
            
            <div class="form-buttons">
                <button type="submit" class="btn-save">Cập Nhật</button>
                <a href="index.php"><button type="button" class="btn-cancel">Hủy</button></a>
            </div>
        </form>
        
        <?php
        $stmt->close();
        $cn->close();
        ?>
    </div>
</body>
</html>