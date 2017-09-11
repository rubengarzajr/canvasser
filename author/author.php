<!DOCTYPE html>
<?php

?>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Author</title>
    <link rel="shortcut icon" href="../favicon.ico" />
    <link href="./css/normalize.css" rel="stylesheet" type="text/css"/>
    <link href="./css/canvasser.css" rel="stylesheet" type="text/css"/>

    <script src="../canvasser.js" type="text/javascript"></script>
    <script src="js/author.js?time=<?php echo date("h:i:sa")?>"  type="text/javascript"></script>
    <script src="js/author_buildprops.js?time=<?php echo date("h:i:sa")?>"  type="text/javascript"></script>
    <script src="js/author_utils.js?time=<?php echo date("h:i:sa")?>"  type="text/javascript"></script>
    <script src="js/author_menus.js?time=<?php echo date("h:i:sa")?>"  type="text/javascript"></script>

  </head>
  <body onload="initAuthorCanvasser()" class="authorbk">
    <div class="header">
    <div class="titlecenter">CANVASSER</div>
    </div>
    <div id="menu">
    </div>
    <div id="graphical">
      <div id='canvasbank' class="skinnybank" style="position:absolute; left:180px; top:158px;">
        <div class="titlebar" id="canvasmover">
          <div class="wintitle">Output</div>
          <div class="sp_05 right"></div>
          <div class ="right" onclick="window.author.toggleminmax('canvascontents', 'togglecanvas', 500)" style="margin-top: 2px;"><img id="togglecanvas" src="image/icon_min_g.png"/></div>
          <div class="wintitle right" id="outputtitle">X, Y</div>
        </div>
        <div id="canvascontents" class="padlr" style="display:block">
          <div id="canvasmenu" class="submenu">
            <div class="divmenu" onclick="window.author.reload()">Restart</div>
          </div>
          <div id='canvasholder' class="authoractivity"></div>
        </div>
      </div>

      <div id='imagebank' class="skinnybank" style="position:absolute;left:10px; top:285px;">
        <div class="titlebar" id="imagemover">
          <div class="wintitle">Images</div>
          <div class="sp_05 right"></div>
          <div class ="right" onclick="window.author.toggleminmax('imagecontents', 'toggleimages', 664)" style="margin-top: 2px;"><img id="toggleimages" src="image/icon_min_g.png"/></div>
        </div>
        <div id="imagecontents" class="padlr" style="display:block">
          <div id="imagemenu" class="submenu">
            <div class="divmenu" onclick="window.author.menus.addItem('images')">Add</div>
            <div class="divmenu" onclick="window.author.menus.deleteItem('images')">Delete</div>
          </div>
          <div id="imageholder" class="padholder"></div>
        </div>
      </div>

      <div id='shapebank' class="skinnybank" style="position:absolute;left:174px; top:70px;">
        <div class="titlebar" id="shapemover">
          <div class="wintitle">Shapes</div>
          <div class="sp_05 right"></div>
          <div class ="right" onclick="window.author.toggleminmax('shapecontents', 'toggleshapes', 664)" style="margin-top: 2px;"><img id="toggleshapes" src="image/icon_max_g.png"/></div>
        </div>
        <div id="shapecontents" class="padlr" style="display:none">
          <div id="shapemenu" class="submenu">
            <div class="divmenu" onclick="window.author.menus.addItem('shapes')">Add</div>
            <div class="divmenu" onclick="window.author.menus.deleteItem('shapes')">Delete</div>
          </div>
          <div id="shapeholder" class="padholder"></div>
        </div>
      </div>

      <div id='samplebank' class="skinnybank" style="position:absolute; left:338px; top:70px;">
        <div class="titlebar" id="samplemover">
          <div class="wintitle">Samples</div>
          <div class="sp_05 right"></div>
          <div class ="right" onclick="window.author.toggleminmax('samplecontents', 'togglesamples', 664)" style="margin-top: 2px;"><img id="togglesamples" src="image/icon_max_g.png"/></div>
        </div>
        <div id="samplecontents" class="padlr" style="display:none">
          <div id="samplemenu" class="submenu">
            <div class="divmenu" onclick="window.author.loadSample()">Load</div>
          </div>
          <div id="sampleholder" class="padholder"></div>
        </div>
      </div>

      <div id='objectbank' class="skinnybank" style="position:absolute;left:10px; top:110px;">
        <div class="titlebar" id="objectmover">
          <div class="wintitle">Objects</div>
          <div class="sp_05 right"></div>
          <div class ="right" onclick="window.author.toggleminmax('objectcontents', 'toggleobjects', 664)" style="margin-top: 2px;"><img id="toggleobjects" src="image/icon_min_g.png"/></div>
        </div>
        <div id="objectcontents" class="padlr" style="display:block">
          <div id="objectmenu" class="submenu">
            <div class="divmenu" onclick="window.author.menus.addItem('objects')">Add</div>
            <div class="divmenu" onclick="window.author.menus.deleteItem('objects')">Delete</div>
            <div class="divmenu" onclick="window.author.copy('objects')">Copy</div>
            <div class="divmenu" onclick="window.author.reorder('objects','up')"> &#9650;</div>
            <div class="divmenu" onclick="window.author.reorder('objects','down')"> &#9660;</div>
          </div>
          <div id="objectholder" class="padholder"></div>
        </div>
      </div>
    </div>

        <div id='jsonbank' class="skinnybank" style="position:absolute;left:667px; top:70px;">
            <div class="titlebar" id="jsonmover">
                <div class="wintitle">JSON</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleminmax('jsoncontents', 'togglejson', 664)" style="margin-top: 2px;"><img id="togglejson" src="image/icon_max_g.png"/></div>
            </div>
            <div id="jsoncontents" class="padlr" style="display:none">
                <div id="jsonmenu" class="submenu" style="display: block">
                    <input type="file" id="uploader" style="display:none;" multiple size="50" onchange="window.author.load()">
                    <div class ="divmenu" onclick="window.author.load_click()">Load</div>
                    <div class ="divmenu" onclick="window.author.view()">View</div>
                    <div class ="divmenu" onclick="window.author.paste()">Execute</div>
                    <div class ="divmenu" onclick="window.author.format()">Format</div>
                </div>
                <textarea id="paste" rows="5" cols="40"></textarea>
            </div>
        </div>

        <div id='settingbank' class="skinnybank" style="position:absolute;left:10px; top:70px;">
            <div class="titlebar" id="settingmover">
                <div class="wintitle">Settings</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleminmax('settingcontents', 'togglesetting', 664)" style="margin-top: 2px;"><img id="togglesetting" src="image/icon_max_g.png"/></div>
            </div>
            <div id="settingcontents" class="padlr" style="display:none">
                <div id="settingmenu" class="submenu">
                </div>
                <div id="settingholder" class="padholder"></div>
            </div>
        </div>

        <div id='pathbank' class="skinnybank" style="position:absolute;left:502px; top:70px;">
            <div class="titlebar" id="pathmover">
                <div class="wintitle">Paths</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleminmax('pathcontents', 'togglepath', 664)" style="margin-top: 2px;"><img id="togglepath" src="image/icon_max_g.png"/></div>
            </div>
            <div id="pathcontents" class="padlr" style="display:none">
                <div id="pathmenu" class="submenu">
                    <div class="divmenu" onclick="window.author.menus.addItem('paths')">Add</div>
                    <div class="divmenu" onclick="window.author.menus.deleteItem('paths')">Delete</div>
                </div>
                <div id="pathholder" class="padholder"></div>
            </div>
        </div>

        <div id='varbank' class="skinnybank" style="position:absolute;left:997px; top:110px;">
            <div class="titlebar" id="varmover">
                <div class="wintitle">Vars</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleminmax('varcontents', 'togglevar', 664)" style="margin-top: 2px;"><img id="togglevar" src="image/icon_max_g.png"/></div>
            </div>
            <div id="varcontents" class="padlr" style="display:none">
                <div id="varmenu" class="submenu">
                    <div class="divmenu" onclick="window.author.menus.addItem('vars')">Add</div>
                    <div class="divmenu" onclick="window.author.menus.deleteItem('vars')">Delete</div>
                </div>
                <div id="varholder" class="padholder"></div>
            </div>
        </div>

        <div id='groupbank' class="skinnybank" style="position:absolute;left:832px; top:70px;">
            <div class="titlebar" id="groupmover">
                <div class="wintitle">Groups</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleminmax('groupcontents', 'togglegroup', 664)" style="margin-top: 2px;"><img id="togglegroup" src="image/icon_max_g.png"/></div>
            </div>
            <div id="groupcontents" class="padlr" style="display:none">
                <div id="groupmenu" class="submenu">
                    <div class="divmenu" onclick="window.author.menus.addItem('groups')">Add</div>
                    <div class="divmenu" onclick="window.author.menus.deleteItem('groups')">Delete</div>
                </div>
                <div id="groupholder" class="padholder"></div>
            </div>
        </div>

        <div id='particlebank' class="skinnybank" style="position:absolute;left:997px; top:70px;">
            <div class="titlebar" id="particlemover">
                <div class="wintitle">Particles</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleminmax('particlecontents', 'toggleparticle', 664)" style="margin-top: 2px;"><img id="toggleparticle" src="image/icon_max_g.png"/></div>
            </div>
            <div id="particlecontents" class="padlr" style="display:none">
                <div id="particlemenu" class="submenu">
                    <div class="divmenu" onclick="window.author.menus.addItem('particles')">Add</div>
                    <div class="divmenu" onclick="window.author.menus.deleteItem('particles')">Delete</div>
                </div>
                <div id="particleholder" class="padholder"></div>
            </div>
        </div>

        <div id='animbank' class="skinnybank" style="position:absolute;left:339px; top:110px;">
            <div class="titlebar" id="animmover">
                <div class="wintitle">Animations</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleminmax('animcontents', 'toggleanim', 664)" style="margin-top: 2px;"><img id="toggleanim" src="image/icon_max_g.png"/></div>
            </div>
            <div id="animcontents" class="padlr" style="display:none">
                <div id="animmenu" class="submenu">
                    <div class="divmenu" onclick="window.author.menus.addItem('anims')">Add</div>
                    <div class="divmenu" onclick="window.author.menus.deleteItem('anims')">Delete</div>
                    <div class="divmenu" onclick="window.author.copy('anims')">Copy</div>
                </div>
                <div id="animholder" class="padholder"></div>
            </div>
        </div>

        <div id='constraintbank' class="skinnybank" style="position:absolute;left:667px; top:110px;">
            <div class="titlebar" id="constraintmover">
                <div class="wintitle">Constraints</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleminmax('constraintcontents', 'toggleanim', 664)" style="margin-top: 2px;"><img id="toggleanim" src="image/icon_max_g.png"/></div>
            </div>
            <div id="constraintcontents" class="padlr" style="display:none">
                <div id="constraintmenu" class="submenu">
                    <div class="divmenu" onclick="window.author.menus.addItem('constraints')">Add</div>
                    <div class="divmenu" onclick="window.author.menus.deleteItem('constraints')">Delete</div>
                    <div class="divmenu" onclick="window.author.copy('constraints')">Copy</div>
                </div>
                <div id="constraintholder" class="padholder"></div>
            </div>
        </div>

        <div id='soundbank' class="skinnybank" style="position:absolute;left:175px; top:110px;">
            <div class="titlebar" id="soundmover">
                <div class="wintitle">Sounds</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleminmax('soundcontents', 'togglesound', 664)" style="margin-top: 2px;"><img id="togglesound" src="image/icon_max_g.png"/></div>
            </div>
            <div id="soundcontents" class="padlr" style="display:none">
                <div id="soundmenu" class="submenu">
                    <div class="divmenu" onclick="window.author.menus.addItem('sounds')">Add</div>
                    <div class="divmenu" onclick="window.author.menus.deleteItem('sounds')">Delete</div>
                </div>
                <div id="soundholder" class="padholder"></div>
            </div>
        </div>

        <div id='testbank' class="skinnybank" style="position:absolute;left:502px; top:110px;">
            <div class="titlebar" id="testmover">
                <div class="wintitle">Tests</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleminmax('testcontents', 'toggletest', 664)" style="margin-top: 2px;"><img id="toggletest" src="image/icon_max_g.png"/></div>
            </div>
            <div id="testcontents" class="padlr" style="display:none">
                <div id="testmenu" class="submenu">
                    <div class="divmenu" onclick="window.author.menus.addItem('tests')">Add</div>
                    <div class="divmenu" onclick="window.author.menus.deleteItem('tests')">Delete</div>
                </div>
                <div id="testholder" class="padholder"></div>
            </div>
        </div>

        <div id='propertiesbank' class="skinnybank" style="position:absolute;left:800px; top:158px;">
            <div class="titlebar" id="propertiesmover">
                <div class="wintitle">Properties</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleminmax('propertiescontents', 'toggleproperties', 664)" style="margin-top: 2px;"><img id="toggleproperties" src="image/icon_min_g.png"/></div>
            </div>
            <div id="propertiescontents" class="padlr" style="display:block">
                <div id="propertiesmenu" class="submenu">
                </div>
                <div id="propertiestitle"></div>
                <div id="properties"></div>
                <div id="authorspace"></div>
            </div>
        </div>

        <div id='learnbank' class="skinnybank" style="position:absolute;left:263px; top:234px;">
            <div class="titlebar" id="learnmover">
                <div class="wintitle">Learning</div>
                <div class="sp_05 right"></div>
                <div class ="right" onclick="window.author.toggleminmax('learncontents', 'togglelearn', 664)" style="margin-top: 2px;"><img id="togglelearn" src="image/icon_min_g.png"/></div>
            </div>
            <div id="learncontents" class="padlr" style="display:block">
                <div id="learnmenu" class="submenu">
                  <div class="divmenu" onclick="window.learning('load','welcome')">Home</div>
                  <div class="divmenu" onclick="window.learning('load','contents')">Contents</div>
                  <div class="divmenu" onclick="window/learning('back')">&#9668;</div>
                  <div class="divmenu" onclick="window.learning('forward')">&#9658;</div>
                </div>
                <div id="learnholder" class="learnholder">
                  <div id="learning">
                    Welcome!
                  </div>
                </div>
            </div>
        </div>

    </body>
</html>
