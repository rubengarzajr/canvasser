<?php
?>
<html>
    <head>
        <title>Canvasser</title>
    </head>
    <style>
        canvas{width:65%;}
    </style>
    <body onload='initCanvasser("tex","../json/feature_responsivescaling.json", "file");'>
        <?php include 'activityheader.php';?>
        <div class="title_a">Responsive Scaling</div>
        <div id='canvasholder' style="float:left"></div>
    </body>
</html>
