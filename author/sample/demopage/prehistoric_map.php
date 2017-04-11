<?php
?>
<html>
    <head>
        <title>Canvasser</title>
    </head>
    <body onload='initCanvasser("tex","../data/prehistoric_map.json", "file");'>
        <?php include 'activityheader.php';?>
        <div class="title_a">Prehistoric Map</div>
        <div id='canvasholder' style="min-height: 100%; min-width: 100%; text-align: center;position:absolute;"></div>
        <script type="text/javascript">
            function hide_floater(element){
                document.getElementById(element).innerHTML = "";
            }
        </script>
        <style>
            .darkbox{min-height: 100%; min-width: 100%; background-color: rgba(0,0,0,0.85); text-align: center; position:absolute;color:white;}
        </style>
        <div id="r"  style="display:none">DEFAULT</div>
        <div id="r1" style="display:none">1</div>
        <div id="r2" style="display:none">2</div>
        <div id="r3" style="display:none">3</div>
        <div id="r4" style="display:none">4</div>
        <div id="r5" style="display:none">5</div>
        <div id="r6" style="display:none">6</div>
        <div id="r7" style="display:none">7</div>
        <div id="r8" style="display:none">8</div>
        <div id="display_region">default</div>
    </body>
</html>