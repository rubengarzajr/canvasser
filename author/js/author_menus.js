authorLibs.menus = {

  update: function(toUp){
    if (!toUp || toUp === 'anims')       authorLibs.menus.updateMenu('anims');
    if (!toUp || toUp === 'constraints') authorLibs.menus.updateMenu('constraints');
    if (!toUp || toUp === 'groups')      authorLibs.menus.updateMenu('groups');
    if (!toUp || toUp === 'images')      authorLibs.menus.updateMenu('images');
    if (!toUp || toUp === 'objects')     authorLibs.menus.updateMenu('objects');
    if (!toUp || toUp === 'particles')   authorLibs.menus.updateMenu('particles');
    if (!toUp || toUp === 'paths')       authorLibs.menus.updateMenu('paths');
    if (!toUp || toUp === 'samples')     authorLibs.menus.updateMenu('samples');
    if (!toUp || toUp === 'settings')    authorLibs.menus.updateSettings();
    if (!toUp || toUp === 'sounds')      authorLibs.menus.updateMenu('sounds');
    if (!toUp || toUp === 'shapes')      authorLibs.menus.updateMenu('shapes');
    if (!toUp || toUp === 'tests')       authorLibs.menus.updateMenu('tests');
    if (!toUp || toUp === 'vars')        authorLibs.menus.updateMenu('vars');
  },

  updateMenu: function(type){
    var menuHolder = document.getElementById(type.slice(0, -1) + "holder");
    var menu       = '<table class="objtable" id="' + type + 'table" width="100%">';
    if (authorData[type] === undefined) authorData[type] = [];
    if (type === 'samples'){
      authorLibs.rules.samples.forEach(function(sampy){
        menu += '<tr class="clicktr" id="'+type+'_'+sampy.id+'" onclick="window.author.loadSample(\''+ sampy.url + '\')">';
        menu +='<td class="shapeid"><div>' + sampy.id + '</div></td>';
        menu += '</tr>';
      });
      menu +='</table>';
      menuHolder.innerHTML = menu;
      return;
    }
    authorData[type].forEach(function(menuItem){
      if (type === 'anims' || type === 'constraints' || type === 'groups' ||type === 'particles' || type === 'shapes' || type === 'sounds' || type === 'tests' || type === 'vars'){
        menu += '<tr class="clicktr" id="'+type+'_'+menuItem.id+'" onclick="window.author.getProps(\''+type+'\',\''+ menuItem.id + '\')">';
        menu +='<td width="100%">' + menuItem.id + '</td>';
        menu += '</tr>';
      }
      if (type === 'images'){
        var url = authorLibs.utils.prePath(menuItem);
        menu += '<tr class="clicktr" id="'+type+'_'+menuItem.id+'" onclick="window.author.getProps(\''+type+'\',\''+ menuItem.id + '\')">';
        menu +='<td class="imageid"><div class="imagetext">' + menuItem.id + '</div></td>';
        menu +='<td width="50%"><img src="' + url + '" alt="' + menuItem.id + '"></td>';
        menu += '</tr>';
      }
      if (type === 'objects'){
        menu += '<tr class="clicktr" id="'+type+'_'+menuItem.id+'" onclick="window.author.getProps(\''+type+'\',\''+ menuItem.id + '\')">';
        menu +='<td width="75%" style="font-size:1.3em;">' + menuItem.id + '</td>';
        menu +='<td width="25%">' + menuItem.type + '</td>';
        menu += '</tr>';
      }
      if (type === 'paths'){
        menu += '<tr class="clicktr" id="'+type+'_'+menuItem.id+'" onclick="window.author.getProps(\''+type+'\',\''+ menuItem.id + '\')">';
        menu +='<td width="50%">' + menuItem.id + '</td>';
        menu +='<td width="50%">' +menuItem.url + '</td>';
        menu += '</tr>';
      }
    });
    menu +='</table>';
    menuHolder.innerHTML = menu;
  },

  updateSelectionWindow: function(type,id){
    var table = document.getElementById(type + "table");
    for (var i = 0, row; row = table.rows[i]; i++) {row.removeAttribute("style")};
    var row = document.getElementById(type + '_' + id);
    if (row === null) return;
    row = row.rowIndex;
    table.rows[row].style = "background-color:rgb(97, 255, 55);";
  },

  updateSettings: function(){
    var settingHolder = document.getElementById("settingholder");
    var settings = '<table class="objtable" id="settingstable" width="100%">';

    Object.keys(authorData.settings).forEach(function(setting){
      settings += '<tr class="clicktr" id="settings_'+setting+'" onclick="window.author.getProps(\'settings\',\''+ setting + '\')">';
      settings +='<td width="50%">' + setting + '</td>';
      settings +='<td width="50%">' + authorData.settings[setting] + '</td>';
      settings += '</tr>';
    });
    settings +='</table>';
    settingHolder.innerHTML = settings;
  },

  addItem: function(type){
    if (authorData[type] === undefined) authorData[type] = [];
    var itemName  = type.slice(0, -1);
    var itemCnt   = 0;
    var tryAgain  = true;
    while (tryAgain){
      if (authorData[type].filter(function(item){return item.id === itemName}).length > 0){
        itemCnt ++;
        itemName = type.slice(0, -1) + itemCnt;
      } else tryAgain = false;
    }
    if (type === 'anims')       authorData[type].push({id:itemName, autostart:false, length:1000, timelist:[]});
    if (type === 'constraints') authorData[type].push({id:itemName, active:true, driverlist:[]});
    if (type === 'groups')      authorData[type].push({id:itemName});
    if (type === 'images')      authorData[type].push({id:itemName, path:"author",  url:"no_image.png"});
    if (type === 'objects')     authorData[type].push({id:itemName, type:"image",  shape:"", show:true, position:{current:{x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)}}, scale:{current:1}});
    if (type === 'particles')   authorData[type].push({id:itemName, position:{current:{x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)}},
    emitRate:10, pParams:{fade: {in:0, out:100}, scale: {min:1, max:1}, life: {min:1000, max:1000},
    speed:{position:{min:1, max:1}, rotation:{min:0.1, max:0.1}}}, genType:"burst", emitCounter:1000, emitDirEnd:360, emitDirStart:0});
    if (type === 'paths')       authorData[type].push({id:itemName, url:"./"});
    if (type === 'shapes')      authorData[type].push({id:itemName});
    if (type === 'sounds')      authorData[type].push({id:itemName, url:"./"});
    if (type === 'tests')       authorData[type].push({id:itemName, active:true});
    if (type === 'vars')        authorData[type].push({id:itemName, value:0});

    authorLibs.menus.updateMenu(type)
    initCanvasser("sample", JSON.stringify(authorData), "string");
    authorLibs.menus.updateSelectionWindow(type, itemName);
    window.author.view();
  },

  deleteItem: function(type){
    var table = document.getElementById(type + "table");
    var delRow = undefined;
    for (var i = 0, row; row = table.rows[i]; i++) {
      if (row.style[0] === "background-color") delRow = row.id;
    };
    authorData[type].forEach(function(test, idx){
      if (type + '_' + test.id === delRow){ authorData[type].splice(idx,1); }
    });
    document.getElementById("propertiestitle").innerHTML = '';
    document.getElementById("properties").innerHTML      = '';
    authorLibs.menus.updateMenu(type);
    restartCanvasser("sample", authorData, "string");
  },

  copy: function(type){
    var table   = document.getElementById(type + "table");
    var copyRow = undefined;
    var newObj = undefined;

    for (var i = 0, row; row = table.rows[i]; i++) {
      if (row.style[0] === "background-color") copyRow = row.id;
    };

    var objList = authorData[type].filter(function(test){ return(type+'_'+test.id === copyRow)});
    if (objList.length === 0 || objList === undefined) return;
    newObj       = authorLibs.utils.copyObj(objList[0], {});
    var itemName = newObj.id.replace(/\d+$/, "");
    var itemCnt  = 0;
    var tryAgain = true;
    while (tryAgain){
      if (authorData[type].filter(function(item){return item.id === itemName}).length > 0){
        itemCnt ++;
        itemName = newObj.id.replace(/\d+$/, "") + itemCnt;
      } else tryAgain = false;
    }
    newObj.id = itemName;
    authorData[type].push(newObj);
    authorLibs.menus.update(type);
    restartCanvasser("sample", authorData, "string");
    authorLibs.menus.updateSelectionWindow(type, newObj.id);
    authorLibs.buildProp.getProps(type,  newObj.id);
  }

}
