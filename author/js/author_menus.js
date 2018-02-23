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
    authorLibs.buildProp.get(type,  newObj.id);
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
    authorLibs.utils.requestJson(authorLibs.externalsPath + 'sample/json/' + url + '?' + new Date().getTime(), function(data){restartCanvasser("sample", data, 'string');});
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
    if (authorLibs.authorData[type] === undefined) authorLibs.authorData[type] = [];

    var menuHolder       = document.getElementById(type.slice(0, -1) + "holder");
    menuHolder.innerHTML = '';
    var menuTable        = authorLibs.windows.makeTable({parent:menuHolder, classes:'objtable', id:type+'table', width:'100%'});

    if (type === 'samples'){
      authorLibs.rules.samples.forEach(function(sampy){
        var tr = authorLibs.windows.makeTr({parent:menuTable, classes:'clicktr', id:type+'_'+sampy.id, click:function(){authorLibs.menus.loadSample(sampy.url)}});
        var td = authorLibs.windows.makeTd({parent:tr, classes:'shapeid'});
        authorLibs.windows.makeDiv({parent:td, html:sampy.id});
      });
      return;
    }

    if (type === 'layers'){
      authorLibs.utils.layersClean();
      authorLibs.authorData[type].slice().reverse().forEach(function(menuItem, idxR){
        var idx = authorLibs.authorData[type].length -1 - idxR;
        var dataLayer =[{id:'type', val:'layer'}, {id:'layer', val:idx}, {id:'idx', val:-1}];
        var tr = authorLibs.windows.makeTr({parent:menuTable, classes:'clicktr'});
        var td = authorLibs.windows.makeTd({parent:tr, width:'100%', classes:'layers_title', click:function(){authorLibs.buildProp.get('layers',idx);},
          drop:function(){authorLibs.utils.dropMenuItem(event)}, drag:true, dragover:function(){authorLibs.utils.dropMenuItemAllow(event)},
          dragstart:function(){authorLibs.utils.dragMenuItem(event)}, data:dataLayer});
        authorLibs.windows.makeImg({parent:td,  classes:'layerexp', click:function(){authorLibs.utils.layerToggle(idx,'layer','expanded')},
          data:dataLayer, src:'./image/icon_layers_'+(authorLibs.authorData.layers[idx].expanded ? 'e' : 'c')+'.png'});
        authorLibs.windows.makeDiv({parent:td,  classes:'layer_title_text', click:function(){authorLibs.buildProp.get('layers',idx)}, data:dataLayer, html:menuItem.name});
        authorLibs.windows.makeImg({parent:td,  classes:'layershow', click:function(){authorLibs.utils.layerUpdate(this, idx, 'show', 'btoggle')},
          data:dataLayer, src:'./image/icon_layers_'+(authorLibs.authorData.layers[idx].show ? 'show' : 'hide')+'.png'});

        if (authorLibs.authorData.layers[idx].expanded){
          authorLibs.authorData.layers[idx].list.slice().reverse().forEach(function(layer, layerIdxR){
            var layerIdx  = authorLibs.authorData.layers[idx].list.length -1 - layerIdxR;
            var item      = authorLibs.authorData[layer.type].filter(function(object){ return object.id === layer.id})[0];
            var type      = layer.type;
            var dataLayer = [{id:'type', val:'layer'}, {id:'layer', val:idx}, {id:'idx', val:layerIdx}];
            if (type === 'objects') type = item.type;
            var tr  = authorLibs.windows.makeTr({parent:menuTable, id:type+'_'+layerIdx, click:function(){authorLibs.buildProp.get(layer.type,layer.id)}});
            var td  = authorLibs.windows.makeTd({parent:tr, width:'100%', classes:'layername', drop:function(){authorLibs.utils.dropMenuItem(event)}});
            var div = authorLibs.windows.makeDiv({parent:td, drag:true,  dragover:function(){authorLibs.utils.dropMenuItemAllow(event)},
            dragstart:function(){authorLibs.utils.dragMenuItem(event)}, data:dataLayer});
            authorLibs.windows.makeImg({parent:div, style:'vertical-align:top', data:dataLayer,
              src:'./image/icon_layers_' + (layerIdx === authorLibs.authorData.layers[idx].list.length-1 ? 'l' :  't' ) + '.png'});
            authorLibs.windows.makeImg({parent:div, classes:'layer_icons', drag:true, dragover:function(){authorLibs.utils.dropMenuItemAllow(event)},
              dragstart:function(){authorLibs.utils.dragMenuItem(event)}, data:dataLayer, src:'./image/icon_layer_' + type + '.png'});
            authorLibs.windows.makeDiv({parent:div, classes:'layers_t',drag:true, dragover:function(){authorLibs.utils.dropMenuItemAllow(event)},
              dragstart:function(){authorLibs.utils.dragMenuItem(event)}, data:dataLayer, html:item.name});
            if (item.show !== undefined){
              authorLibs.windows.makeImg({parent:div, classes:'layershow', click:function(){authorLibs.utils.layerToggle(item.id,layer.type,'show')},
                data:dataLayer, src:'./image/icon_layer_' + (item.show ? 'show' :  'hide' ) + '.png'});
            }
          });
        }
      });
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
        var tr  = authorLibs.windows.makeTr({parent:menuTable, classes:'clicktr', id:type+'_'+menuItem.id, click:function(){authorLibs.buildProp.get(type, menuItem.id)}});
        var td  = authorLibs.windows.makeTd({parent:tr, width:'100%', html:menuItem.name });
      }

      if (type === 'images'){
        var url = authorLibs.utils.prePath(menuItem);
        var tr  = authorLibs.windows.makeTr({parent:menuTable, classes:'clicktr', id:type+'_'+menuItem.id, click:function(){authorLibs.buildProp.get(type, menuItem.id)}});
        var td  = authorLibs.windows.makeTd({parent:tr, classes:'imageid'});
        authorLibs.windows.makeDiv({parent:td, classes:'imagetext', id:'imagetext-'+menuItem.id, html:menuItem.id});
        var sourceImg = url;
        if (menuItem.local)  sourceImg =  menuItem.data ;

        var tda = authorLibs.windows.makeTd({parent:tr, width:'50px'});
        authorLibs.windows.makeImg({parent:tda, src:sourceImg});
        var img = new Image();
        img.onload = function() {
          var img = document.getElementById('imagetext-'+ menuItem.id);
          if (img !== undefined) img.innerHTML =  menuItem.name + '<br>' + this.width + 'x' + this.height;
        }
        img.src = url;
      }

      if (type === 'objects'){
        if (menuItem.name.indexOf(objectFilter) === -1) return;
        var tr  = authorLibs.windows.makeTr({parent:menuTable, classes:'clicktr', id:type+'_'+menuItem.id, click:function(){authorLibs.buildProp.get(type, menuItem.id)}});
        authorLibs.windows.makeTd({parent:tr, style:'font-size:1.3em;', width:'75%', html:menuItem.name});
        authorLibs.windows.makeTd({parent:tr, width:'25%', html:menuItem.type});
      }

      if (type === 'paths'){
        var tr  = authorLibs.windows.makeTr({parent:menuTable, classes:'clicktr', id:type+'_'+menuItem.id, click:function(){authorLibs.buildProp.get(type, menuItem.id)}});
        authorLibs.windows.makeTd({parent:tr, style:'font-size:1.3em;', width:'50%', html:menuItem.id});
        authorLibs.windows.makeTd({parent:tr, width:'50%', html:menuItem.url});
      }
    });
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
    var holder        = document.getElementById("settingholder");
    holder.innerHTML  = '';
    var settingsTable = authorLibs.windows.makeTable({parent:holder, classes:'objtable', id:'settingstable', width:'100%'});
    Object.keys(authorLibs.authorData.settings).forEach(function(setting){
      var tr = authorLibs.windows.makeTr({parent:settingsTable, classes:'clicktr', id:'settings_'+setting, click:function(){authorLibs.buildProp.get('settings', setting)}});
      authorLibs.windows.makeTd({parent:tr, width:'50%', html:setting});
      authorLibs.windows.makeTd({parent:tr, width:'50%', html: authorLibs.authorData.settings[setting]});
    });
  }

}
