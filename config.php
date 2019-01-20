<?php
$DB_SERVER = "localhost";
$DB_NAME = "apply-tool";
$DB_USERNAME = "apply-tool";
$DB_PASSWORD = "";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try{
    $pdo_apply = new PDO("mysql:host=".$DB_SERVER.";dbname=".$DB_NAME,$DB_USERNAME,$DB_PASSWORD);
    $pdo_apply->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
    $pdo_apply->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e){
    die("<b>與資料庫連接時發生錯誤:</b> ".$e->getMessage());
}
?>
