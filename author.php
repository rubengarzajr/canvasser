<!DOCTYPE html>
<?php

?>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Author</title>
        <link rel="shortcut icon" href="favicon.ico" />
        <script src="js/canvasser.js" type="text/javascript"></script>
        <script src="js/authorcanvasser.js" type="text/javascript"></script>
        <link href="css/normalize.css" rel="stylesheet" type="text/css"/>
        <link href="css/canvasser.css" rel="stylesheet" type="text/css"/>
    </head>
    <body onload="initAuthorCanvasser()">
        <?php include 'header.php';?>
        <div id="graphical">
            <div id='canvasholder' class="activity"></div>
            <div id='imageholder' class="imagebank"></div>
            <div id='objectholder' class="objectbank"></div>
        </div>
        <div id="properties"></div>
        <div id="authorspace"></div>
    </body>
</html>
