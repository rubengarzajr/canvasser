function initAuthorCanvasser(vari, datafile, dataForm){
  function requestJSON(fileNamePath, returnFunction){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        returnFunction(JSON.parse(xhr.responseText));
      }
      if (xhr.status == 404) console.error("JSON File Load Error: " + xhr.statusText + " " + xhr.readyState);
    }
    xhr.overrideMimeType('application/json');
    xhr.open('GET', fileNamePath, true);
  xhr.send(null);
  }

  requestJSON("./json/author.json", setRules);
  function setRules(data){
    window.rules  = data;
    window.author = new authorcanvasser(datafile, dataForm);
  }
}

function authorcanvasser(dataFile, dataForm){
  var UIdata = {
    mousedown: false,
    moveElement: null,
    mousePos: {x:0,y:0},
    offset: {x:0,y:0},
    zidx: 25
  };

  var authorData = {
"objects":[
{"id":"bkimg","type":"image","show":true,"group":["images"],"image":"backgr","scale":{"current":1},"position":{"current":{"x":360,"y":350}},"origin":"center","testp":true,"clicklist":[]},
{"id":"drag_button", "type":"image","show":true,"group":["buttons"],"image":"drag1","scale":{"current":1,"rate":0},"position":{"current":{"x":155,"y":30},"rate":0},"testp":true,"draglist":[{"type":"slideobject","id":"drag_button"}],"clicklist":[]},
{"id":"click_button_on","type":"image","show":true,"group":["buttons"],"image":"click1","scale":{"current":1},"position":{"current":{"x":20,"y":20}}, "testp":true,"draglist":[],"clicklist":[{"type":"cleardown"},{"type":"vis","filter":"group","id":"images","show":false}]},
{"id":"click_button_off","type":"image","show":true,"group":["buttons"],"image":"click2","scale":{"current":1},"position":{"current":{"x":20,"y":75}},"testp":true,"draglist":[],"clicklist":[{"type":"cleardown"},{"type":"vis","filter":"group","id":"images","show":true}]}
],
"images":[
    {"id":"backgr",  "url":"./sample/image/sample/background_400px.png"},
    {"id":"click1",  "url":"./sample/image/sample/sample_click_1.png"},
    {"id":"click2",  "url":"./sample/image/sample/sample_click_2.png"},
    {"id":"drag1",   "url":"./sample/image/sample/sample_drag_1.png"}
],
"paths":[
    {"id":"use",   "url":"./image/sample"}
],
"shapes":{
    "sq":[{"type":"rect","offset":{"x":0,"y":0},"width":600,"height":600}, {"type":"fillStyle","color":"yellow"}, {"type":"fill"}, {"type":"ptest"}]
},
"settings":{
    "canvaswidth":"600",
    "canvasheight":"600",
    "canvasdomname":"activity",
    "canvasparent":"canvasholder"}
};

  document.getElementById("canvasmover").addEventListener("mousedown",     function(){moveObjD("canvasbank")},     false);
  document.getElementById("objectmover").addEventListener("mousedown",     function(){moveObjD("objectbank")},     false);
  document.getElementById("imagemover").addEventListener("mousedown",      function(){moveObjD("imagebank")},      false);
  document.getElementById("jsonmover").addEventListener("mousedown",       function(){moveObjD("jsonbank")},       false);
  document.getElementById("settingmover").addEventListener("mousedown",    function(){moveObjD("settingbank")},    false);
  document.getElementById("propertiesmover").addEventListener("mousedown", function(){moveObjD("propertiesbank")}, false);
  window.addEventListener("mouseup",   moveObjU,  false);
  window.addEventListener("mousemove", mouseMove, false);
  initCanvasser("sample", JSON.stringify(authorData), "string");
  updateObjects();
  updateImages();
  loop();

  function loop(){
    if (UIdata.moveElement !== null){
      UIdata.moveElement.style.left = UIdata.mousePos.x  - UIdata.offset.x + "px";
      UIdata.moveElement.style.top  = UIdata.mousePos.y  - UIdata.offset.y + "px";
    }
    window.requestAnimationFrame(loop);
  }

  function mouseMove(ev){
    UIdata.mousePos = {x:ev.clientX, y:ev.clientY };

    if (UIdata.moveElement !== null){
      if (document.selection) {
        document.selection.empty()
      } else {
        window.getSelection().removeAllRanges()
      }
    }
  }

  function moveObjD(element){
    UIdata.mousedown   = true;
    UIdata.moveElement = document.getElementById(element);
    UIdata.zidx ++;
    UIdata.moveElement.style.zIndex = UIdata.zidx;
    var off = {x:0, y:0};
    if (UIdata.moveElement.style.left !== "") off.x = UIdata.mousePos.x - parseInt(UIdata.moveElement.style.left.slice(0,-2));
    if (UIdata.moveElement.style.top  !== "") off.y = UIdata.mousePos.y - parseInt(UIdata.moveElement.style.top.slice(0,-2));
    UIdata.offset      = {x:off.x, y:off.y};
  }

  function moveObjU(ev){
    UIdata.mousedown = false;
    UIdata.moveElement = null;
  }

  this.reload = function(){
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }
  this.load_click = function(){
    document.getElementById("uploader").click();
  }
  this.load = function(){
    var file = document.getElementById("uploader").files[0];
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
  }
  this.view = function(){
    document.getElementById("paste").value = JSON.stringify(authorData);
  }
  this.paste = function(){
    var pasteData = document.getElementById("paste").value;
    authorData = JSON.parse(pasteData);
    updateImages();
    updateObjects();
    initCanvasser("sample", pasteData, "string");
  }
  this.format = function(){
    var pasteData = document.getElementById("paste").value;
    document.getElementById("paste").value = JSON.stringify(authorData, null, 4);
  }
  this.toggleminmax= function(element, minmax, maxsize){
    var d = document.getElementById(element);
    var b = document.getElementById(minmax);
    if (d.style.display === "block"){
      d.style.display="none";
      b.src="image/icon_max_g.png";
    }
    else {
      d.style.display = "block";
      b.src="image/icon_min_g.png";
    }
  }

  this.togglejson= function(){
    var s = document.getElementById("jsonmenu");
    var b = document.getElementById("togglejson");
    if (s.style.display === "block") {
      s.style.display = "none";
      b.src="image/icon_max_g.png";
    }
    else {
      s.style.display = "block";
      b.src="image/icon_min_g.png";
    }
  }



  function updateObjects(){
    var objectHolder = document.getElementById("objectholder");
    var objects = '<table class="objtable" width="100%">';
    authorData.objects.forEach(function(object){
      objects += '<tr class="clicktr" id="'+object.id+'" onclick="window.author.getProps(\'objects\',\''+ object.id + '\')">';
      objects +='<td width="50%">' + object.id + '</td>';
      objects +='<td width="50%">' + object.type + '</td>';
      objects += '</tr>';
    });
    objects +='</table>';
    objectHolder.innerHTML = objects;
  }

  function updateImages(){
    var imageHolder = document.getElementById("imageholder");
    var images = "<table>";
    authorData.images.forEach(function(image){
      images += '<tr class="clicktr" id="'+image.id+'" onclick="window.author.getProps(\'images\',\''+ image.id + '\')">'
      images +='<td class="imageid"><div class="imagetext">' + image.id + '</div></td>';
      images +='<td width="50%"><img src="' + image.url + '" alt="' + image.id + '"></td>';
      images += '</tr>';
    });
    images +='</table>';
    imageHolder.innerHTML = images;
  }

  this.addImage = function(){
    authorData.images.push({id:"newImage",  url:"./image/no_image.png"});
    updateImages();
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }

  this.addObject = function(){
    authorData.objects.push({id:"wee", type:"image",  show:true, position:{current:{x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)}}, scale:{current:1}});
    updateObjects();
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }

  this.getProps = getProps;
  function getProps(type, id){
    thisProp = authorData[type].filter(function(selected){return selected.id === id;})[0];
    if (thisProp === undefined) return;
    document.getElementById("propertiestitle").innerHTML ='<div class="proptitle">' + (type === 'objects' ? 'Object: ' + id + ' : ' + thisProp.type : 'Image: ' + id) + '</div>';
    var propUI = document.getElementById("properties");
    var prop = '<div class="propbody">' ;
    if (type === 'objects') prop = buildPropUIObject(prop, thisProp);
    else prop = buildPropUIimage(prop, thisProp);
    propUI.innerHTML = prop + '</div>';
  }

  function buildPropUIimage(output, image){
    window.rules.image.imagedata.widgets.forEach(function(widget, idx, source){
      output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
      output += '<input class="auth_text w400" type="text" value="'+ image[widget.field] + '" ';
      output += buildFnString('window.author.updateActivity', ['images', 'text', image.id, widget.field, 'none'], true);
      output += '><br>';
    });
    updateImages();
    return output;
  }

  function handleBoolean(object, widget, path){
    var str = '';
    var defaultId = getSubProp(object, path);
    str += '<div class="entrylabel c_entrytitle_text w100">' + widget.field + '</div><input class="checkbox" type="checkbox" ' + (defaultId ? "checked " : "");
    str += buildFnString('window.author.updateItem', [object.id, path], true) + '><br>';
    return str;
  }
  function handleObjectList(object, widget, path){
    var str = '';
    var objectList = ObjPartToArr(authorData.objects, "id");
    var defaultId = getSubProp(object, widget.field);
    str += buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += buildSelect('window.author.updateItem',  object.id, objectList, defaultId, path) + '<br>';
    return str;
  }
  function handleSelect(object, widget, path){
    var str = '';
    var selOp =  window.rules.select[widget.id].list;
    var defaultId = getSubProp(object, path);
    str += buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += buildSelect('window.author.updateItem',  object.id, selOp,  defaultId, path) + '<br>';
    return str;
  }
  function handleText(object, widget, path){
    var str = '';
    var defaultId = getSubProp(object, path);
    str += buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += '<input class="auth_text" type="text" value="'+ defaultId + '" ';
    str += buildFnString('window.author.updateItem', [object.id, path], true);
    str +=   '>'  + "<br>";
    return str;
  }
  function handleAction(object, widget, path){

  }

  function buildPropUIObject(output, object){
    var win = 'window.author.updateActivity';
    window.rules.object[object.type].widgets.forEach(function(widget, idx, source){
      if (widget.type === "text")         output += handleText(object, widget, widget.field);
      if (widget.type === "select")       output += handleSelect(object, widget, widget.field);
      if (widget.type === "arraystrings") output += '<div class="entrylabel c_entrytitle_text w100">' + widget.field + '</div><input class="auth_text" type="text" value="'+ object[widget.field]+'"><br>';
      if (widget.type === "bool")         output += handleBoolean(object, widget, widget.field);
      if (widget.type === "imagedata"){
        var imageList = ObjPartToArr(authorData.images, "id");
        output += buildDiv('entrylabel c_entrytitle_text w100', widget.field );
        output += buildSelect('window.author.updateItem',  object.id, imageList, object[widget.field], widget.field) + '<br>';
      }
      if (widget.type === "objlist")   output += handleObjectList(object, widget, widget.field);

      if (widget.type === "posxy"){
        output += '<div style="display:flex"><div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
        var hasDestination = false;
        var hasRate        = false;
        var hasOffset      = false;
        for(var posObj in object[widget.field]){
          if (posObj === "destination") hasDestination = true;
          if (posObj === "offset")      hasOffset      = true;
          if (posObj === "rate")        hasRate        = true;
        }
        if (object.parent !== undefined && !hasOffset) object[widget.field].offset = object[widget.field].current;
        if (!hasDestination) object[widget.field].destination = undefined;
        if (!hasRate) object[widget.field].rate = 0;

        for(var posObj in object[widget.field]){
          if (posObj === "rate"){
            var tempPos =  (object[widget.field][posObj] !== undefined ? tempPos = object[widget.field][posObj] : 0);
            output += '<div class="entrylabel c_entrylabel_pos w50">' + posObj + '</div><input class="auth_xy"';
            output += buildFnString('window.author.updateItem', [object.id, 'position.'+posObj], true);
            output += 'type="number" value=' + object.position.rate + ' />' + '<br>';
          }else{
            var tempPos = {x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)};
            var hasXY = false;
            var enable = true;
            if (object[widget.field][posObj] !== undefined){
              tempPos = object[widget.field][posObj];
              hasXY = true;
              enable = false;
            }
            if (posObj === "current" && object.parent !== undefined) {hasXY = false; enable=false;}
            output += '<div class="entrylabel c_entrylabel_pos w100">' + posObj + '</div><span ' +  (hasXY ? "" : 'style="display:none"') + '>';
            output += ' <span class="entrytitle c_entrylabel_pos">X</span> <input class="auth_xy" ';
            output += buildFnString('window.author.updateItem', [object.id, 'position.'+posObj+'.x'], true);
            output += 'type="number" value=' + tempPos.x + ' />';
            output += ' <span class="entrytitle c_entrylabel_pos">Y</span> <input class="auth_xy" ';
            output += buildFnString('window.author.updateItem', [object.id, 'position.'+posObj+'.y'], true);
            output += 'type="number" value=' + tempPos.y + ' />';
            if (posObj !== 'current' && posObj !== 'offset') output += '<div class ="divbutton" onclick="window.author.reload()">Disable</div>'
            output += '</span>'
            if (enable) output += '<div class ="divbutton" onclick="window.author.createPosXY(\''+object.id+'\',\'destination\')">Enable</div>'
            output += '<br>';
          }
        }
        output += '<div class ="divbutton" onclick="window.author.reload()">Add position</div>'
        output += '</div>';
      }
      if (widget.type === "scale"){
        output += '<div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
        var hasDestination = false;
        var hasRate        = false;
        var hasOffset      = false;
        for(var scaleObj in object[widget.field]){
          if (scaleObj === "destination") hasDestination = true;
          if (scaleObj === "rate")        hasRate        = true;
          if (scaleObj === "offset")      hasOffset      = true;
        }
        if (object.parent !== undefined && !hasOffset) object[widget.field].offset = object[widget.field].current;
        if (!hasDestination) object[widget.field].destination = undefined;
        if (!hasRate) object[widget.field].rate = 0;

        for (var scaleObj in object[widget.field]){
          if (scaleObj === "rate"){
            var tempScale =  (object[widget.field][scaleObj] !== undefined ? tempScale = object[widget.field][scaleObj] : 0);
            output += '<div class="entrylabel c_entrylabel_pos w50">' + scaleObj + '</div><input class="auth_xy"';
            output += buildFnString('window.author.updateItem', [object.id, 'scale.'+scaleObj], true);
            output += 'type="number" value=' + object.scale.rate + ' />' + '<br>';
          }else{
            var tempScale = 1;
            var hasScale = false;
            if (object[widget.field][scaleObj] !== undefined){
              tempScale = object[widget.field][scaleObj];
              hasScale = true;
            }
            output += '<div class="entrylabel c_entrylabel_pos w100">' + scaleObj + '</div><span ' +  (hasScale ? "" : 'style="display:none"') + '>';
            output += ' <input class="auth_xy" ';
            output += buildFnString('window.author.updateItem', [object.id, 'scale.'+scaleObj], true);
            output += 'type="number" value=' +tempScale + ' />';
            if (scaleObj !== 'current')  output += buildDiv('divbutton', 'Disable', 'window.author.reload', []);
            output += '</span>'
            if (!hasScale) output += buildDiv('divbutton', 'Enable', 'window.author.createScale', [object.id, 'destination']);
            output += '<br>';
          }
        }
        output += '</div></div>';
      }
      if (widget.type === "actions"){
          var actionsList = [];
          window.rules.actions.forEach(function(template){actionsList.push(template.type)});
          output += '<div><div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
          if (object[widget.field] !== undefined){
            object[widget.field].forEach(function(actobject, idx){
              var actionWidgets = window.rules.actions.filter(function(type){ return type.type === actobject.type})[0].widgets;
              output += '<div class="actionspacer"></div><div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
              console.log(object.id, actionsList, actobject.type, actobject.type, widget.field, idx)
              output += buildSelect('window.author.updateActionList',  object.id, actionsList, actobject.type, widget.field+'.'+idx+'.type') + '<br>';

              actionWidgets.forEach(function(subWidget, idxPart){
                var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
                if (subWidget.type === "text")    output += handleText(object, subWidget, widgetPath);
                if (subWidget.type === 'bool')    output += handleBoolean(object, subWidget, widgetPath);
                if (subWidget.type === 'select')  output += handleSelect(object, subWidget, widgetPath);
                if (subWidget.type === 'objlist') output += handleObjectList(object, subWidget, widgetPath);

              });

            });
            output += '<br>';
          }
          output += buildDiv('divbutton', 'Add Action', 'window.author.addaction', [object.id, widget.field]);
          output += '</div>';
      }
    });
    output += " " + object;
    return output;
  }

  function buildFnString(fn, params, change){
    var str = (change ? 'onchange=' : '') + '"' + fn + '(this';
    params.forEach(function(pName){
      str += ", '" + pName + "'";
    });
    return str + ')" ';
  }

  function outText(label, value, cmd){
    '<div class="entrylabel c_entrytitle_text w100">' + label + '</div><input class="auth_text" type="text" value="'+ value +'"><br>';
    return output;
  }

  function ObjPartToArr(obj, part){
    var out = [];
    for(var prop in obj){
      out.push(obj[prop][part]);
    }
    return out;
  }

  function buildDiv(classes, content, clicker, params){
    var click = ''
    if (clicker !== undefined) {
      click = ' onclick="' + clicker + '(';
      params.forEach(function(param, index){
        click += "'" +  param + "'";
        if (index < params.length-1) click +=',';
      });
      click += ') ";'
    }
    return '<div class="' + classes + '"' + click + '>' + content + '</div>';
  }

  function buildSelect(fn, object, list, defaultId, path){
    var out = '<select class="sellist"';
    out += buildFnString(fn, [object, path], true) + '>';
    var newList = list.slice();
    newList.unshift("---NONE---");
    newList.forEach(function(listObject){
      out += '<option value="'+ listObject + '"'+ (listObject === defaultId ? " selected" : "" )+ '>' + listObject + '</option>';
    });
    out += "</select>";
    return out;
  }

  this.createPosXY = function(objectId, paramPath){
    var objGet = authorData.objects.filter(function(finder){return (finder.id === objectId);})[0];
    this.createItem("0", objectId, 'position.'+paramPath+'.x');
    this.createItem("0", objectId, 'position.'+paramPath+'.y');
    getProps("objects",objGet.id);
  };

  this.createScale = function(objectId, paramPath){
    var objGet = authorData.objects.filter(function(finder){return (finder.id === objectId);})[0];
    this.createItem("1", objectId, 'scale.'+paramPath);
    getProps("objects",objGet.id);
  };

  this.createItem = function(newVal, objectId, paramPath){
    var objGet = authorData.objects.filter(function(finder){return (finder.id === objectId);})[0];
    setSubProp(objGet, paramPath, newVal);
    initCanvasser("sample", JSON.stringify(authorData), "string");
  };

  this.updateItem = function(domElement, objectId, paramPath){
    var newVal = domElement.value.toString();
    if (domElement.type === 'checkbox') newVal = domElement.checked;
    if (newVal === '---NONE---') newVal = undefined;
    var objGet = authorData.objects.filter(function(finder){return (finder.id === objectId);})[0];
    setSubProp(objGet, paramPath, newVal);
    getProps("objects",objGet.id);
    updateObjects();
    initCanvasser("sample", JSON.stringify(authorData), "string");
  };

  this.updateSelect = function(domElement, objectId, positionId, axisId){
    var objGet = authorData[type].filter(function(finder){return (finder.id === id);})[0];

    var newRule = window.rules.actions.filter(function(ruleName){console.log(ruleName.elementType, domElement.value); return ruleName.elementType === domElement.value})[0];
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
    if (type === 'objects') updateObjects();
    if (type === 'images') updateImages();
    getProps(type, id);
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }

  this.updateActionList = function(domElement, objectId, paramPath){
    var objGet = authorData.objects.filter(function(finder){return (finder.id === objectId);})[0];
    var prop = getSubProp(objGet, paramPath);
    this.updateItem(domElement, objectId, paramPath)
    var newRule = window.rules.actions.filter(function(ruleName){console.log(ruleName.elementType, domElement.value); return ruleName.elementType === domElement.value})[0];

    // newRule.widgets.forEach(function(rule){
    //   var keys = Object.keys(rule);
    //   keys.forEach(function(key){
    //     objGet[prop][listIndex][key] = rule[key];
    //   });
    // });

    updateObjects();
    getProps('objects', objectId);
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }


  this.updateActivity = function(domElement, type, elementType, id, prop, listIndex){
    var objGet = authorData[type].filter(function(finder){return (finder.id === id);})[0];

    var newRule = window.rules.actions.filter(function(ruleName){console.log(ruleName.elementType, domElement.value); return ruleName.elementType === domElement.value})[0];
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
    if (type === 'objects') updateObjects();
    if (type === 'images') updateImages();
    getProps(type, id);
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }

  this.addaction = function(objName, listType){
    var objGet = authorData.objects.filter(function(finder){return (finder.id === objName);});
    if (objGet.length === 0) return;
    objGet[0][listType].push({"type":"cleardown"});
    getProps("objects",objGet[0].id);
  }

  function setSubProp(obj, desc, val){
    var arr = desc.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj[arr[0]] = (typeof(val) === "boolean" ? val : (isNaN(val) ? val : (val.indexOf(".")==-1)? parseInt(val) : parseFloat(val)));
  }

  function getSubProp(obj, desc){
    var arr = desc.split(".");
    while(arr.length > 1){
      var isnum = /^\d+$/.test(arr[0]);
      if (isnum) arr[0] = parseInt(arr[0]);
      obj = obj[arr[0]];
      if (obj === undefined) return undefined;
      arr.shift();
    }
    return obj[arr[0]];
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
