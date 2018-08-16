authorLibs.windows = {
  build: function(){
    authorLibs.dom.parent = document.getElementById("canvasser_authoring");
    authorLibs.dom.parent.addEventListener('mousedown',    function(){authorLibs.gui.parentMouseDown = true;})
    authorLibs.dom.parent.addEventListener('mouseup',      function(){authorLibs.gui.parentMouseDown = false;})
    authorLibs.dom.parent.addEventListener('onmouseleave', function(){authorLibs.gui.parentMouseDown = false;})

    var head           = authorLibs.windows.makeDiv({parent:authorLibs.dom.parent, classes:'header'});
    var projectHolder  = authorLibs.windows.makeDiv({parent:authorLibs.dom.parent, id:'projectholder'});

    var uploadForm = authorLibs.windows.makeElement({parent:authorLibs.dom.parent, type:'form', id:'fileUploadForm', style:'display:none;'});
    var fileUpload = authorLibs.windows.makeElement({parent:uploadForm, type:'input', subtype:'file', id:'fileUpload', style:'display:none;'});
    authorLibs.windows.makeElement({parent:uploadForm, type:'input', subtype:'submit', id:'fileUpload', style:'display:none;'});

    fileUpload.addEventListener('change', authorLibs.utils.fileUpload, false);
    fileUpload.multiple = true;

    var alert = authorLibs.windows.makeDiv({parent:authorLibs.dom.parent, id:'alert_box', style:'display:none',  click:function(){authorLibs.menus.menuToggle('alert_box');}});
    authorLibs.windows.makeDiv({parent:alert, html:"ALERT",   classes:'alert_title'});
    authorLibs.windows.makeDiv({parent:alert, id:"alertdata", classes:'alert_content'});

    var autobk = authorLibs.windows.makeDiv({parent:authorLibs.dom.parent, id:'autobk', style:'display:none', html:"Autoback"});

    var deleteB = authorLibs.windows.makeDiv({parent:authorLibs.dom.parent, id:'delete_box', style:'display:none'});
    authorLibs.windows.makeDiv({parent:deleteB, id:"delete_title", classes:'notice_title'});
    authorLibs.windows.makeDiv({parent:deleteB, id:"delete_content",  classes:'notice_content'});
    authorLibs.windows.makeDiv({parent:deleteB, html:"CANCEL", classes:'button_load',  click:function(){authorLibs.menus.menuToggle('delete_box');}});
    authorLibs.windows.makeDiv({parent:deleteB, html:"DELETE", classes:'button_load',  click:function(){authorLibs.utils.fileDeleteGo('fileManager');}});

    var load = authorLibs.windows.makeDiv({parent:authorLibs.dom.parent, id:'loadbox', style:'display:none'});
    authorLibs.windows.makeDiv({parent:load, html:"LOAD FILE", classes:'title_load'});
    authorLibs.windows.makeElement({id:'loaddatafilter', parent:load, placeholder:'filter projects', type:'input', subtype:'text', classes:'load_filter', keyup:function(){authorLibs.menus.filterList('loaddatafilter', 'loaddatafilter')}});
    authorLibs.windows.makeDiv({parent:load, id:"loaddata", classes:'content_load'});
    authorLibs.windows.makeDiv({parent:load, html:"CANCEL", classes:'button_load',  click:function(){authorLibs.menus.menuToggle('loadbox')}});

    var notice = authorLibs.windows.makeDiv({parent:authorLibs.dom.parent, id:'notice_box', style:'display:none'});
    authorLibs.windows.makeDiv({parent:notice, id:"notice_title", classes:'notice_title'});
    authorLibs.windows.makeDiv({parent:notice, id:"notice_content",  classes:'notice_content'});
    authorLibs.windows.makeDiv({parent:notice, html:"CLOSE", classes:'button_load',  click:function(){authorLibs.menus.menuToggle('notice_box');}});

    var save = authorLibs.windows.makeDiv({parent:authorLibs.dom.parent, id:'savebox', style:'display:none'});
    authorLibs.windows.makeDiv({parent:save, html:"SAVE FILE", classes:'title_save'});
    var divP = authorLibs.windows.makeDiv({parent:save, classes:'saveblock'});
    authorLibs.windows.makeDiv({parent:divP, html:'Project:',  classes:"savelabel"});
    authorLibs.windows.makeElement({parent:divP, type:'input', subtype:'text', classes:'savetextbox', id:'saveproject', list:'datalist_saveproject'});
    var divF = authorLibs.windows.makeDiv({parent:save, classes:'saveblock'});
    authorLibs.windows.makeDiv({parent:divF, html:'File:',  classes:"savelabel"});
    authorLibs.windows.makeElement({parent:divF, type:'input', subtype:'text', classes:'savetextbox', id:'savefile'});
    var divC = authorLibs.windows.makeDiv({parent:save, classes:'saveblock'});
    authorLibs.windows.makeDiv({parent:save, html:"SAVE", classes:'button_load',  click:function(){authorLibs.utils.saveJson()}});
    authorLibs.windows.makeDiv({parent:save, html:"CANCEL", classes:'button_load',  click:function(){authorLibs.menus.menuToggle('savebox')}});
    authorLibs.windows.makeElement({parent:divP, type:'datalist', id:'datalist_saveproject'});

    var upload = authorLibs.windows.makeDiv({parent:authorLibs.dom.parent, id:'uploadbox', style:'display:none'});
    authorLibs.windows.makeDiv({parent:upload, html:"UPLOAD FILES", classes:'title_save'});
    var uDivP = authorLibs.windows.makeDiv({parent:upload, classes:'saveblock'});
    authorLibs.windows.makeDiv({parent:uDivP, html:'Select Project:',  classes:"savelabel"});
    authorLibs.windows.makeElement({parent:uDivP, type:'input', subtype:'text', classes:'savetextbox', id:'uploadproject', list:'datalist_saveproject'});

    authorLibs.windows.makeDiv({parent:upload, html:"SELECT", classes:'button_load',  click:function(){authorLibs.utils.fileUploadPre()}});
    authorLibs.windows.makeDiv({parent:upload, html:"CANCEL", classes:'button_load',  click:function(){authorLibs.menus.menuToggle('uploadbox')}});
    var winList = [
      {id:"anim",       position:{x:  5, y: 52}, menu:{add:true, delete:true, copy:true}, min:false, hide:true},
      {id:"constraint", position:{x:  5, y: 52}, menu:{add:true, delete:true, copy:true}, min:false, hide:true},
      {id:"file",       position:{x: 23, y: 52}, menu:{refresh:true, uploadfile:true, renamefile:true, addtoproject:true, copyfile:true, deletefile:true, filter:true}, min:true, hide:false},
      {id:"group",      position:{x:  5, y: 52}, menu:{add:true, delete:true}, min:false, hide:true},
      {id:"image",      position:{x:675, y: 52}, menu:{add:true, delete:true}, min:true},
      {id:"json",       position:{x:  5, y: 52}, menu:{load:true, view:true, execute:true, format:true},min:false, hide:true},
      {id:"layer",      position:{x: 23, y: 78}, menu:{add:true, delete:true}, min:true, hide:false},
      {id:"learn",      position:{x:502, y:140}, menu:{}},
      {id:"object",     position:{x:512, y: 52}, menu:{add:true, delete:true, copy:true, filter:true}, min:true},
      {id:"output",     position:{x: 10, y:174}, menu:{reload:true}},
      {id:"particle",   position:{x:  5, y: 52}, menu:{add:true, delete:true}, min:false,  hide:true},
      {id:"path",       position:{x:  5, y: 52}, menu:{add:true, delete:true}, min:false, hide:true},
      {id:"properties", position:{x:838, y: 52}, menu:{add:true, delete:true}},
      {id:"sample",     position:{x:349, y: 52}, menu:{sample:true}, min:true},
      {id:"setting",    position:{x:186, y: 52}, menu:{}, min:true},
      {id:"sound",      position:{x:  5, y: 52}, menu:{add:true, delete:true}, min:false, hide:true},
      {id:"shape",      position:{x:  5, y: 52}, menu:{add:true, delete:true, copy:true}, min:false, hide:true},
      {id:"test",       position:{x:  5, y: 52}, menu:{add:true, delete:true}, min:false, hide:true},
      {id:"var",        position:{x:  5, y: 52}, menu:{add:true, delete:true}, min:false, hide:true}
    ]

    var menuFile = authorLibs.windows.makeDiv({parent:projectHolder, id:'menu_file',    classes:'menu_items', html:'File', click:function(){authorLibs.menus.menuToggle('menu_file_dropdown')}});
    var dropFile = authorLibs.windows.makeDiv({parent:menuFile, id:'menu_file_dropdown',  classes:"menu_dropdown", style:'display:none;'});
    authorLibs.windows.makeDiv({parent:dropFile, html:'New',                    classes:'drop_items', click:function(){authorLibs.utils.loadDefault()}});
    authorLibs.windows.makeDiv({parent:dropFile, html:'Load File', id:'loader', classes:'drop_items', click:function(){authorLibs.utils.loadFromPhp('loadFilePHP', false)}});
    authorLibs.windows.makeDiv({parent:dropFile, html:'Save File', id:'saver',  classes:'drop_items', click:function(){
      authorLibs.windows.projectsList('saveproject'),
      authorLibs.menus.menuToggle('savebox')}
    });
    authorLibs.windows.makeDiv({parent:dropFile, id:'uploader',  classes:'drop_items', html:'Upload Files',  click:function(){authorLibs.utils.selectProject();}});
    authorLibs.windows.makeDiv({parent:dropFile,   classes:'drop_items', html:'Restart', click:function(){authorLibs.windows.reload()}});

    var menuWindows = authorLibs.windows.makeDiv({parent:projectHolder, id:'menu_windows', classes:'menu_items', html:'Windows', click:function(){authorLibs.menus.menuToggle('menu_windows_dropdown')}});
    var dropWin = authorLibs.windows.makeDiv({parent:menuWindows, id:'menu_windows_dropdown', classes:"menu_dropdown", style:'display:none;'});
    winList.forEach(function(win){
      authorLibs.windows.makeDiv({parent:dropWin,  classes:'drop_items', html:win.id.charAt(0).toUpperCase() +  win.id.slice(1), click:function(){authorLibs.menus.menuToggle(win.id+'bank')}});
    });

    var themeList = [
      {id:"Default", css:"default"},
      {id:"Blue",    css:"blue"},
      {id:"Green",   css:"green"}
    ];

    var menuAutoBk = authorLibs.windows.makeDiv({parent:projectHolder, id:'menu_autobk',  classes:'menu_items', html:'AutoBack', click:function(){authorLibs.menus.menuToggle('menu_autobk_dropdown')}});
    var dropAutobk = authorLibs.windows.makeDiv({parent:menuAutoBk, id:'menu_autobk_dropdown',  classes:"menu_dropdown", style:'display:none;'});


    var menuTheme = authorLibs.windows.makeDiv({parent:projectHolder, id:'menu_theme',    classes:'menu_items', html:'Theme', click:function(){authorLibs.menus.menuToggle('menu_theme_dropdown')}});
    var dropTheme = authorLibs.windows.makeDiv({parent:menuTheme, id:'menu_theme_dropdown',  classes:"menu_dropdown", style:'display:none;'});
    themeList.forEach(function(theme){
      authorLibs.windows.makeDiv({parent:dropTheme,  classes:'drop_items', html:theme.id, click:function(){authorLibs.windows.theme(theme.css)}});
    });

    authorLibs.windows.makeDiv({parent:projectHolder,  classes:"projectspacer"});

    var upload_json = authorLibs.windows.makeElement({type:'input', subtype:'file', parent:authorLibs.dom.parent, id:'upload_json', style:'display:none'});
    upload_json.addEventListener('change', authorLibs.menus.loadFile, false);
    var upload_image = authorLibs.windows.makeElement({type:'input', subtype:'file', parent:authorLibs.dom.parent, id:'upload_image', style:'display:none'});
    upload_image.addEventListener('change', authorLibs.menus.loadImage, false);
    authorLibs.windows.makeDiv({parent:head, id:'titlelabel', classes:'titlecenter'});

    winList.forEach(function(win){
      var show      = win.hide ? "display:none" : "display:block";
      var bank      = authorLibs.windows.makeDiv({parent:authorLibs.dom.parent,  id:win.id + 'bank', classes:'window_movable',style:'left:'+win.position.x+'px; top:'+win.position.y+'px;'+show});
      var title     = authorLibs.windows.makeDiv({parent:bank,  id:win.id + 'mover', classes:'titlebar'});
      var winTitle  = authorLibs.windows.makeDiv({parent:title,  classes:'wintitle', html:win.id.charAt(0).toUpperCase() +  win.id.slice(1) + 's'});
      authorLibs.windows.makeDiv({parent:title,  classes:'button_righter', html:'<img src="' + authorLibs.externalsPath +'image/icon_close_g.png"/>', click:function(){authorLibs.menus.menuToggle(win.id+'bank')}});
      authorLibs.windows.makeDiv({parent:title,  classes:'button_righter', html:'<img id="toggle'+win.id+'s" src="' + authorLibs.externalsPath +'image/icon_'+(win.min ? 'max': 'min')+'_g.png"/>', click:function(){authorLibs.windows.toggleminmax(win.id+'contents', 'toggle'+win.id+'s', 664, win.id)}});
      var display   = win.min ? "display:none" : "display:block";

      var contents  = authorLibs.windows.makeDiv({parent:bank,  id:win.id + 'contents', classes:'padlr', style:display});
      var menu      = authorLibs.windows.makeDiv({parent:contents, id:win.id + 'menu', classes:'submenu'});
      if (win.menu.add)        authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Add',     click:function(){authorLibs.menus.addItem( win.id +'s')}});
      if (win.menu.copy)       authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Copy',    click:function(){authorLibs.menus.copy( win.id +'s')}});
      if (win.menu.delete)     authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Delete',  click:function(){authorLibs.menus.deleteItem( win.id +'s')}});
      if (win.menu.execute)    authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Execute', click:function(){authorLibs.windows.paste()}});
      if (win.menu.format)     authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Format',  click:function(){authorLibs.windows.format()}});
      if (win.menu.load)       authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Load',    click:function(){authorLibs.menus.load_click()}});
      if (win.menu.reload)     authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Restart', click:function(){authorLibs.windows.reload()}});

      if (win.menu.sample) authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Load',   click:function(){authorLibs.menus.loadSample()}});
      if (win.menu.import) authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Import', click:function(){authorLibs.menus.import(win.id +'s')}});
      if (win.menu.view) authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'View', click:function(){authorLibs.utils.view()}});
      var holder = authorLibs.windows.makeDiv({parent:contents,  id:win.id + 'holder', classes:'padholder'});

      if (win.menu.refresh)      authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Refresh', click:function(){authorLibs.utils.loadFromPhp('refreshfiles', true)}});
      if (win.menu.uploadfile)   authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Upload',  click:function(){authorLibs.windows.projectsList('saveproject'); authorLibs.utils.selectProject();}});
      if (win.menu.addtoproject) authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Link',    click:function(){authorLibs.menus.addToProject( win.id +'s')}});
      if (win.menu.renamefile)   authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Rename',  click:function(){authorLibs.utils.fileRename(win.id +'s')}});
      if (win.menu.copyfile)     authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Copy',    click:function(){authorLibs.utils.fileCopy(win.id +'s')}});
      if (win.menu.deletefile)   authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Delete',  click:function(){authorLibs.utils.fileDeleteWin('fileManager')}});
      if (win.menu.filter){
         authorLibs.windows.makeElement({id:win.id + 'filter', parent:menu, placeholder:'filter', type:'input', subtype:'text', classes:'menu-filter', keyup:function(){authorLibs.menus.filterList(win.id + 'filter', win.id +'s')}});
      }
      if (win.id === 'output'){
        authorLibs.windows.makeDiv({parent:title, id:'outputtitle', classes:'wintitle right', html:'X, Y'});
        winTitle.innerHTML = 'Output';
        document.getElementById('outputholder').id = 'canvasholder';
      }
      if (win.id === 'file'){
        var fileMenu = document.getElementById('filemenu');
        authorLibs.windows.makeElement({type:'input', subtype:'checkbox', parent:fileMenu, id:'filemanager_check_json', style:'display: table-cell;', checked:true,  click:function(){authorLibs.utils.refreshfiles()}});
        authorLibs.windows.makeDiv({parent:fileMenu, classes:'menu-check', html:'JSON'});
        authorLibs.windows.makeElement({type:'input', subtype:'checkbox', parent:fileMenu, id:'filemanager_check_image', style:'display: table-cell;', checked:true, click:function(){authorLibs.utils.refreshfiles()}});
        authorLibs.windows.makeDiv({parent:fileMenu, classes:'menu-check', html:'IMAGE'});
        authorLibs.windows.makeElement({type:'input', subtype:'checkbox', parent:fileMenu, id:'filemanager_check_html', style:'display: table-cell;', checked:true, click:function(){authorLibs.utils.refreshfiles()}});
        authorLibs.windows.makeDiv({parent:fileMenu, classes:'menu-check', html:'HTML'});
        authorLibs.windows.makeElement({type:'input', subtype:'checkbox', parent:fileMenu, id:'filemanager_check_sound', style:'display: table-cell;', checked:true, click:function(){authorLibs.utils.refreshfiles()}});
        authorLibs.windows.makeDiv({parent:fileMenu, classes:'menu-check', html:'SOUND'});
        var filelistDiv = authorLibs.windows.makeDiv({parent:contents, classes:'content_load_all', id:'filelist'});
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
        authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Home',     click:function(){window.learning('load','welcome')}});
        authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'Contents', click:function(){window.learning('load','contents')}});
        authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'&#9668;',  click:function(){window.learning('back')}});
        authorLibs.windows.makeDiv({parent:menu, classes:'menu-div', html:'&#9658;',  click:function(){window.learning('forward')}});
        authorLibs.windows.makeDiv({parent:menu, id:'learning'});
        winTitle.innerHTML = "Learn";
      }
      if (win.id === 'properties'){
        authorLibs.windows.makeDiv({parent:contents, id:'propertiestitle'});
        authorLibs.windows.makeDiv({parent:contents, id:'properties'});
        authorLibs.windows.makeDiv({parent:contents, id:'authorspace'});
        winTitle.innerHTML = "Properties";
      }
      contents.addEventListener("mousedown", function(){authorLibs.windows.focusObjD(win.id+"bank")}, false);
      title.addEventListener("mousedown",    function(){authorLibs.windows.moveObjD(win.id+"bank")},  false);
    });
  },

  clearElement(name){
    var element = document.getElementById(name);
    if (element !== undefined) element.innerHTML ='';
  },

  focusObjD: function(element){
    authorLibs.gui.zidx ++;
    document.getElementById(element).style.zIndex = authorLibs.gui.zidx;
  },

  format: function(){
    var pasteData = document.getElementById("paste").value;
    document.getElementById("paste").value = JSON.stringify(authorLibs.authorData, null, 4);
  },

  makeDiv: function(settings){
    settings.type = 'div';
    return authorLibs.windows.makeElement(settings);
  },

  makeImg: function(settings){
    settings.type = 'img';
    return authorLibs.windows.makeElement(settings);
  },

  makeSpan: function(settings){
    settings.type = 'span';
    return authorLibs.windows.makeElement(settings);
  },

  makeTr: function(settings){
    settings.type = 'tr';
    return authorLibs.windows.makeElement(settings);
  },

  makeTable: function(settings){
    settings.type = 'table';
    return authorLibs.windows.makeElement(settings);
  },

  makeTd: function(settings){
    settings.type = 'td';
    return authorLibs.windows.makeElement(settings);
  },

  makeElement: function(settings){
    var element = document.createElement(settings.type);
    if (settings.change      !== undefined) element.onchange     = settings.change;
    if (settings.checked     !== undefined) element.checked      = true;
    if (settings.classes     !== undefined) element.className    = settings.classes;
    if (settings.click       !== undefined) element.onclick      = settings.click;
    if (settings.data        !== undefined){
      settings.data.forEach(function(subD){element.dataset[subD.id] = subD.val;})
    }
    if (settings.drag        !== undefined) element.draggable    = settings.drag;
    if (settings.dragover    !== undefined) element.ondragover   = settings.dragover;
    if (settings.dragstart   !== undefined) element.ondragstart  = settings.dragstart;
    if (settings.drop        !== undefined) element.ondrop       = settings.drop;
    if (settings.html        !== undefined) element.innerHTML    = settings.html;
    if (settings.id          !== undefined) element.id           = settings.id;
    if (settings.keydown     !== undefined) element.onkeydown    = settings.keydown;
    if (settings.keyup       !== undefined) element.onkeyup      = settings.keyup;
    if (settings.list        !== undefined) element.setAttribute('list', settings.list);
    if (settings.mousedown   !== undefined) element.onmousedown  = settings.mousedown;
    if (settings.mouseenter  !== undefined) element.onmouseenter = settings.mouseenter;
    if (settings.mousemove   !== undefined) element.onmousemove  = settings.mousemove;
    if (settings.mouseout    !== undefined) element.onmouseout   = settings.mouseout;
    if (settings.mouseover   !== undefined) element.onmouseover  = settings.mouseover;
    if (settings.multiple    !== undefined) element.multiple     = true;
    if (settings.placeholder !== undefined) element.placeholder  = settings.placeholder;
    if (settings.src         !== undefined) element.src          = settings.src;
    if (settings.style       !== undefined) element.style        = settings.style;
    if (settings.subtype     !== undefined) element.type         = settings.subtype;
    if (settings.value       !== undefined) element.value        = settings.value;
    if (settings.width       !== undefined) element.width        = settings.width;
    if (settings.clearparent === true) settings.parent.innerHTML = '';

    if (settings.first === true) settings.parent.insertBefore(element, settings.parent.childNodes[0]);
    else settings.parent.appendChild(element);
    return element;
  },

  moveObjD: function(element){
    authorLibs.gui.move        = true;
    authorLibs.gui.mousedown   = true;
    authorLibs.gui.moveElement = document.getElementById(element);
    authorLibs.gui.zidx ++;
    authorLibs.gui.moveElement.style.zIndex = authorLibs.gui.zidx;
    var off = {x:0, y:0};
    if (authorLibs.gui.moveElement.style.left !== "") off.x = authorLibs.gui.mousePos.x - parseInt(authorLibs.gui.moveElement.style.left.slice(0,-2));
    if (authorLibs.gui.moveElement.style.top  !== "") off.y = authorLibs.gui.mousePos.y - parseInt(authorLibs.gui.moveElement.style.top.slice(0,-2));
    authorLibs.gui.offset = {x:off.x, y:off.y};
  },

  paste: function(){
    var pasteData = document.getElementById("paste").value;
    authorLibs.menus.update();
    restartCanvasser("sample", JSON.parse(pasteData), "string");
  },

  projectsList: function(listId){
    authorLibs.utils.getProjects(authorLibs.utils.fillInSaveProject);
  },

  reload: function(){
    restartCanvasser("sample", authorLibs.authorData, "string");
    authorLibs.utils.view()
  },

  theme: function(theme){
    var colors = [
      {id:'alert-bg-color',       default:'rgb( 51,   0,   0)', blue:'rgb(51, 0, 0)',      green:'rgb( 51,   0,   0)'},
      {id:'alert-color',          default:'white',              blue:'white',              green:'white'             },
      {id:'loadbox-bg-color',     default:'rgb( 99,  99,  99)', blue:'rgb( 99,  99, 199)', green:'rgb( 99, 199,  99)'},
      {id:'header-bg-color',      default:'rgb( 62,  62,  62)', blue:'rgb( 62,  62, 162)', green:'rgb( 62, 162,  62)'},
      {id:'header-color',         default:'white',              blue:'rgb(200, 200, 255)', green:'rgb(200, 255, 200)'},
      {id:'loadbox-border-color', default:'white',              blue:'white',              green:'white'},
      {id:'loadbox-color',        default:'black',              blue:'black',              green:'black'},
      {id:'notice-bg-color',      default:'rgb( 26,  26,  26)', blue:'rgb(26, 26, 66)',    green:'rgb( 26,  66,  26)'},
      {id:'notice-color',         default:'white',              blue:'white',              green:'white'},
      {id:'menu-dropdown-bg',     default:'rgb( 62,  62,  62)', blue:'rgb(62, 100, 162)',  green:'rgb( 62, 162, 100)'},
      {id:'titlebar',             default:'rgb(122, 122, 122)', blue:'rgb(122, 122, 200)', green:'rgb(  0, 138,   0)'},
      {id:'window-mv-bg',         default:'rgb( 86,  86,  86)', blue:'rgb(86, 86, 186)',   green:'rgb( 26, 186,  26)'},
      {id:'window-mv-border',     default:'rgb(142, 142, 142)', blue:'rgb(142, 142, 242)', green:'rgb(142, 242, 142)'},
      {id:'wintitle-color',       default:'rgb(255, 255, 255)', blue:'rgb(222, 222, 255)', green:'rgb(222, 255, 222)'}
    ];
    colors.forEach(function(color){document.documentElement.style.setProperty('--'+color.id, color[theme]);});
  },

  toggleminmax: function(element, minmax, maxsize, id){
    var d = document.getElementById(element);
    var b = document.getElementById(minmax);
    if (d.style.display === "block"){
      d.style.display="none";
      b.src=authorLibs.externalsPath + "image/icon_max_g.png";
    } else {
      d.style.display = "block";
      b.src=authorLibs.externalsPath +"image/icon_min_g.png";
      var holder = document.getElementById(id+'holder');
      var bank   = document.getElementById(id+'bank');
      var ext    = authorLibs.utils.getVisibleArea();
      var win    = bank.getBoundingClientRect();

      if (win.bottom > ext.y-25) {
        var offset    =  win.bottom - win.top - holder.offsetHeight;
        var newHeight = ext.y - win.top - offset - 25;
        if (newHeight < 20) newHeight = 20;
        holder.style.height = (newHeight).toString() + 'px';
      }
    }
  }
}
