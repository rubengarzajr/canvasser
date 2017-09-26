authorLibs.windows = {
  build: function(){
    var parent = document.getElementById("canvasser_authoring");
    var head   = authorLibs.windows.makeDiv({parent:parent, classes:'header'});
    var saver  = authorLibs.windows.makeDiv({parent:parent, id:'saver', html:'Upload',  click:function(){authorLibs.utils.saveToPhp()}});

    var upload_json = authorLibs.windows.makeElement({type:'input', subtype:'file', parent:parent, id:'upload_json', style:'display:none'});
    upload_json.addEventListener('change', authorLibs.menus.loadFile, false);
    var upload_image = authorLibs.windows.makeElement({type:'input', subtype:'file', parent:parent, id:'upload_image', style:'display:none'});
    upload_image.addEventListener('change', authorLibs.menus.loadImage, false);
    authorLibs.windows.makeDiv({parent:head, id:'titlelabel', classes:'titlecenter'});

    var winList = [
      {id:"anim",       position:{x:339, y:110}, menu:{add:true, delete:true, copy:true}, min:true},
      {id:"canvas",     position:{x:10,  y:174}, menu:{reload:true}},
      {id:"constraint", position:{x:667, y:76},  menu:{add:true, delete:true, copy:true}, min:true},
      {id:"group",      position:{x:10,  y:76},  menu:{add:true, delete:true}, min:true},
      {id:"image",      position:{x:174, y:110}, menu:{add:true, delete:true, import:true}, min:true},
      {id:"json",       position:{x:667, y:40},  menu:{load:true, view:true, execute:true, format:true},min:true},
      {id:"object",     position:{x:10,  y:110}, menu:{add:true, delete:true, copy:true, reorder:true}, min:true},
      {id:"particle",   position:{x:174, y:76},  menu:{add:true, delete:true}, min:true},
      {id:"path",       position:{x:502, y:40},  menu:{add:true, delete:true}, min:true},
      {id:"properties", position:{x:834, y:40},  menu:{add:true, delete:true}},
      {id:"sample",     position:{x:338, y:40},  menu:{sample:true}, min:true},
      {id:"setting",    position:{x:10,  y:40},  menu:{}, min:true},
      {id:"sound",      position:{x:502, y:76},  menu:{add:true, delete:true}, min:true},
      {id:"shape",      position:{x:174, y:40},  menu:{add:true, delete:true}, min:true},
      {id:"test",       position:{x:502, y:110}, menu:{add:true, delete:true}, min:true},
      {id:"var",        position:{x:338, y:75},  menu:{add:true, delete:true}, min:true},
      {id:"learn",      position:{x:502, y:140}, menu:{}}
    ]

    winList.forEach(function(win){
      var bank      = authorLibs.windows.makeDiv({parent:parent,  id:win.id + 'bank', classes:'window_movable',style:'left:'+win.position.x+'px; top:'+win.position.y+'px;'});
      var title     = authorLibs.windows.makeDiv({parent:bank,  id:win.id + 'mover', classes:'titlebar'});
      var winTitle  = authorLibs.windows.makeDiv({parent:title,  classes:'wintitle', html:win.id.charAt(0).toUpperCase() +  win.id.slice(1) + 's'});
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
      if (win.menu.import) authorLibs.windows.makeDiv({parent:menu, classes:'divmenu', html:'Import', click:function(){authorLibs.menus.upload(win.id +'s')}});
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
