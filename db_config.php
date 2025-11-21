<?php
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "mywebdb";  

// Tạo kết nối không chọn database trước
$cn = new mysqli($servername, $username, $password);

// Kiểm tra kết nối
if ($cn->connect_error) {
    die("Kết nối thất bại: " . $cn->connect_error);
}

// Tạo database nếu chưa tồn tại
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($cn->query($sql) === TRUE) {
    // Chọn database
    $cn->select_db($dbname);
    
    // CHỈ tạo bảng clothing đơn giản (xóa các bảng phức tạp khác)
    $table_sql = "CREATE TABLE IF NOT EXISTS clothing (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        color VARCHAR(100) NOT NULL,
        size VARCHAR(10) NOT NULL,
        brand VARCHAR(100),
        price DECIMAL(10,2),
        quantity INT DEFAULT 1,
        status VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if (!$cn->query($table_sql)) {
        die("Lỗi tạo bảng: " . $cn->error);
    }
    
    echo "<!-- Database và bảng đã sẵn sàng -->";
    
} else {
    die("Lỗi tạo database: " . $cn->error);
}

// Thiết lập charset
$cn->set_charset("utf8");
?>