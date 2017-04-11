<?php
?>
<html>
  <head>
    <title>Canvasser</title>
  </head>
  <style>
    canvas{width:75%;}
  </style>
  <body onload='initCanvasser("particlesystem","../json/feature_particlesystem.json", "file");'>
    <?php include 'activityheader.php';?>
    <div class="title_a">Particle System</div>
    <div id='canvasholder' style="float:left"></div>
  </body>
</html>
