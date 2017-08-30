<?php
?>
<html>
    <head>
        <title>Canvasser</title>
        <script>
        function loader() {initCanvasser("tex","../json/particles_sample2.json", "file", [{"paths.0.url":"../image"},{"settings.canvasparent":"newholder"}]);}
        </script>
    </head>
    <body onload='loader();'>
        <?php include 'activityheader.php';?>
        <div class="title_a">Overrides</div>
        <div id='canvasholder' style="float:left"></div>
        <div id='newholder' style="float:left"></div>
    </body>
</html>
