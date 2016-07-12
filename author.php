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
        <div id="menu">
            <div class ="divbutton" onclick="window.author.reload()">Restart</div>
            <div class ="divbutton" onclick="window.author.settings()">Settings</div>
            <div class ="divbutton" onclick="window.author.toggleobjects()">Object List</div>
            <div class ="divbutton" onclick="window.author.toggleimages()">Image List</div>
        </div>
        <div id="graphical">
            <div id='canvasholder' class="activity"></div>
            <div id='imagebank' style="display:block">
                <div class="wintitle">Images</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleimages()" style="margin-top: 2px;"><img id="toggleobjects" src="image/icon_min_g.png"/></div>
                <div id='imageholder' style="display:block"></div>
            </div>
            <div id='objectbank' style="display:block">
                <div class="wintitle">Objects</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleobjects()" style="margin-top: 2px;"><img id="toggleobjects" src="image/icon_min_g.png"/></div>
                <div id="objectmenu" class="submenu">
                    <div class="divbutton" onclick="window.author.addObject()">Add</div>
                    <div class="divbutton" onclick="window.author.deleteObject()">Delete</div>
                </div>
                <div id='objectholder'></div>
            </div>
        </div>
        <div id="pastediv">
            <div class="sp_10"></div>
            <div class="wintitle">JSON</div>
            <div class="sp_05 right"></div>
            <div class ="right" onclick="window.author.togglejson()" style="margin-top: 2px;"><img id="togglejson" src="image/icon_min_g.png"/></div>
            <div id="jsonmenu" class="submenu" style="display: block">
                <div class="sp_10"></div>
                <div class ="divbutton" onclick="window.author.view()">View</div>
                <div class ="divbutton" onclick="window.author.paste()">Execute</div>
                <div class ="divbutton" onclick="window.author.format()">Format</div>
                <textarea id="paste" rows="10" style="display: block"></textarea>
            </div>
        </div>
        <div id="propertiestitle"></div>
        <div id="properties"></div>
        <div id="authorspace"></div>
    </body>
</html>
