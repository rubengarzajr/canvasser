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
        </div>
        <div id="graphical">
            <div id='canvasbank' class="skinnybank" style="position:absolute; left:160px; top:120px;">
                <div class="titlebar" id="canvasmover">
                    <div class="wintitle">Output</div>
                    <div class="sp_05 right"></div>
                    <div class ="right" onclick="window.author.toggleminmax('canvascontents', 'togglecanvas', 500)" style="margin-top: 2px;"><img id="togglecanvas" src="image/icon_min_g.png"/></div>
                </div>
                <div id="canvascontents" class="padlr" style="display:block">
                    <div id="canvasmenu" class="submenu">
                        <div class="divmenu" onclick="window.author.reload()">Restart</div>
                    </div>
                    <div id='canvasholder' class="authoractivity"></div>
                </div>
            </div>

            <div id='imagebank' class="skinnybank" style="position:absolute;left:10px; top:80px;">
                <div class="titlebar" id="imagemover">
                    <div class="wintitle">Images</div>
                    <div class="sp_05 right"></div>
                    <div class ="right" onclick="window.author.toggleminmax('imagecontents', 'toggleimages', 664)" style="margin-top: 2px;"><img id="toggleimages" src="image/icon_max_g.png"/></div>
                </div>
                <div id="imagecontents" class="padlr" style="display:none">
                    <div id="objectmenu" class="submenu">
                        <div class="divmenu" onclick="window.author.addObject()">Add</div>
                        <div class="divmenu" onclick="window.author.deleteObject()">Delete</div>
                    </div>
                    <div id="imageholder"></div>
                </div>
            </div>

            <div id='objectbank' class="skinnybank" style="position:absolute;left:10px; top:120px;">
                <div class="titlebar" id="objectmover">
                    <div class="wintitle">Objects</div>
                    <div class="sp_05 right"></div>
                    <div class ="right" onclick="window.author.toggleminmax('objectcontents', 'toggleobjects', 664)" style="margin-top: 2px;"><img id="toggleobjects" src="image/icon_min_g.png"/></div>
                </div>
                <div id="objectcontents" class="padlr" style="display:block">
                    <div id="objectmenu" class="submenu">
                        <div class="divmenu" onclick="window.author.addObject()">Add</div>
                        <div class="divmenu" onclick="window.author.deleteObject()">Delete</div>
                    </div>
                    <div id="objectholder"></div>
                </div>
            </div>
        </div>

        <div id='jsonbank' class="skinnybank" style="position:absolute;left:140px; top:80px;">
            <div class="titlebar" id="jsonmover">
                <div class="wintitle">JSON</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleminmax('jsoncontents', 'togglejson', 664)" style="margin-top: 2px;"><img id="togglejson" src="image/icon_max_g.png"/></div>
            </div>
            <div id="jsoncontents" class="padlr" style="display:none">
                <div id="jsonmenu" class="submenu" style="display: block">
                    <div class ="divmenu" onclick="window.author.view()">View</div>
                    <div class ="divmenu" onclick="window.author.paste()">Execute</div>
                    <div class ="divmenu" onclick="window.author.format()">Format</div>
                </div>
                <textarea id="paste" rows="5" cols="40"></textarea>
            </div>
        </div>

            <div id='settingbank' class="skinnybank" style="position:absolute;left:245px; top:80px;">
                <div class="titlebar" id="settingmover">
                    <div class="wintitle">Settings</div>
                    <div class="sp_05 right"></div>
                    <div class ="right" onclick="window.author.toggleminmax('settingcontents', 'togglesetting', 664)" style="margin-top: 2px;"><img id="togglesetting" src="image/icon_max_g.png"/></div>
                </div>
                <div id="settingcontents" class="padlr" style="display:none">
                    <div id="settingmenu" class="submenu">
                        <div class="divmenu" onclick="window.author.addObject()">Add</div>
                        <div class="divmenu" onclick="window.author.deleteObject()">Delete</div>
                    </div>
                    <div id="settingholder"></div>
                </div>
            </div>
        </div>

        <div id="propertiestitle"></div>
        <div id="properties"></div>
        <div id="authorspace"></div>
    </body>
</html>
