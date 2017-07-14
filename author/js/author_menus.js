function Menus(){
  var utils = new CanvasserUtils();
  this.update = function(toUp){
    if (!toUp || toUp === 'anims')     updateMenu('anims');
    if (!toUp || toUp === 'groups')    updateMenu('groups');
    if (!toUp || toUp === 'images')    updateMenu('images');
    if (!toUp || toUp === 'objects')   updateMenu('objects');
    if (!toUp || toUp === 'particles') updateMenu('particles');
    if (!toUp || toUp === 'paths')     updateMenu('paths');
    if (!toUp || toUp === 'samples')   updateMenu('samples');
    if (!toUp || toUp === 'settings')  updateSettings();
    if (!toUp || toUp === 'sounds')    updateMenu('sounds');
    if (!toUp || toUp === 'shapes')    updateMenu('shapes');
  }

  function updateMenu(type){
    var menuHolder = document.getElementById(type.slice(0, -1) + "holder");
    var menu = '<table class="objtable" id="'+type+'table" width="100%">';

    if (authorData[type] === undefined) authorData[type] = [];
    if (type === 'samples'){
      authorData.samples = [];
      window.rules.samples.forEach(function(sampy){authorData[type].push(sampy)});
    }
    authorData[type].forEach(function(menuItem){
      if (type === 'anims' || type === 'groups' ||type === 'particles' || type === 'sounds'){
        menu += '<tr class="clicktr" id="'+type+'_'+menuItem.id+'" onclick="window.author.getProps(\''+type+'\',\''+ menuItem.id + '\')">';
        menu +='<td width="100%">' + menuItem.id + '</td>';
        menu += '</tr>';
      }
      if (type === 'images'){
        var url = utils.prePath(menuItem);
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
        menu += '<tr class="clicktr" id="'+type+'_'+menuItem.id+'" onclick="window.author.getPath(\''+ menuItem.id + '\')">';
        menu +='<td width="50%">' + menuItem.id + '</td>';
        menu +='<td width="50%">' +menuItem.url + '</td>';
        menu += '</tr>';
      }
      if (type === 'samples'){
        menu += '<tr class="clicktr" id="'+type+'_'+menuItem.id+'" onclick="window.author.loadSample(\''+ menuItem.url + '\')">';
        menu +='<td class="shapeid"><div>' + menuItem.id + '</div></td>';
        menu += '</tr>';
      }
      if (type === 'shapes'){
        menu += '<tr class="clicktr" id="'+type+'_'+menuItem.id+'" onclick="window.author.getProps(\'shapes\',\''+ menuItem.id + '\')">';
        menu +='<td class="shapeid"><div>' + menuItem.id + '</div></td>';
        menu += '</tr>';
      }
    });
    menu +='</table>';
    menuHolder.innerHTML = menu;
  }

  function updateSettings(){
    var settingHolder = document.getElementById("settingholder");
    var settings = '<table class="objtable" id="settingstable" width="100%">';

    Object.keys(authorData.settings).forEach(function(setting){
      settings += '<tr class="clicktr" id="settings_'+setting+'" onclick="window.author.getSetting(\''+ setting + '\')">';
      settings +='<td width="50%">' + setting + '</td>';
      settings +='<td width="50%">' + authorData.settings[setting] + '</td>';
      settings += '</tr>';
    });
    settings +='</table>';
    settingHolder.innerHTML = settings;
  }

  this.addItem = function(type){
    var itemName  = type.slice(0, -1);
    var itemCnt   = 0;
    var tryAgain  = true;
    while (tryAgain){
      if (authorData[type].filter(function(item){return item.id === itemName}).length > 0){
        itemCnt ++;
        itemName = type.slice(0, -1) + itemCnt;
      } else tryAgain = false;
    }
    if (type === 'anims')     authorData[type].push({id:itemName, autostart:false, length:1000, timelist:[]});
    if (type === 'groups')    authorData[type].push({id:itemName});
    if (type === 'images')    authorData[type].push({id:itemName, path:"author",  url:"no_image.png"});
    if (type === 'objects')   authorData[type].push({id:itemName, type:"image",  shape:"", show:true, position:{current:{x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)}}, scale:{current:1}});
    if (type === 'particles') authorData[type].push({id:itemName, position:{current:{x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)}}});
    if (type === 'paths')     authorData[type].push({id:itemName, url:"./"});
    if (type === 'shapes')    authorData[type].push({id:itemName});
    if (type === 'sounds')    authorData[type].push({id:itemName, url:"./"});

    updateMenu(type)
    initCanvasser("sample", JSON.stringify(authorData), "string");
    window.author.view();
  }

  this.deleteItem = function(type){
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
    updateMenu(type);
    restartCanvasser("sample", authorData, "string");
  }
}
