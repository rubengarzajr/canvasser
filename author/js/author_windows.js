authorLibs.windows = {
  build: function(){
    var parent = document.getElementById("canvasser_authoring");
    var head   = authorLibs.windows.makeDiv({parent:parent, classes:'header'});
    var projectHolder  = authorLibs.windows.makeDiv({parent:parent, id:'projectholder'});

    var alert = authorLibs.windows.makeDiv({parent:parent, id:'alert_box', style:'display:none', click:function(){authorLibs.menus.menuToggle('alert_box')}});
    authorLibs.windows.makeDiv({parent:alert, html:"ALERT",   classes:'alert_title'});
    authorLibs.windows.makeDiv({parent:alert, id:"alertdata", classes:'alert_content'});

    var notice = authorLibs.windows.makeDiv({parent:parent, id:'notice_box', style:'display:none', click:function(){authorLibs.menus.menuToggle('notice_box')}});
    authorLibs.windows.makeDiv({parent:notice, id:"notice_title", classes:'notice_title'});
    authorLibs.windows.makeDiv({parent:notice, id:"notice_content",  classes:'notice_content'});

    var load = authorLibs.windows.makeDiv({parent:parent, id:'loadbox', style:'display:none'});
    authorLibs.windows.makeDiv({parent:load, html:"LOAD FILE", classes:'title_load'});
    authorLibs.windows.makeDiv({parent:load, id:"loaddata", classes:'content_load'});
    authorLibs.windows.makeDiv({parent:load, html:"LOAD",   classes:'button_load',  click:function(){authorLibs.utils.loadfile()}});
    authorLibs.windows.makeDiv({parent:load, html:"CANCEL", classes:'button_load',  click:function(){authorLibs.menus.menuToggle('loadbox')}});

    var save = authorLibs.windows.makeDiv({parent:parent, id:'savebox', style:'display:none'});
    authorLibs.windows.makeDiv({parent:save, html:"SAVE FILE", classes:'title_save'});
    var divP = authorLibs.windows.makeDiv({parent:save, classes:'saveblock'});
    authorLibs.windows.makeDiv({parent:divP, html:'Project:',  classes:"savelabel"});
    authorLibs.windows.makeElement({parent:divP, type:'input', subtype:'text', classes:'savetextbox', id:'project'});
    var divF = authorLibs.windows.makeDiv({parent:save, classes:'saveblock'});
    authorLibs.windows.makeDiv({parent:divF, html:'File:',  classes:"savelabel"});
    authorLibs.windows.makeElement({parent:divF, type:'input', subtype:'text', classes:'savetextbox', id:'file'});
    var divC = authorLibs.windows.makeDiv({parent:save, classes:'saveblock'});
    authorLibs.windows.makeDiv({parent:divC, html:'Separate Assets:',  classes:"savelabel"});
    authorLibs.windows.makeElement({parent:divC, type:'input', subtype:'checkbox', classes:'savecheckbox', id:'separatecheck', checked:true});
    authorLibs.windows.makeDiv({parent:save, html:"SAVE", classes:'button_load',  click:function(){authorLibs.utils.saveToPhp()}});
    authorLibs.windows.makeDiv({parent:save, html:"CANCEL", classes:'button_load',  click:function(){authorLibs.menus.menuToggle('savebox')}});
    var winList = [
      {id:"anim",       position:{x:339, y:110}, menu:{add:true, delete:true, copy:true}, min:true},
      {id:"canvas",     position:{x:10,  y:174}, menu:{reload:true}},
      {id:"constraint", position:{x:667, y:76},  menu:{add:true, delete:true, copy:true}, min:true, hide:true},
      {id:"group",      position:{x:10,  y:140}, menu:{add:true, delete:true}, min:true, hide:true},
      {id:"image",      position:{x:174, y:110}, menu:{add:true, delete:true, import:true}, min:true},
      {id:"json",       position:{x:667, y:110}, menu:{load:true, view:true, execute:true, format:true},min:true, hide:true},
      {id:"object",     position:{x:10,  y:110}, menu:{add:true, delete:true, copy:true, reorder:true}, min:true},
      {id:"particle",   position:{x:174, y:76},  menu:{add:true, delete:true}, min:true, hide:true},
      {id:"path",       position:{x:502, y:76},  menu:{add:true, delete:true}, min:true, hide:true},
      {id:"properties", position:{x:834, y:76},  menu:{add:true, delete:true}},
      {id:"sample",     position:{x:338, y:76},  menu:{sample:true}, min:true},
      {id:"setting",    position:{x:10,  y:76},  menu:{}, min:true},
      {id:"sound",      position:{x:502, y:76},  menu:{add:true, delete:true}, min:true, hide:true},
      {id:"shape",      position:{x:174, y:140}, menu:{add:true, delete:true}, min:true, hide:true},
      {id:"test",       position:{x:502, y:110}, menu:{add:true, delete:true}, min:true, hide:true},
      {id:"var",        position:{x:338, y:140}, menu:{add:true, delete:true}, min:true, hide:true},
      {id:"learn",      position:{x:502, y:140}, menu:{}}
    ]

    var menuFile = authorLibs.windows.makeDiv({parent:projectHolder, id:'menu_file',    classes:'menu_items', html:'File', click:function(){authorLibs.menus.menuToggle('menu_file_dropdown')}});
    var dropFile = authorLibs.windows.makeDiv({parent:menuFile, id:'menu_file_dropdown',  classes:"menu_dropdown", style:'display:none;'});
    authorLibs.windows.makeDiv({parent:dropFile, html:'New',  classes:'drop_items', click:function(){authorLibs.author.loadDefault()}});
    authorLibs.windows.makeDiv({parent:dropFile, id:'loader', classes:'drop_items', html:'Load File',  click:function(){authorLibs.utils.loadFromPhp()}});
    authorLibs.windows.makeDiv({parent:dropFile, id:'saver',  classes:'drop_items', html:'Save File',  click:function(){authorLibs.menus.menuToggle('savebox')}});
    authorLibs.windows.makeDiv({parent:dropFile,   classes:'drop_items', html:'Restart', click:function(){authorLibs.author.reload()}});

    var menuWindows = authorLibs.windows.makeDiv({parent:projectHolder, id:'menu_windows', classes:'menu_items', html:'Windows', click:function(){authorLibs.menus.menuToggle('menu_windows_dropdown')}});
    var dropWin = authorLibs.windows.makeDiv({parent:menuWindows, id:'menu_windows_dropdown', classes:"menu_dropdown", style:'display:none;'});
    winList.forEach(function(win){
      authorLibs.windows.makeDiv({parent:dropWin,  classes:'drop_items', html:win.id.charAt(0).toUpperCase() +  win.id.slice(1), click:function(){authorLibs.menus.menuToggle(win.id+'bank')}});
    });

    var themeList = [
      {id:"Default", filename:"canvasser.css"},
      {id:"Pink", filename:"canvasser_pink.css"}
    ];

    var menuTheme = authorLibs.windows.makeDiv({parent:projectHolder, id:'menu_theme',    classes:'menu_items', html:'Theme', click:function(){authorLibs.menus.menuToggle('menu_theme_dropdown')}});
    var dropTheme = authorLibs.windows.makeDiv({parent:menuTheme, id:'menu_theme_dropdown',  classes:"menu_dropdown", style:'display:none;'});
    themeList.forEach(function(theme){
      authorLibs.windows.makeDiv({parent:dropTheme,  classes:'drop_items', html:theme.id, click:function(){authorLibs.menus.theme(theme.filename)}});
    });


    authorLibs.windows.makeDiv({parent:projectHolder,  classes:"projectspacer"});

    var upload_json = authorLibs.windows.makeElement({type:'input', subtype:'file', parent:parent, id:'upload_json', style:'display:none'});
    upload_json.addEventListener('change', authorLibs.menus.loadFile, false);
    var upload_image = authorLibs.windows.makeElement({type:'input', subtype:'file', parent:parent, id:'upload_image', style:'display:none'});
    upload_image.addEventListener('change', authorLibs.menus.loadImage, false);
    authorLibs.windows.makeDiv({parent:head, id:'titlelabel', classes:'titlecenter'});



    winList.forEach(function(win){
      var show   = win.hide ? "display:none" : "display:block";
      var bank      = authorLibs.windows.makeDiv({parent:parent,  id:win.id + 'bank', classes:'window_movable',style:'left:'+win.position.x+'px; top:'+win.position.y+'px;'+show});
      var title     = authorLibs.windows.makeDiv({parent:bank,  id:win.id + 'mover', classes:'titlebar'});
      var winTitle  = authorLibs.windows.makeDiv({parent:title,  classes:'wintitle', html:win.id.charAt(0).toUpperCase() +  win.id.slice(1) + 's'});
      authorLibs.windows.makeDiv({parent:title,  classes:'button_righter', html:'<img src="' + authorLibs.externalsPath +'image/icon_close_g.png"/>', click:function(){authorLibs.menus.menuToggle(win.id+'bank')}});
      authorLibs.windows.makeDiv({parent:title,  classes:'button_righter', html:'<img id="toggle'+win.id+'s" src="' + authorLibs.externalsPath +'image/icon_'+(win.min ? 'max': 'min')+'_g.png"/>', click:function(){authorLibs.author.toggleminmax(win.id+'contents', 'toggle'+win.id+'s', 664)}});
      var display   = win.min ? "display:none" : "display:block";

      var contents  = authorLibs.windows.makeDiv({parent:bank,  id:win.id + 'contents', classes:'padlr', style:display});
      var menu      = authorLibs.windows.makeDiv({parent:contents, id:win.id + 'menu', classes:'submenu'});
      if (win.menu.add)     authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'Add',     click:function(){authorLibs.menus.addItem( win.id +'s')}});
      if (win.menu.copy)    authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'Copy',    click:function(){authorLibs.menus.copy( win.id +'s')}});
      if (win.menu.delete)  authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'Delete',  click:function(){authorLibs.menus.deleteItem( win.id +'s')}});
      if (win.menu.execute) authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'Execute', click:function(){authorLibs.author.paste()}});
      if (win.menu.format)  authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'Format',  click:function(){authorLibs.author.format()}});
      if (win.menu.load)    authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'Load',    click:function(){authorLibs.menus.load_click()}});
      if (win.menu.reload)  authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'Restart', click:function(){authorLibs.author.reload()}});
      if (win.menu.reorder){
         authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'&#9650;', click:function(){authorLibs.menus.reorder( win.id +'s', 'up')}});
         authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'&#9660;', click:function(){authorLibs.menus.reorder( win.id +'s', 'down')}});
      }
      if (win.menu.sample) authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'Load',   click:function(){authorLibs.author.loadSample()}});
      if (win.menu.import) authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'Import', click:function(){authorLibs.menus.import(win.id +'s')}});
      if (win.menu.view) authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'View', click:function(){authorLibs.author.view()}});
      var holder = authorLibs.windows.makeDiv({parent:contents,  id:win.id + 'holder', classes:'padholder'});

      if (win.id === 'canvas'){
        authorLibs.windows.makeDiv({parent:title, id:'outputtitle', classes:'wintitle right', html:'X, Y'});
        winTitle.innerHTML = 'Output';
      }
      if (win.id === 'json'){
        var txt  = document.createElement('textarea');
        txt.id   = 'paste';
        txt.rows = "5";
        txt.cols = "40";
        menu.appendChild(txt);
        winTitle.innerHTML = "JSON";
      }
      if (win.id === 'learn'){
        authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'Home',     click:function(){window.learning('load','welcome')}});
        authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'Contents', click:function(){window.learning('load','contents')}});
        authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'&#9668;',  click:function(){window.learning('back')}});
        authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'&#9658;',  click:function(){window.learning('forward')}});
        authorLibs.windows.makeDiv({parent:menu, id:'learning'});
        winTitle.innerHTML = "Learn";
      }
      if (win.id === 'properties'){
        authorLibs.windows.makeDiv({parent:contents, id:'propertiestitle'});
        authorLibs.windows.makeDiv({parent:contents, id:'properties'});
        authorLibs.windows.makeDiv({parent:contents, id:'authorspace'});
        winTitle.innerHTML = "Properties";
      }
    });
  },


  makeElement: function(settings){
    var element                                   = document.createElement(settings.type);
    if (settings.id !== undefined) element.id              = settings.id;
    if (settings.subtype !== undefined) element.type       = settings.subtype;
    if (settings.classes !== undefined) element.className  = settings.classes;
    if (settings.style !== undefined) element.style        = settings.style;
    if (settings.html !== undefined) element.innerHTML     = settings.html;
    if (settings.click != undefined) element.onclick       = settings.click;
    if (settings.multiple != undefined) element.multiple   = true;
    if (settings.checked != undefined) element.checked   = true;
    settings.parent.appendChild(element);
    return element;
  },

  makeDiv: function(settings){
    settings.type = 'div';
    var div = authorLibs.windows.makeElement(settings);
    //settings.parent.appendChild(div);
    return div;
  }
}