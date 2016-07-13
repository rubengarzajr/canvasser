<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <div class="header">
            <a href="index.php"><div class="titlecenter">CANVASSER</div>
            <?php
            $url = $_SERVER['REQUEST_URI'];
            $pos = strpos($url, "index");
            if (!$pos) echo '<div class ="divbutton" >Home</div></a>';
            ?>
        </div>
    </body>
</html>
