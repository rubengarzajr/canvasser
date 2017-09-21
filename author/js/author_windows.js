authorLibs.windows = {
  build: function(){
    var winList = [
      {id:"anim",       position:{x:339, y:110}, menu:{add:true, delete:true, copy:true}, min:true},
      {id:"canvas",     position:{x:10,  y:174}, menu:{reload:true}},
      {id:"constraint", position:{x:667, y:76},  menu:{add:true, delete:true, copy:true}, min:true},
      {id:"group",      position:{x:10,  y:76},  menu:{add:true, delete:true}, min:true},
      {id:"image",      position:{x:174, y:110}, menu:{add:true, delete:true}},
      {id:"json",       position:{x:667, y:40},  menu:{load:true, view:true, execute:true, format:true},min:true},
      {id:"learn",      position:{x:502, y:140}, menu:{}},
      {id:"object",     position:{x:10,  y:110}, menu:{add:true, delete:true, copy:true, reorder:true}},
      {id:"particle",   position:{x:174, y:76},  menu:{add:true, delete:true}, min:true},
      {id:"path",       position:{x:502, y:40},  menu:{add:true, delete:true}, min:true},
      {id:"properties", position:{x:834, y:40},  menu:{add:true, delete:true}},
      {id:"sample",     position:{x:338, y:40},  menu:{sample:true}, min:true},
      {id:"setting",    position:{x:10,  y:40},  menu:{}, min:true},
      {id:"sound",      position:{x:502, y:76},  menu:{add:true, delete:true}, min:true},
      {id:"shape",      position:{x:174, y:40},  menu:{add:true, delete:true}, min:true},
      {id:"test",       position:{x:502, y:110}, menu:{add:true, delete:true}, min:true},
      {id:"var",        position:{x:338, y:75},  menu:{add:true, delete:true}, min:true}
    ]
    var parent = document.getElementById("canvasser_authoring");
    winList.forEach(function(win){
      var bank      = authorLibs.windows.makeDiv(parent,  win.id + 'bank', 'window_movable','left:'+win.position.x+'px; top:'+win.position.y+'px;', null, null);
      var title     = authorLibs.windows.makeDiv(bank,  win.id + 'mover', 'titlebar', null, null, null);
      var winTitle  = authorLibs.windows.makeDiv(title,  null, 'wintitle', null, win.id.charAt(0).toUpperCase() +  win.id.slice(1) + 's', null);
      authorLibs.windows.makeDiv(title,  null, 'button_righter', null, '<img id="toggle'+win.id+'s" src="image/icon_min_g.png"/>', function(){window.author.toggleminmax(win.id+'contents', 'toggle'+win.id+'s', 664)});
      var display   = win.min ? "display:none" : "display:block";
      var contents  = authorLibs.windows.makeDiv(bank,  win.id + 'contents', 'padlr', display, null, null);
      var menu      = authorLibs.windows.makeDiv(contents,  win.id + 'menu', 'submenu', null, null, null);
      if (win.menu.add)     authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, 'Add', function(){authorLibs.menus.addItem( win.id +'s')});
      if (win.menu.copy)    authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, 'Copy', function(){authorLibs.menus.copy( win.id +'s')});
      if (win.menu.delete)  authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, 'Delete', function(){authorLibs.menus.deleteItem( win.id +'s')});
      if (win.menu.execute) authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, 'Execute', function(){window.author.paste()});
      if (win.menu.format)  authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, 'Format', function(){window.author.format()});
      if (win.menu.load)    authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, 'Load', function(){window.author.load_click()});
      if (win.menu.reload)  authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, 'Restart', function(){window.author.reload()});
      if (win.menu.reorder){
         authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, '&#9650;', function(){authorLibs.menus.reorder( win.id +'s', 'up')});
         authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, '&#9660;', function(){authorLibs.menus.reorder( win.id +'s', 'down')});
      }
      if (win.menu.sample) authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, 'Load', function(){window.author.loadSample()});
      if (win.menu.view) authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, 'View', function(){window.author.view()});
      var holder = authorLibs.windows.makeDiv(contents,  win.id + 'holder', 'padholder', null, null, null);

      if (win.id === 'canvas'){
        authorLibs.windows.makeDiv(title,  'outputtitle', 'wintitle right', null, 'X, Y', null);
        winTitle.innerHTML = 'Output';
      }
      if (win.id === 'json'){
        var txt  = document.createElement('textarea');
        txt.id   = 'paste';
        txt.rows = "5";
        txt.cols = "40";
        menu.appendChild(txt);
      }
      if (win.id === 'learn'){
        authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, 'Home', function(){window.learning('load','welcome')});
        authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, 'Contents', function(){window.learning('load','contents')});
        authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, '&#9668;', function(){window.learning('back')});
        authorLibs.windows.makeDiv(menu,  null, 'divmenu', null, '&#9658;', function(){window.learning('forward')});
        authorLibs.windows.makeDiv(menu,  'learning', null, null, null, null);
      }
      if (win.id === 'properties'){
        authorLibs.windows.makeDiv(contents,  'propertiestitle', null, null, null, null);
        authorLibs.windows.makeDiv(contents,  'properties', null, null, null, null);
        authorLibs.windows.makeDiv(contents,  'authorspace', null, null, null, null);
        winTitle.innerHTML = "Properties";
      }
    });
  },

  makeDiv: function(parent, id, classes, style, html, click){
    var div    = document.createElement('div');
    if (id !== null) div.id     = id;
    if (classes !== null) div.className  = classes;
    if (style !== null) div.style  = style;
    if (html !== null) div.innerHTML  = html;
    if (click != null) div.onclick = click;
    parent.appendChild(div);
    return div;
  }
}
