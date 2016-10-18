<?php
/**
 * Created by PhpStorm.
 * User: gustavog
 * Date: 15/10/16
 * Time: 11:10 PM
 */
include 'class.db.php';
$db = new SQL("localhost","root","gg","chat");
$limitMessage = 20;
if(!isset($_SESSION)){
    session_start();
}
if(isset($_GET['q']) && $_GET['q'] == "reset") unset($_SESSION['limit']);

if(!isset($_SESSION['id'])){
    $_SESSION['id'] = uniqid();
}
if(!isset($_SESSION['limit'])){
    $_SESSION['limit'] = max(1,$db->fetch_item_field("SELECT MAX(id) FROM messages")+1);
}

if(isset($_POST['send'])){
    $username = $_POST['username'];
    $message = $_POST['message'];
    $_SESSION['limit'] = $db->insert("INSERT INTO messages SET username='$username', idTemp='{$_SESSION['id']}', message='$message' ");
}

$menssages = $db->fetch_all("SELECT * FROM (SELECT * FROM messages WHERE id>={$_SESSION['limit']} ORDER BY id DESC LIMIT $limitMessage) sub ORDER BY id ASC");

if($menssages) {
    foreach ($menssages as $key => $value) {
        if($value['idTemp'] == $_SESSION['id']) {
            $menssages[$key]['isMe'] = true;
        }
        else {
            $menssages[$key]['isMe'] = false;
        }
    }

    echo json_encode($menssages);
}