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
      output += '<input class="auth_text w400" type="text" value="'+ image[widget.field];
      output += '" onchange="window.author.updateActivity(this,' + "'images', 'text', '" + image.id  + '\', \''+widget.field+'\', \'none\')"><br>';
    });
    updateImages();
    return output;
  }

  function buildPropUIObject(output, element){
    var win = 'window.author.updateActivity';
    window.rules.object[element.type].widgets.forEach(function(widget, idx, source){
      if (widget.type === "text") {
        output += '<div class="entrylabel c_entrytitle_text w100">' + widget.field + '</div>';
        output += '<input class="auth_text" type="text" value="'+ element[widget.field] + '" ';
        output += 'onchange=window.author.updateActivity(this,\'objects\',\'text\',';
        output +=  "'"+ element.id + "','" + widget.field + "',";
        output +=  "'none')";
        output +=   '>'  + "<br>";
      }
      if (widget.type === "arraystrings") output += '<div class="entrylabel c_entrytitle_text w100">' + widget.field + '</div><input class="auth_text" type="text" value="'+ element[widget.field]+'"><br>';

      if (widget.type === "bool") output += '<div class="entrylabel c_entrytitle_text w100">' + widget.field + '</div><input class="checkbox" type="checkbox" ' + (element[widget.field] ? "checked" : "") + ' onchange="'+win+'(this, \''+ widget.type + '\', \'' + element.id   + '\', \''+ widget.field + '\', \'checked\')"><br>';
      if (widget.type === "imagedata"){
        var imageList = ObjPartToArr(authorData.images, "id");
        output += '<div class="entrylabel c_entrytitle_text w100">' + widget.field + '</div>' +  buildSelect(imageList, widget.type, element[widget.field], element.id, widget.field) + '<br>';
      }
      if (widget.type === "objectdata"){
        var objectList = ObjPartToArr(authorData.objects, "id");
        output += '<div class="entrylabel c_entrytitle_text w100">' + widget.field + '</div>' +  buildSelect(objectList, widget.type, getSubProp(element, widget.field), element.id, widget.field) + '<br>';
      }
      if (widget.type === "posxy"){
        output += '<div style="display:flex"><div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
        var hasDestination = false;
        var hasRate        = false;
        var hasOffset      = false;
        for(var posObj in element[widget.field]){
          if (posObj === "destination") hasDestination = true;
          if (posObj === "offset")      hasOffset      = true;
          if (posObj === "rate")        hasRate        = true;
        }
        if (element.parent !== undefined && !hasOffset) element[widget.field].offset = element[widget.field].current;
        if (!hasDestination) element[widget.field].destination = undefined;
        if (!hasRate) element[widget.field].rate = 0;

        for(var posObj in element[widget.field]){
          if (posObj === "rate"){
            var tempPos =  (element[widget.field][posObj] !== undefined ? tempPos = element[widget.field][posObj] : 0);
            output += '<div class="entrylabel c_entrylabel_pos w50">' + posObj + '</div><input class="auth_xy" onchange="'+win+'(this, \''+ element.id + '\', \'' + 'position.'+posObj+ '\', \''+ widget.type + '\', \'value\')" id="numx" type="number" value=' + tempPos + ' />' + '<br>';
          }else{
            var tempPos = {x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)};
            var hasXY = false;
            var enable = true;
            if (element[widget.field][posObj] !== undefined){
              tempPos = element[widget.field][posObj];
              hasXY = true;
              enable = false;
            }
            if (posObj === "current" && element.parent !== undefined) {hasXY = false; enable=false;}
            output += '<div class="entrylabel c_entrylabel_pos w100">' + posObj + '</div><span ' +  (hasXY ? "" : 'style="display:none"') + '>';
            output += ' <span class="entrytitle c_entrylabel_pos">X</span> <input class="auth_xy"  onchange="'+win+'(this, \''+ element.id + '\', \'' + 'position.'+posObj+'.x' + '\', \''+ widget.type + '\', \'value\')" type="number" value=' + tempPos.x + ' />';
            output += ' <span class="entrytitle c_entrylabel_pos">Y</span> <input class="auth_xy"  onchange="'+win+'(this, \''+ element.id + '\', \'' + 'position.'+posObj+'.y' + '\', \''+ widget.type + '\', \'value\')" type="number" value=' + tempPos.y + ' /> ';
            if (posObj !== 'current' && posObj !== 'offset')  output += '<div class ="divbutton" onclick="window.author.reload()">Disable</div>'
            output += '</span>'
            if (enable) output += '<div class ="divbutton" onclick="window.author.reload()">Enable</div>'
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
        for(var scaleObj in element[widget.field]){
          if (scaleObj === "destination") hasDestination = true;
          if (scaleObj === "rate") hasRate               = true;
        }
        if (!hasDestination) element[widget.field].destination = undefined;
        if (!hasRate) element[widget.field].rate = 0;

        for (var scaleObj in element[widget.field]){
          if (scaleObj === "rate"){
            var tempScale = (element[widget.field][scaleObj] !== undefined ? tempScale = element[widget.field][scaleObj] : 0);
            output += '<div class="entrylabel c_entrylabel_pos w50">' + scaleObj + '</div><input class="auth_xy" onchange="'+win+'(this, \''+ element.id + '\', \'' + 'position.'+scaleObj+ '\', \''+ widget.type + '\', \'value\')" id="numx" type="number" value=' + tempScale + ' />' + '<br>';
          }else{
            var tempScale = 1;
            var hasScale = false;
            if (element[widget.field][scaleObj] !== undefined){
              tempScale = element[widget.field][scaleObj];
              hasScale = true;
            }
            output += '<div class="entrylabel c_entrylabel_pos w100">' + scaleObj + '</div><span ' +  (hasScale ? "" : 'style="display:none"') + '>';
            output += ' <input class="auth_xy"  onchange="'+win+'(this, \''+ element.id + '\', \'' + 'scale.'+scaleObj + '\', \''+ widget.type + '\', \'value\')" type="number" step="any" value=' + tempScale + ' />';
            if (scaleObj !== 'current')  output += '<div class ="divbutton" onclick="window.author.reload()">Disable</div>'
            output += '</span>'
            if (!hasScale) output += '<div class ="divbutton" onclick="window.author.reload()">Enable</div>'
            output += '<br>';
          }
        }
        output += '</div></div>';
      }
      if (widget.type === "activitylist"){
          var actList = [];
          window.rules.actions.forEach(function(template){actList.push(template.type)});
          output += '<div><div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
          if (element[widget.field] !== undefined){
            element[widget.field].forEach(function(actElement, idx){
              output += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>' +  buildSelect(actList, widget.type, actElement.type, element.id, widget.field, idx) + '<br>';
              for(var actObj in actElement){
                  if (actObj === "type") continue;
                  output += '<div class="entrylabel c_entrylabel_pos w100">' + actObj + '</div>';
                  output += '<input class="auth_text" type="text" value="'+ actElement[actObj]+'" onchange="'+win+'(this, \''+ element.id + '\', \'' + widget.field + '\',\'' + idx + '\',\'' + actObj + '\', \''+ widget.type + '\', \'value\')"><br>';
              }
            });
            output += '<br>';
          }
          output += '<div class ="divbutton" onclick="window.author.addaction(\''+element.id+'\',\''+widget.field+'\')">Add Action</div>'
          output += '</div>';
      }
    });
    output += " " + element;
    return output;
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

  function buildSelect(list, type, defaultId, element, prop, idx){
    var out = '<select class="sellist" onchange="window.author.updateActivity(this, \''+ type  + '\', \'' +  element + '\', \''+ prop + '\', \''+ idx +'\')">';
    list.unshift("---NONE---");
    list.forEach(function(listElement){
      out += '<option value="'+ listElement + '"'+ (listElement === defaultId ? " selected" : "" )+ '>' + listElement + '</option>';
    });
    out += "</select>";
    return out;
  }

  this.updateActivity = function(domElement, type, elementType, id, prop, listIndex){
    console.log(authorData)
    console.log(id)
    var objGet = authorData[type].filter(function(finder){return (finder.id === id);})[0];
    console.log(objGet)
    var newRule = window.rules.actions.filter(function(ruleName){ return ruleName.elementType === domElement.value})[0];
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
