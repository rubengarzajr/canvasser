var authorLibs = {
  externalsPath:  './',
  defaultJSONobj: false,
  defaultJSON:    "./json/default.json",
  contentPath: '../../canvasser_content',
  gui: {
    mousedown: false,
    moveElement: null,
    mousePos: {x:0,y:0},
    offset: {x:0,y:0},
    zidx: 25
  },
  lists:{
    fileManger:[]
  },
  endpoints:{
    files:"files",
    projects:"projects"
  }
};

document.onreadystatechange = function(){
     if(document.readyState === 'complete'){
        initAuthorCanvasser();
     }
}


function learning(action, page){
  if (window.learningHistory === undefined) window.learningHistory = {idx:-1, pages:[]};

  if (action === 'load'){
    if (window.learningHistory.idx != window.learningHistory.pages.length-1){
      window.learningHistory.pages = window.learningHistory.pages.slice(0, window.learningHistory.idx+1);
    }
    window.learningHistory.pages.push(page);
    window.learningHistory.idx ++;
    authorLibs.utils.requestFile(authorLibs.externalsPath + "learning/html/"+page+".html", popLearn);
  }
  if (action === 'back'){
    if (window.learningHistory.idx <= 0) return;
    window.learningHistory.idx --;
    authorLibs.utils.requestFile(authorLibs.externalsPath + "learning/html/"+window.learningHistory.pages[ window.learningHistory.idx]+".html", popLearn);
  }
}
function popLearn(contents){
  var newContent = contents.split('"./').join('"' + authorLibs.externalsPath);
  document.getElementById("learning").innerHTML = newContent;
}



function pickWin(win, toggle, size, bank){
  document.getElementById(bank).style.zIndex = authorLibs.author.zPlus();
  authorLibs.author.toggleminmax(win, toggle, size);
}


function initAuthorCanvasser(vari, datafile, dataForm){
  authorLibs.windows.build();
  learning('load', 'welcome');
  authorLibs.utils.requestJSON(authorLibs.externalsPath + "json/author.json", setRules);
  function setRules(data){
    authorLibs.rules  = data;
    if (authorLibs.defaultJSONobj) initEdit(authorLibs.defaultJSON);
    else authorLibs.utils.requestJSON(authorLibs.defaultJSON, initEdit);
  }

  function initEdit(datafile){
    authorLibs.author = new authorcanvasser(datafile, 'file');
  }
}

function restartCanvasser(name, data, type){
  data.paths.forEach(function(path){
    if (path.url.substring(0,2) === './') path.url = authorLibs.externalsPath + path.url.substring(2)
  });

  authorLibs.authorData = data;
  authorLibs.canvasser = initCanvasser(name, JSON.stringify(data), type);
  authorLibs.menus.update();

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  var canvasParent = document.getElementById(data.settings.canvasparent);
  var canvas       = canvasParent.firstChild;
  var context      = canvas.getContext('2d');
  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    var message =  mousePos.x + ',' + mousePos.y;
    document.getElementById('outputtitle').innerHTML = message;
  }, false);

  var title = document.getElementById('titlelabel');
  if (title !== undefined) title.innerHTML = 'Canvasser <div class = "version">version ' + authorLibs.canvasser.version + '</span>';
}

function authorcanvasser(dataFile, dataForm){
  this.getProps = authorLibs.buildProp.getProps;
  this.zPlus    = function(){ authorLibs.gui.zidx ++; return  authorLibs.gui.zidx;}

  authorLibs.authorData = dataFile;

  window.addEventListener("mouseup",   moveObjU,  false);
  window.addEventListener("mousemove", mouseMove, false);
  restartCanvasser("sample", authorLibs.authorData, "string");
  authorLibs.menus.update();

  loop();

  function loop(){
    if (authorLibs.gui.moveElement !== null && authorLibs.gui.move){
      authorLibs.gui.moveElement.style.left = authorLibs.gui.mousePos.x  - authorLibs.gui.offset.x + "px";
      authorLibs.gui.moveElement.style.top  = authorLibs.gui.mousePos.y  - authorLibs.gui.offset.y + "px";
      var ext = authorLibs.utils.getVisibleArea();
      var win = authorLibs.gui.moveElement.getBoundingClientRect();

      if (authorLibs.gui.mousePos.x - authorLibs.gui.offset.x < 5) authorLibs.gui.moveElement.style.left = '5px';
      if (authorLibs.gui.mousePos.y - authorLibs.gui.offset.y < 5) authorLibs.gui.moveElement.style.top  = '5px';
      if (win.right  > ext.x-5)  authorLibs.gui.moveElement.style.left = (ext.x-5-win.width)  +'px';
      if (win.bottom > ext.y-10) authorLibs.gui.moveElement.style.top  = (ext.y-10-win.height)+'px';
    }
    window.requestAnimationFrame(loop);
  }

  function mouseMove(ev){
    authorLibs.gui.mousePos = {x:ev.clientX, y:ev.clientY };

    if (authorLibs.gui.moveElement !== null){
      if (document.selection) {
        document.selection.empty()
      } else {
        window.getSelection().removeAllRanges()
      }
    }
  }

  // function moveObjD(element){
  //   authorLibs.gui.move = true;
  //   authorLibs.gui.mousedown   = true;
  //   authorLibs.gui.moveElement = document.getElementById(element);
  //   authorLibs.gui.zidx ++;
  //   authorLibs.gui.moveElement.style.zIndex = authorLibs.gui.zidx;
  //   var off = {x:0, y:0};
  //   if (authorLibs.gui.moveElement.style.left !== "") off.x = authorLibs.gui.mousePos.x - parseInt(authorLibs.gui.moveElement.style.left.slice(0,-2));
  //   if (authorLibs.gui.moveElement.style.top  !== "") off.y = authorLibs.gui.mousePos.y - parseInt(authorLibs.gui.moveElement.style.top.slice(0,-2));
  //   authorLibs.gui.offset      = {x:off.x, y:off.y};
  // }
  //
  // function focusObjD(element){
  //   authorLibs.gui.zidx ++;
  //   document.getElementById(element).style.zIndex = authorLibs.gui.zidx;
  // }

  function moveObjU(ev){
    authorLibs.gui.mousedown = false;
    authorLibs.gui.moveElement = null;
  }
  this.loadSample = function(url){
    authorLibs.utils.requestJSON(authorLibs.externalsPath + 'sample/json/' + url + '?' + new Date().getTime(), function(data){restartCanvasser("sample", data, 'string');});
  }
  this.loadDefault = function(){
    if (!authorLibs.defaultJSONobj)  authorLibs.utils.requestJSON(authorLibs.defaultJSON, function(data){restartCanvasser("sample", data, 'string');});
  }
  this.reload = function(){
    restartCanvasser("sample", authorLibs.authorData, "string");
    authorLibs.author.view()
  }

  this.view = function(){
    document.getElementById("paste").value = JSON.stringify(authorLibs.authorData);
  }
  this.paste = function(){
    var pasteData = document.getElementById("paste").value;
    authorLibs.menus.update();
    restartCanvasser("sample", JSON.parse(pasteData), "string");
  }
  this.format = function(){
    var pasteData = document.getElementById("paste").value;
    document.getElementById("paste").value = JSON.stringify(authorLibs.authorData, null, 4);
  }
  this.toggleminmax= function(element, minmax, maxsize){
    var d = document.getElementById(element);
    var b = document.getElementById(minmax);
    if (d.style.display === "block"){
      d.style.display="none";
      b.src=authorLibs.externalsPath + "image/icon_max_g.png";
    }
    else {
      d.style.display = "block";
      b.src=authorLibs.externalsPath +"image/icon_min_g.png";
    }
  }

  this.adddrawcode = function(id){
    var shape = authorLibs.authorData.shapes.filter(function(shape){ return shape.id === id;})[0];
    shape.drawcode.push({type:'fill'});
    authorLibs.buildProp.getProps('shapes', id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  }

  this.moveprop = function(type,id,path,moveto){
    var obj = authorLibs.authorData[type].filter(function(test){return test.id === id})[0];
    var arr = path.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj.splice(moveto, 0, obj.splice(arr[0], 1)[0]);
    authorLibs.buildProp.getProps(type, id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  }

  this.deleteprop = function(type,id,path){
    var obj = authorLibs.authorData[type].filter(function(test){return test.id === id})[0];
    var arr = path.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj.splice(arr[0],1);
    authorLibs.buildProp.getProps(type, id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  }

  function handleColor(object, type, widget, path){
    var str = '';
    var pos = {x:authorLibs.utils.getSubProp(object, path+'.x'), y:authorLibs.utils.getSubProp(object, path+'.y')};

    str += authorLibs.utils.buildDiv('entrylabel c_entrylabel_pos w100', widget.field );
    str += '<span>';
    str += '<span class="entrytitle c_entrylabel_pos">X</span>'
    str += '<input class="auth_xy" type="number" value="'+ pos.x + '" ';
    str += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [object.id, type, path+'.x'], true);
    str +=   '>';
    str += '<span class="entrytitle c_entrylabel_pos">Y</span>'
    str += '<input class="auth_xy" type="number" value="'+ pos.y + '" ';
    str += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [object.id, type, path+'.y'], true);
    str +=   '>'  + "</span><br>";
    return str;
  }

  function outText(label, value, cmd){
    '<div class="entrylabel c_entrytitle_text w100">' + label + '</div><input class="auth_text" type="text" value="'+ value +'"><br>';
    return output;
  }

  this.createPosXY = function(objectId, paramPath){
    var objGet = authorLibs.authorData.objects.filter(function(finder){return (finder.id === objectId);})[0];
    this.createItem("0", objectId, 'position.'+paramPath+'.x');
    this.createItem("0", objectId, 'position.'+paramPath+'.y');
    authorLibs.buildProp.getProps("objects",objGet.id);
  };

  this.createScale = function(objectId, paramPath){
    var objGet = authorLibs.authorData.objects.filter(function(finder){return (finder.id === objectId);})[0];
    this.createItem("1", objectId, 'scale.'+paramPath);
    authorLibs.buildProp.getProps("objects",objGet.id);
  };

  this.createItem = function(newVal, objectId, paramPath){
    var objGet = authorLibs.authorData.objects.filter(function(finder){return (finder.id === objectId);})[0];
    authorLibs.utils.setSubProp(objGet, paramPath, newVal);
    restartCanvasser("sample", authorLibs.authorData, "string");
  };



  this.updateSelect = function(domElement, objectId, positionId, axisId){
    var objGet = authorLibs.authorData[type].filter(function(finder){return (finder.id === id);})[0];
    var newRule = authorLibs.rules.actions.filter(function(ruleName){
      return ruleName.elementType === domElement.value}
    )[0];
    if (listIndex === "none"){
      objGet[prop] = domElement.value;
    } else {
      objGet[prop][listIndex] = {type:domElement.value};
      newRule.widgets.forEach(function(rule){
        var keys = Object.keys(rule);
        keys.forEach(function(key){
          objGet[prop][listIndex][key] = rule[key];
        });
      });
    }
    authorLibs.menus.update(type);
    authorLibs.buildProp.getProps(type, id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  }

  this.updateActionList = function(domElement, objectId, type, paramPath){
    var item = authorLibs.authorData[type].filter(function(finder){return (finder.id === objectId);})[0];
    var prop = authorLibs.utils.getSubProp(item, paramPath);
    this.updateItem(domElement, objectId, type.slice(0, -1), paramPath);
    var newRule = authorLibs.rules.actions.filter(function(ruleName){
      return ruleName.elementType === domElement.value}
    )[0];

    authorLibs.menus.update('objects');
    authorLibs.buildProp.getProps('objects', objectId);
    restartCanvasser("sample", authorLibs.authorData, "string");
  }

  this.updateTimeline = function(domElement, objectId, type, paramPath){
    var objGet = authorLibs.authorData.anims.filter(function(finder){return (finder.id === objectId);})[0];
    var prop = authorLibs.utils.getSubProp(objGet, paramPath);
    this.updateItem(domElement, objectId, 'anim', paramPath);
    var newRule = authorLibs.rules.actions.filter(function(ruleName){
      return ruleName.elementType === domElement.value}
    )[0];

    authorLibs.menus.update('objects');
    authorLibs.buildProp.getProps('objects', objectId);
    restartCanvasser("sample", authorLibs.authorData, "string");
  }

  this.updateSetting = function(domElement, setting){
    authorLibs.authorData.settings[setting] = domElement.value;
    authorLibs.menus.update('settings');
    restartCanvasser("sample", authorLibs.authorData, "string");
  }

  this.updateItem = function(domElement, objectId, type, paramPath){
    var newVal = domElement.value.toString();
    if (domElement.type === 'checkbox') newVal = domElement.checked;
    if (newVal === '---NONE---')        newVal = undefined;
    var   objGet = authorLibs.authorData[type+'s'].filter(function(finder){return (finder.id === objectId);})[0];
    authorLibs.utils.setSubProp(objGet, paramPath, newVal);
    authorLibs.buildProp.getProps(type+'s', objGet.id);
    authorLibs.menus.update(type);
    restartCanvasser("sample", authorLibs.authorData, "string");
  };

  this.togglegroup = function(domElement, objectId, type, paramPath, groupName){
    var element = domElement.checked;
    var objGet  = authorLibs.authorData[type+'s'].filter(function(finder){return (finder.id === objectId);})[0];
    if (objGet.groups === undefined) objGet.groups = [];

    if (element){
      if (findInGroup(objGet, groupName) === -1) objGet.groups.push({id:groupName});
    } else {
      var splicer = findInGroup(objGet, groupName);
      if (splicer > -1) objGet.groups.splice(splicer, 1);
    }

    authorLibs.menus.update(type);
    restartCanvasser("sample", authorLibs.authorData, "string");
  }

  function findInGroup(item, groupName){
    var index = -1;
    if (item.groups === undefined) return index;
    item.groups.forEach(function(subObj, idx){
      if (subObj.id === groupName) {
        index = idx;
      }
    });
    return index;
  }

  this.addaction = function(id, type, listType){
    var objGet = authorLibs.authorData[type].filter(function(finder){return (finder.id === id);});
    if (objGet.length === 0) return;
    if( objGet[0][listType] === undefined)  objGet[0][listType] = [];
    objGet[0][listType].push({"type":"cleardown"});
    authorLibs.buildProp.getProps(type,objGet[0].id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  }

  this.addtest = function(id, type, listType){
    var objGet = authorLibs.authorData[type].filter(function(finder){return (finder.id === id);});
    if (objGet.length === 0) return;
    if( objGet[0][listType] === undefined)  objGet[0][listType] = [];
    objGet[0][listType].push({"type":"var"});
    authorLibs.buildProp.getProps(type,objGet[0].id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  }

  this.deleteitem = function(type, objName, listType, index){
    var objGet = authorLibs.authorData[type].filter(function(finder){return (finder.id === objName);});
    if (objGet.length === 0) return;
    objGet[0][listType].splice(index,1);
    authorLibs.buildProp.getProps(type,objGet[0].id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  }

  this.deletetimeline = function(animName, index){
    var animGet = authorLibs.authorData.anims.filter(function(finder){return (finder.id === animName);});
    if (animGet.length === 0) return;
    animGet[0].timelist.splice(index,1);
    authorLibs.buildProp.getProps("anims",animName);
    restartCanvasser("sample", authorLibs.authorData, "string");
  }

  this.addAnimCommand = function(animName, timelist){
    var animGet = authorLibs.authorData.anims.filter(function(finder){return (finder.id === animName);});
    if (animGet.length === 0) return;
    animGet[0][timelist].push({"type":"console"});
    authorLibs.buildProp.getProps("anims",animName);
  }

  this.addConstraint = function(constraintName, driverlist){
    var driver = authorLibs.authorData.constraints.filter(function(finder){return (finder.id === constraintName);});
    if (driver.length === 0) return;
    driver[0][driverlist].push({"type":"position"});
    authorLibs.buildProp.getProps("constraints", constraintName);
  }

  function printRecusiveObj(output, element, indent){
    var indnt = "<br>";
    for (var i = 0; i < indent; i++){
      indnt +="&nbsp;&nbsp;&nbsp;"
    }

    if (get_type(element) === "[object Object]"){
      for(var prop in element){
        output += printRecusiveObj(indnt + prop, element[prop], indent+1);
      }
      return output;
    }

    if (get_type(element) === "[object Array]"){
      element.forEach(function(arrayElement){
        output += printRecusiveObj(indnt, arrayElement, indent+1);
      });
      return output;
    }
    output += " " + element;
    return output;
  }

  function get_type(thing){
    if(thing===null)return "[object Null]"; // special case
    return Object.prototype.toString.call(thing);
  }

  function init(data){
    act.canvas        = document.createElement('canvas');
    act.context       = act.canvas.getContext('2d');
    act.canvas.width  = data.settings.canvaswidth;
    act.canvas.height = data.settings.canvasheight;
    act.data          = data;
    document.getElementById(data.settings.canvasparent).appendChild(act.canvas);
    act.canvas.addEventListener('mousemove', getMousePos, false);
    act.canvas.addEventListener('click', getClickPos, false);

    act.data.images.forEach(function(image){
      var imageObj    = new Image();
      imageObj.onload = function() { act.imageList[image.id] = this; };
      imageObj.src = image.url;
    });
  }
}
