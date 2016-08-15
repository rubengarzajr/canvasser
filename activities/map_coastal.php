<?php
?>
<head>
        <title>Canvasser</title>
    </head>
    <body onload='initCanvasser("tex","../data/map_coastal.json", "file");'>
        <?php include 'activityheader.php';?>
        <div class="title_a">Texas Regions</div>
        <div id='canvasholder' style="min-height: 100%; min-width: 100%; text-align: center;position:absolute;"></div>
        <script type="text/javascript">
            function hide_floater(element){
                document.getElementById(element).innerHTML = "";
            }
        </script>
        <style>
            .darkbox{height: 100%; min-width: 100%; background-color: rgba(0,0,0,0.85); text-align: center; position:fixed;color:white;left:0;top:0;padding-top:10px;overflow-y: scroll;padding-top:40px;}
        </style>
        <div id="lls01" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls02" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls03" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls04" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls05" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls06" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls07" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls08" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls09" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls10" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls11" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls12" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls13" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls14" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls15" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls16" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls17" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls18" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls19" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls20" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls21" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls22" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls23" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls24" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls25" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls26" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls27" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls28" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls29" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls30" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls31" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls32" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls33" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls34" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls35" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls36" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls37" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="lls38" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="llt01" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Content</div></div>
        <div id="ant02" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Rush Site</div></div>
        <div id="ant03" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Big Lake Bison Kill</div></div>
        <div id="ant04" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Mitte Site</div></div>
        <div id="ant05" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Musk Nog Canyon</div></div>
        <div id="ant06" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Buckhollow Site</div></div>
        <div id="ant07" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Devil's Sinkhole</div></div>
        <div id="ant08" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Bering Sinkhole</div></div>
        <div id="ant09" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Woodrow Heard Site</div></div>
        <div id="ant10" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Fall Creek</div></div>
        <div id="ant11" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Wilson-Leonard Site</div></div>
        <div id="ant12" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Enchanted Rock</div></div>
        <div id="ant13" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Lehmann Shelter</div></div>
        <div id="ant14" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Sleep Site</div></div>
        <div id="ant15" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Flint Knob</div></div>
        <div id="ant16" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Mustang Branch</div></div>
        <div id="ant17" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Canyon Reservoir</div></div>
        <div id="anc01" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Hind's Cave</div></div>
        <div id="anc02" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Bonfire Shelter</div></div>
        <div id="anc03" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Lower Pecos</div></div>
        <div id="anc04" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Honey Creek</div></div>
        <div id="anc05" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Graham Applegate</div></div>
        <div id="anc06" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Pavo Rael</div></div>
        <div id="anc07" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Kincaid Shelter</div></div>
        <div id="het01" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">San Honofre</div></div>
        <div id="het02" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Jediondos</div></div>
        <div id="het03" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Pecos Campsite</div></div>
        <div id="het04" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Hackberry Spring</div></div>
        <div id="het05" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Jumano Indians</div></div>
        <div id="het06" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">San Miguel</div></div>
        <div id="het07" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Buffalo Hunting</div></div>
        <div id="het08" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">River of Pearls</div></div>
        <div id="het09" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Paint Rock Pictographs</div></div>
        <div id="het10" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Vaquero Shelter</div></div>
        <div id="het11" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Geniocane Indians</div></div>
        <div id="het12" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Mission San Lorenzo</div></div>
        <div id="het13" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Mission Candelaria</div></div>
        <div id="het14" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Frio Canyon Pictographs</div></div>
        <div id="het15" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Bandera Pass</div></div>
        <div id="het16" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Los Almagres</div></div>
        <div id="het17" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Missions near Barton Springs</div></div>
        <div id="het18" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">San Francisco Xavier Missions</div></div>
        <div id="hec01" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Presidio San Saba</div></div>
        <div id="hec02" style="display:none"><div class="darkbox" onclick="hide_floater('display_region')">Mission San Saba</div></div>
        <div id='display_region'">default</div>
    </body>
</html>