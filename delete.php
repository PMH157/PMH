<?php
// delete.php
if(!isset($_GET['id'])){
    header("Location: index.php");
    exit();
}

$maSP = $_GET['id'];

include_once("db_config.php");

$cn = new mysqli($servername, $username, $password, $dbname);
if($cn->connect_error){
    die("Lỗi kết nối: ". $cn->connect_error);
}

// Xóa sản phẩm
$sql = "DELETE FROM sanpham WHERE MaSP = ?";
$stmt = $cn->prepare($sql);
$stmt->bind_param("s", $maSP);

if($stmt->execute()){
    header("Location: index.php?message=Sản phẩm đã được xóa thành công&type=success");
} else {
    header("Location: index.php?message=Lỗi khi xóa sản phẩm&type=error");
}

$stmt->close();
$cn->close();
?>