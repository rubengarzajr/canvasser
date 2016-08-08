<?php
?>
<html>
    <head>
        <title>Canvasser</title>
    </head>
    <body onload='initCanvasser("tex","../data/arenosa_archeology.json", "file");'>
        <?php include 'activityheader.php';?>
        <div class="title_a">arenosa_archeology</div>
        <div id='canvasholdera' style="min-height: 100%; min-width: 100%; text-align: center;position:absolute;"></div>
        <script type="text/javascript">
            function hide_floater(element){
                document.getElementById(element).innerHTML = "";
            }
        </script>
        <style>
            .darkbox{height: 100%; min-width: 100%; background-color: rgba(0,0,0,0.85); text-align: center; position:fixed;color:white;left:0;top:0;padding-top:10px;overflow-y: scroll;padding-top:40px;}
        </style>
        <div id="s01" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_sq01a.jpg" onclick='hide_floater("display_arenosa")'><br> TExt Test dgsfgfg</div></div>
        <div id="s02" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_sq02a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="s03" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_sq03a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="s04" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_sq04a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="s05" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_sq05a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="s06" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_sq06a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="s07" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_sq07a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="s08" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_sq08a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="s09" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_sq09a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="s10" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_sq10a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="s11" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_sq11a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="s12" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_sq12a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="s13" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_sq13a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="f01" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_f01a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="f02" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_f02a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="f04" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_f04a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="f05" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_f05a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="f07" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_f07a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="f09" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_f09a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="f10" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_f10a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="f11" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_f11a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="f12" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_f12a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="f17" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_f17a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="f18" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_f18a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="f19" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_f19a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="f21" style="display:none"><div class="darkbox"><img src="http://tbh.laits.utexas.edu/wp-content/uploads/canvasser/explore_arenosa_archeology/arenosa_f21a.jpg" onclick='hide_floater("display_arenosa")'></div></div>
        <div id="display_arenosa" class="position:absolute"></div>
    </body>
</html>