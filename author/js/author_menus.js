authorLibs.menus = {
  addItem: function(type){
    if (authorLibs.authorData[type] === undefined) authorLibs.authorData[type] = [];
    var itemName  = type.slice(0, -1);
    var itemCnt   = 0;
    var tryAgain  = true;
    while (tryAgain){
      if (authorLibs.authorData[type].filter(function(item){return item.name === itemName}).length > 0){
        itemCnt ++;
        itemName = type.slice(0, -1) + itemCnt;
      } else tryAgain = false;
    }
    if (type === 'anims')       authorLibs.authorData[type].push({id:authorLibs.utils.uuid(), name:itemName, autostart:false, length:1000, timelist:[]});
    if (type === 'constraints') authorLibs.authorData[type].push({id:authorLibs.utils.uuid(), name:itemName, active:true, driverlist:[]});
    if (type === 'groups')      authorLibs.authorData[type].push({id:authorLibs.utils.uuid(), name:itemName});
    if (type === 'images')      {
      authorLibs.authorData[type].push({id:authorLibs.utils.uuid(), name:itemName, path:"author",  url:"no_image.png"});
      if (authorLibs.authorData[type].length === 1) document.getElementById('imageholder').style.height = "65px";
    }
    if (type === 'layers')      {
      authorLibs.authorData[type].push({name:itemName, id:authorLibs.utils.uuid(), list:[], show:true, expanded:true});
      if (authorLibs.authorData[type].length === 1) document.getElementById('imageholder').style.height = "65px";
    }
    if (type === 'objects')     {
      var objectId = authorLibs.utils.uuid();
      authorLibs.authorData[type].push({
        id:objectId,
        name:itemName,
        type:"image",
        shape:"",
        show:true,
        position:{current:{x:Math.floor(authorLibs.authorData.settings.canvaswidth/2), y:Math.floor(authorLibs.authorData.settings.canvasheight/2)}},
        scale:{current:1}
      });
      authorLibs.authorData.layers[authorLibs.gui.currentLayer].list.push({id:objectId, type:'objects', name:itemName});
      if (authorLibs.authorData[type].length === 1) document.getElementById('objectholder').style.height = "35px";
    }
    if (type === 'particles') {
      var particleId = authorLibs.utils.uuid();
      authorLibs.authorData[type].push({
      id:particleId,
      name:itemName,
      position:{current:{x:Math.floor(authorLibs.authorData.settings.canvaswidth/2), y:Math.floor(authorLibs.authorData.settings.canvasheight/2)}},
      emitRate:10, pParams:{fade: {in:0, out:100, inrandom:0, outrandom:0},
      scale: {min:1, max:1},
      life: {min:1000, max:1000},
      speed:{position:{min:1, max:1},
      rotation:{min:0.1, max:0.1}}},
      genType:"burst",
      emitCounter:1000,
      emitDirEnd:360,
      emitDirStart:0});
      authorLibs.authorData.layers[authorLibs.authorData.layers.length-1].list.push({id:particleId, type:'particles', name:itemName});
    }
    if (type === 'paths')       authorLibs.authorData[type].push({id:authorLibs.utils.uuid(), name:itemName, url:authorLibs.externalsPath});
    if (type === 'shapes')      authorLibs.authorData[type].push({id:authorLibs.utils.uuid(), name:itemName});
    if (type === 'sounds')      authorLibs.authorData[type].push({id:authorLibs.utils.uuid(), name:itemName, url:authorLibs.externalsPath});
    if (type === 'tests')       authorLibs.authorData[type].push({id:authorLibs.utils.uuid(), name:itemName, active:true});
    if (type === 'vars')        authorLibs.authorData[type].push({id:authorLibs.utils.uuid(), name:itemName, value:0});

    authorLibs.menus.updateMenu(type);
    if (type === 'objects' || type === 'particles') authorLibs.menus.updateMenu('layers');
    initCanvasser("sample", JSON.stringify(authorLibs.authorData), "string");
    authorLibs.menus.updateSelectionWindow(type, itemName);
    authorLibs.utils.view();
  },

  addToProject: function(winId){
    authorLibs.lists.fileManager.forEach(function(itemToAdd){
      var pathOnly = itemToAdd.url.match(/(.*)[\/\\]/)[1]||'';
      var existingPath = authorLibs.authorData.paths.filter(function(path){
        return path.id === itemToAdd.project;
      });

      if (existingPath.length === 0){
        authorLibs.authorData.paths.push({id:itemToAdd.project, url:pathOnly});
      } else existingPath[0].url = pathOnly;

      authorLibs.menus.update('paths');

      var justName = itemToAdd.id.replace(/\.[^/.]+$/, "");
      if (itemToAdd.type === 'image'){
        var existingImage = authorLibs.authorData.images.filter(function(image){
          return image.name === justName;
        });

        if (existingImage.length === 0){
          authorLibs.authorData.images.push({id:authorLibs.utils.uuid(), name:justName, path:itemToAdd.project, url:itemToAdd.id});
        } else {
          existingPath[0].url = pathOnly;
        }
        authorLibs.menus.update('images');
      }
      if (itemToAdd.type === 'sound'){
        var existingSound = authorLibs.authorData.sounds.filter(function(sound){
          return sound.id === justName;
        });

        if (existingSound.length === 0){
          authorLibs.authorData.sounds.push({id:justName, path:itemToAdd.project, url:itemToAdd.id});
        } else existingPath[0].url = pathOnly;
        authorLibs.menus.update('sounds');
      }
    });
  },

  copy: function(type){
    var table   = document.getElementById(type + "table");
    var copyRow = undefined;
    var newObj = undefined;

    for (var i = 0, row; row = table.rows[i]; i++) {
      if (row.style[0] === "background-color") copyRow = row.id;
    };

    var objList = authorLibs.authorData[type].filter(function(test){ return(type+'_'+test.id === copyRow)});
    if (objList.length === 0 || objList === undefined) return;
    newObj       = authorLibs.utils.copyObj(objList[0], {});
    var itemName = newObj.name.replace(/\d+$/, "");
    var itemCnt  = 0;
    var tryAgain = true;
    while (tryAgain){
      if (authorLibs.authorData[type].filter(function(item){return item.name === itemName}).length > 0){
        itemCnt ++;
        itemName = newObj.name.replace(/\d+$/, "") + itemCnt;
      } else tryAgain = false;
    }
    newObj.id = authorLibs.utils.uuid();
    newObj.name = itemName;
    authorLibs.authorData[type].push(newObj);
    authorLibs.menus.update(type);
    if (type === 'objects' || type === 'particles'){
      authorLibs.authorData.layers[authorLibs.gui.currentLayer].list.push({id:newObj.id, type:type, name:itemName});
      authorLibs.menus.updateMenu('layers');
    }
    restartCanvasser("sample", authorLibs.authorData, "string");
    authorLibs.menus.updateSelectionWindow(type, newObj.id);
    authorLibs.buildProp.getProps(type,  newObj.id);
  },

  deleteItem: function(type){
    var table = document.getElementById(type + "table");
    var delRow = undefined;
    for (var i = 0, row; row = table.rows[i]; i++) {
      if (row.style[0] === "background-color") delRow = row.id;
    };
    authorLibs.authorData[type].forEach(function(test, idx){
      if (type + '_' + test.id === delRow){ authorLibs.authorData[type].splice(idx,1); }
    });
    document.getElementById("propertiestitle").innerHTML = '';
    document.getElementById("properties").innerHTML      = '';
    authorLibs.menus.updateMenu(type);
    if (type === 'objects' || type === 'particles') authorLibs.menus.updateMenu('layers');
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  filterList: function(id, type){
    if (id==='loaddatafilter'){
      authorLibs.utils.loadDataUpdate();
      return;
    }
    if (id==='filefilter'){
      authorLibs.utils.refreshfiles(authorLibs.lists.fileList);
      return;
    }
    authorLibs.menus.updateMenu(type);
  },

  import: function(type){
    if (type === 'images') document.getElementById("upload_image").click();
  },

  load_click: function(){
    document.getElementById("upload_json").click();
  },

  loadFile: function(){
    var file = document.getElementById("upload_json").files[0];

    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt) {
        document.getElementById("paste").innerHTML = evt.target.result;
      }
      reader.onerror = function (evt) {
        document.getElementById("paste").innerHTML = "error reading file";
      }
    }
  },

  loadImage: function(event){
    Array.from(event.target.files).forEach(function(file){
      if (!file.type.match('image.*')) return;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (evt) {
        authorLibs.authorData.images.push({id:file.name.slice(0, -4), path:"localstorage",  url:file.name, local:true, data:evt.target.result});
        if (authorLibs.authorData.images.length === 1) document.getElementById('imageholder').style.height = "65px";
        authorLibs.menus.updateMenu('images');
      }
      reader.onerror = function (evt) {
        document.getElementById("properties").innerHTML = "error reading file";
      }
    });
  },

  loadSample: function(url){
    authorLibs.utils.requestJSON(authorLibs.externalsPath + 'sample/json/' + url + '?' + new Date().getTime(), function(data){restartCanvasser("sample", data, 'string');});
  },

  menuToggle:function(toggle){
  var toggler = document.getElementById(toggle);
  if (toggler.style.display === "none") {
    toggler.style.display = "block";
    authorLibs.gui.zidx ++;
    toggler.style.zIndex = authorLibs.gui.zidx
  }
    else toggler.style.display = "none";
  },

  update: function(toUp){
    if (!toUp || toUp === 'anims')       authorLibs.menus.updateMenu('anims');
    if (!toUp || toUp === 'constraints') authorLibs.menus.updateMenu('constraints');
    if (!toUp || toUp === 'files')       authorLibs.menus.updateMenu('files');
    if (!toUp || toUp === 'groups')      authorLibs.menus.updateMenu('groups');
    if (!toUp || toUp === 'images')      authorLibs.menus.updateMenu('images');
    if (!toUp || toUp === 'layers')      authorLibs.menus.updateMenu('layers');
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
    if (authorLibs.authorData[type] === undefined) authorLibs.authorData[type] = [];

    if (type === 'samples'){
      authorLibs.rules.samples.forEach(function(sampy){
        menu += '<tr class="clicktr" id="'+type+'_'+sampy.id+'" onclick="authorLibs.menus.loadSample(\''+ sampy.url + '\')">';
        menu +='<td class="shapeid"><div>' + sampy.id + '</div></td>';
        menu += '</tr>';
      });
      menu +='</table>';
      menuHolder.innerHTML = menu;
      return;
    }

    if (type === 'layers'){
      var idsInLayers = [];
      authorLibs.authorData.layers.forEach(function(layer){
        layer.list.forEach(function(item){
          idsInLayers.push(item.id);
        });
      });

      var checklist = ['objects','particles'];
      checklist.forEach(function(testType){
        if (authorLibs.authorData[testType] === undefined) return;
        authorLibs.authorData[testType].forEach(function(item){
          if (idsInLayers.indexOf(item.id) < 0){
            authorLibs.authorData.layers[authorLibs.gui.currentLayer].list.push({id:item.id, type:testType, name:item.name});
          }
        });
      });


      authorLibs.authorData[type].slice().reverse().forEach(function(menuItem, idxR){
        var idx = authorLibs.authorData[type].length -1 - idxR;
        var dropTxt = ' draggable="true" ';
        dropTxt +=    'ondragover="authorLibs.utils.dropMenuItemAllow(event)" ';
        dropTxt +=    'ondragstart="authorLibs.utils.dragMenuItem(event)" data-type="layer"';

        menu += '<tr class="clicktr">';
        menu +='<td width="100%" class="layers_title" onclick="authorLibs.author.getProps(\'layers\',\''+idx+'\')" ondrop="authorLibs.utils.dropMenuItem(event)" '+ dropTxt + '  data-layer="'+idx+'" data-idx="-1">';
        menu +='<img class="layerexp" onclick="authorLibs.utils.layerToggle(\''+idx+'\',\'layer\',\'expanded\')" data-type="layer" data-layer="'+idx+'" data-idx="-1" src="./image/icon_layers_' + (  authorLibs.authorData.layers[idx].expanded ? 'e' :  'c' ) + '.png">';
        menu +='<div class="layer_title_text" onclick="authorLibs.author.getProps(\'layers\',\''+idx+'\')" data-type="layer" data-layer="'+idx+'" data-idx="-1">' + menuItem.name + '</div>';
        menu +='<img class="layershow" onclick="authorLibs.utils.layerUpdate(this,\''+idx+'\',\'show\',\'btoggle\')" data-type="layer" data-layer="'+idx+'" data-idx="-1" src="./image/icon_layers_' + (  authorLibs.authorData.layers[idx].show ? 'show' :  'hide' ) + '.png">';
        menu += '</td>';
        menu += '</tr>';
        var err = -1;
        if (authorLibs.authorData.layers[idx].expanded){
          authorLibs.authorData.layers[idx].list.slice().reverse().forEach(function(layer, layerIdxR){
            if (err > -1) return;
            var layerIdx = authorLibs.authorData.layers[idx].list.length -1 - layerIdxR;
            var item = authorLibs.authorData[layer.type].filter(function(object){ return object.id === layer.id})[0];
            if (item === undefined) {
              err = layerIdx
              return;
            }
            var type = layer.type;
            var dataTxt = ' data-layer="'+idx+'" data-idx="'+layerIdx+'" ';
            if (type === 'objects') type = item.type;
            menu += '<tr id="'+type+'_'+layerIdx+'" onclick="authorLibs.author.getProps(\''+layer.type+'\',\''+ layer.id + '\')">';
            menu +='<td width="100%" class="layername" ondrop="authorLibs.utils.dropMenuItem(event)">';
            menu +='<div '+ dropTxt + ' ' + dataTxt + '>';
            menu +='<img style="vertical-align:top" data-type="layer" ' + dataTxt + ' src="./image/icon_layers_' + (layerIdx === authorLibs.authorData.layers[idx].list.length-1 ? 'l' :  't' ) + '.png">';
            menu +='<img class="layer_icons" ' + dropTxt + ' ' + dataTxt + ' src="./image/icon_layer_' + type + '.png">';
            menu +='<div class="layers_t" ' + dropTxt + ' ' + dataTxt + '>' + item.name + '</div>';
            if (item.show !== undefined) menu +='<img class="layershow" onclick="authorLibs.utils.layerToggle(\''+item.id+'\',\''+layer.type+'\',\'show\')" data-type="layer" data-layer="'+idx+'" data-idx="'+layerIdx+'" src="./image/icon_layer_' + (item.show ? 'show' :  'hide' ) + '.png">';
            menu += '</div>';
            menu += '</td>';
            menu += '</tr>';
          });
          if (err > -1) {
            authorLibs.authorData.layers[idx].list.splice(err, 1);
            restartCanvasser("sample", authorLibs.authorData, "string");
          }
        }
      });
      menu +='</table>';
      menuHolder.innerHTML = menu;
      return;
    }

    var sorter = ['objects','images', 'anims'];
    sorter.forEach(function(testType){
      if (type === testType){
        authorLibs.authorData[testType].sort(function(a, b){
          if(a.name < b.name) return -1;
          if(a.name > b.name) return 1;
          return 0;
        });
      }
    });

    var objectFilter = document.getElementById('objectfilter').value;

    authorLibs.authorData[type].forEach(function(menuItem, idx){
      if (type === 'anims'  || type === 'constraints' || type === 'groups' || type === 'particles'
       || type === 'shapes' || type === 'sounds'      || type === 'tests'  || type === 'vars'){
        menu += '<tr class="clicktr" id="'+type+'_'+menuItem.id+'" onclick="authorLibs.author.getProps(\''+type+'\',\''+ menuItem.id + '\')">';
        menu +='<td width="100%">' + menuItem.name + '</td>';
        menu += '</tr>';
      }

      if (type === 'images'){
        var url = authorLibs.utils.prePath(menuItem);
        menu += '<tr class="clicktr" id="'+type+'_'+menuItem.id+'" onclick="authorLibs.author.getProps(\''+type+'\',\''+ menuItem.id + '\')">';
        menu +='<td class="imageid"><div class="imagetext" id="imagetext-'+menuItem.id+'">' + menuItem.id + '</div></td>';
        if (menuItem.local) menu +='<td width="50px"><img src="' + menuItem.data + '" alt="' + menuItem.id + '"></td>';
        else menu +='<td width="50px"><img src="' + url + '" alt="' + menuItem.id + '"></td>';
        menu += '</tr>';
        var img = new Image();
        img.onload = function() {
          var img = document.getElementById('imagetext-'+ menuItem.id);
          if (img !== undefined) img.innerHTML =  menuItem.name + '<br>' + this.width + 'x' + this.height;
        }
        img.src = url;

      }
      if (type === 'objects'){
        if (menuItem.name.indexOf(objectFilter) === -1) return;
        menu += '<tr class="clicktr" id="'+type+'_'+menuItem.id+'" onclick="authorLibs.author.getProps(\''+type+'\',\''+ menuItem.id + '\')">';
        menu +='<td width="75%" style="font-size:1.3em;">' + menuItem.name + '</td>';
        menu +='<td width="25%">' + menuItem.type + '</td>';
        menu += '</tr>';
      }

      if (type === 'paths'){
        menu += '<tr class="clicktr" id="'+type+'_'+menuItem.id+'" onclick="authorLibs.author.getProps(\''+type+'\',\''+ menuItem.id + '\')">';
        menu +='<td width="50%">' + menuItem.id + '</td>';
        menu +='<td width="50%">' +menuItem.url + '</td>';
        menu += '</tr>';
      }
    });
    menu +='</table>';
    menuHolder.innerHTML = menu;
    if (type === 'objects') authorLibs.menus.updateMenu('layers');
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

    Object.keys(authorLibs.authorData.settings).forEach(function(setting){
      settings += '<tr class="clicktr" id="settings_'+setting+'" onclick="authorLibs.author.getProps(\'settings\',\''+ setting + '\')">';
      settings +='<td width="50%">' + setting + '</td>';
      settings +='<td width="50%">' + authorLibs.authorData.settings[setting] + '</td>';
      settings += '</tr>';
    });
    settings +='</table>';
    settingHolder.innerHTML = settings;
  }

}
