<?php
// your db server ip
$DB_SERVER = "localhost";
// your db name
$DB_NAME = "apply-tool";
// your db username
$DB_USERNAME = "apply-tool";
// your db password
$DB_PASSWORD = "";

//show errors. you should turn 'display_errors' on in php.ini too
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// connect to database. if errors occurred, display the error message.
try{
    $pdo_apply = new PDO("mysql:host=".$DB_SERVER.";dbname=".$DB_NAME.";charset=utf8mb4",$DB_USERNAME,$DB_PASSWORD);
    $pdo_apply->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e){
    die("<b>與資料庫連接時發生錯誤:</b> ".$e->getMessage());
}
?>
