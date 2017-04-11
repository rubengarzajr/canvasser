function initAuthorCanvasser(vari, datafile, dataForm){
    window.author = new authorcanvasser(datafile, dataForm);
}

function authorcanvasser(dataFile, dataForm){
    requestJSON("./json/author.json", initrules);

    var UIdata = {
        mousedown: false,
        moveElement: null,
        mousePos: {x:0,y:0},
        offset: {x:0,y:0},
        zidx: 25
    };

    authorData = {
    "objects":[
{"type":"image","show":true,"group":["images"],"name":"bkimg","image":"backgr","scale":{"current":1},"position":{"current":{"x":360,"y":350}},"origin":"center","testp":true,"clicklist":[]},
{"type":"image","show":true,"group":["bones"],"name":"d1","image":"d1","scale":{"current":1,"rate":0},"position":{"current":{"x":155,"y":30},"rate":0},"testp":true,"draglist":[
{"type":"slideobject","name":"d1"}],"clicklist":[]},
{"type":"image","show":true,"group":["bones"],"name":"b30","image":"c1","scale":{"current":1},"position":{"current":{"x":20,"y":20}}, "testp":true,"draglist":[
{"type":"slideobject","name":"b30"}],"clicklist":[{"type":"cleardown"},{"type":"vis","filter":"group","name":"images","show":false}]},
{"type":"image","show":true,"group":["bones"],"name":"b31","image":"c2","scale":{"current":1},"position":{"current":{"x":20,"y":75}},"testp":true,"draglist":[
{"type":"slideobject","name":"b31"}],"clicklist":[{"type":"cleardown"},{"type":"vis","filter":"group","name":"images","show":true}]},
{"type":"shape","show":true,"group":["drag"],"name":"bk","shape":"sq","scale":{"current":1},"position":{"current":{"x":40,"y":40}},"parent":{},"color":["rgba(250,250,250,0)"],"defaultcolor":["rgba(250,250,250,0)"],"selectcolor":["rgba(250,250,250,1)"],"testp":true,"draglist":[
{"type":"slideobject","name":"bkimg"}],"clicklist":[]}],
"images":[
    {"id":"backgr",  "url":"./sample/image/sample/background_400px.png"},
    {"id":"c1",      "url":"./sample/image/sample/sample_click_1.png"},
    {"id":"c2",      "url":"./sample/image/sample/sample_click_2.png"},
    {"id":"c3",      "url":"./sample/image/sample/sample_click_3.png"},
    {"id":"d1",      "url":"./sample/image/sample/sample_drag_1.png"}
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
}


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
  var rules = null;
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
      // var pasteData = document.getElementById("paste").value;
      // authorData = JSON.parse(pasteData);
      // //document.getElementById("paste").value = JSON.stringify(authorData, null, 4);
      // updateImages();
      // updateObjects();
      // initCanvasser("sample", pasteData, 'file');
    }
    this.view = function(){
        //document.getElementById("paste").value = JSON.stringify(authorData, null, 4);
        document.getElementById("paste").value = JSON.stringify(authorData);
    }
    this.paste = function(){
        var pasteData = document.getElementById("paste").value;
        authorData = JSON.parse(pasteData);
        //document.getElementById("paste").value = JSON.stringify(authorData, null, 4);
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

    function requestJSON(fileNamePath, returnFunction)
    {
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

    function updateObjects(){
        var objectHolder = document.getElementById("objectholder");
        var objects = '<table class="objtable" width="100%">';
        authorData.objects.forEach(function(object){
            objects += '<tr class="clicktr" id="'+object.name+'" onclick="window.author.getPropsObject(\'objects\',\''+ object.name + '\')">';
            objects +='<td width="50%">' + object.name + '</td>';
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
            images += '<tr class="clicktr" id="'+image.id+'" onclick="window.author.getPropsImages(\'images\',\''+ image.id + '\')">'
            images +='<td class="imageid"><div class="imagetext">' + image.id + '</div></td>';
            images +='<td width="50%"><img src="' + image.url + '" alt="' + image.id + '"></td>';
            images += '</tr>';
        });
        images +='</table>';
        imageHolder.innerHTML = images;
    }

    this.addObject = function(){
        authorData.objects.push({name:"wee", type:"image",  show:true, position:{current:{x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)}}, scale:{current:1}});
        updateObjects();
        initCanvasser("sample", JSON.stringify(authorData), "string");
    }

  this.getPropsObject = getPropsObject;
  function getPropsObject(type, name){
    authorData[type].forEach(function(selectedObj){
      if (selectedObj.name === name) {
        document.getElementById("propertiestitle").innerHTML ='<div class="proptitle">' + name + " : " + selectedObj.type + '</div>';
        var propUI = document.getElementById("properties");
        var prop = '<div class="propbody">' ;
        prop       = buildPropUI(prop, type, selectedObj);
        propUI.innerHTML = prop + '</div>';
      }
    });
  }

  this.getPropsImages = getPropsImages;
  function getPropsImages(type, id){
    authorData[type].forEach(function(selectedImg){
      if (selectedImg.id === id) {
        console.log(selectedImg)
        document.getElementById("propertiestitle").innerHTML ='<div class="proptitle">' + id + " : " + selectedImg.url + '</div>';
        var propUI = document.getElementById("properties");
        var prop = '<div class="propbody">' ;
        prop       = buildPropUIimage(prop, selectedImg);
        propUI.innerHTML = prop + '</div>';
      }
    });
  }

    function buildPropUIimage(output, element){
      var win = 'window.author.updateActivity';

      output += '<div class="entrylabel c_entrytitle_text w50">URL</div><input class="auth_text w400" type="text" value="'+ element.url +'" onchange="'+win+'(this, \''+ element.id + '\', \'' + "url" + '\', \''+ "url" + '\', \'value\')"><br>';

      return output;
    }

    function buildPropUI(output, type, element){
        var win = 'window.author.updateActivity';
        for(var prop in rules.object[element.type].widgets){
            pType = rules.object[element.type].widgets[prop];

            if (pType === "text") output += '<div class="entrylabel c_entrytitle_text w100">' + prop + '</div><input class="auth_text" type="text" value="'+ getSubProp(element, prop) +'" onchange="'+win+'(this, \''+ element.name + '\', \'' + prop + '\', \''+ type + '\', \'value\')"><br>';
            if (pType === "arraystrings") output += '<div class="entrylabel c_entrytitle_text w100">' + prop + '</div><input class="auth_text" type="text" value="'+ element[prop]+'"><br>';

            if (pType === "bool") output += '<div class="entrylabel c_entrytitle_text w100">' + prop + '</div><input class="checkbox" type="checkbox" ' + (element[prop] ? "checked" : "") + ' onchange="'+win+'(this, \''+ element.name + '\', \'' + prop + '\', \''+ type + '\', \'checked\')"><br>';
            if (pType === "imagedata"){
                var imageList = ObjPartToArr(authorData.images, "id");
                output += '<div class="entrylabel c_entrytitle_text w100">' + prop + '</div>' +  buildSelect(imageList, type, element[prop], element.name, prop) + '<br>';
            }
            if (pType === "objectdata"){
                var objectList = ObjPartToArr(authorData.objects, "name");
                console.log("HEEEEE", objectList, type, element[prop], element.name, prop);
                console.log("SUB",getSubProp(element, prop));
                output += '<div class="entrylabel c_entrytitle_text w100">' + prop + '</div>' +  buildSelect(objectList, type, getSubProp(element, prop), element.name, prop) + '<br>';
            }
            if (pType === "posxy"){
                output += '<div style="display:flex"><div class="pos_holder"><div class="pos_title">' + prop + '</div>';
                var hasDestination = false;
                var hasRate        = false;
                var hasOffset      = false;
                for(var posObj in element[prop]){
                    if (posObj === "destination") hasDestination = true;
                    if (posObj === "offset")      hasOffset      = true;
                    if (posObj === "rate")        hasRate        = true;
                }
                if (element.parent !== undefined && !hasOffset) element[prop].offset = element[prop].current;
                if (!hasDestination) element[prop].destination = undefined;
                if (!hasRate) element[prop].rate = 0;

                for(var posObj in element[prop]){
                    if (posObj === "rate"){
                        var tempPos =  (element[prop][posObj] !== undefined ? tempPos = element[prop][posObj] : 0);
                        output += '<div class="entrylabel c_entrylabel_pos w50">' + posObj + '</div><input class="auth_xy" onchange="'+win+'(this, \''+ element.name + '\', \'' + 'position.'+posObj+ '\', \''+ type + '\', \'value\')" id="numx" type="number" value=' + tempPos + ' />' + '<br>';
                    }else{
                        var tempPos = {x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)};
                        var hasXY = false;
                        var enable = true;
                        if (element[prop][posObj] !== undefined){
                            tempPos = element[prop][posObj];
                            hasXY = true;
                            enable = false;
                        }
                        if (posObj === "current" && element.parent !== undefined) {hasXY = false; enable=false;}
                        output += '<div class="entrylabel c_entrylabel_pos w100">' + posObj + '</div><span ' +  (hasXY ? "" : 'style="display:none"') + '>';
                        output += ' <span class="entrytitle c_entrylabel_pos">X</span> <input class="auth_xy"  onchange="'+win+'(this, \''+ element.name + '\', \'' + 'position.'+posObj+'.x' + '\', \''+ type + '\', \'value\')" type="number" value=' + tempPos.x + ' />';
                        output += ' <span class="entrytitle c_entrylabel_pos">Y</span> <input class="auth_xy"  onchange="'+win+'(this, \''+ element.name + '\', \'' + 'position.'+posObj+'.y' + '\', \''+ type + '\', \'value\')" type="number" value=' + tempPos.y + ' /> ';
                        if (posObj !== 'current' && posObj !== 'offset')  output += '<div class ="divbutton" onclick="window.author.reload()">Disable</div>'
                        output += '</span>'
                        if (enable) output += '<div class ="divbutton" onclick="window.author.reload()">Enable</div>'
                        output += '<br>';
                    }
                }
                output += '<div class ="divbutton" onclick="window.author.reload()">Add position</div>'
                output += '</div>';
            }
            if (pType === "scale"){
                output += '<div class="pos_holder"><div class="pos_title">' + prop + '</div>';
                var hasDestination = false;
                var hasRate        = false;
                for(var scaleObj in element[prop]){
                    if (scaleObj === "destination") hasDestination = true;
                    if (scaleObj === "rate") hasRate               = true;
                }
                if (!hasDestination) element[prop].destination = undefined;
                if (!hasRate) element[prop].rate               = 0;

                for(var scaleObj in element[prop]){
                    if (scaleObj === "rate"){
                        var tempScale = (element[prop][scaleObj] !== undefined ? tempScale = element[prop][scaleObj] : 0);
                        output += '<div class="entrylabel c_entrylabel_pos w50">' + scaleObj + '</div><input class="auth_xy" onchange="'+win+'(this, \''+ element.name + '\', \'' + 'position.'+scaleObj+ '\', \''+ type + '\', \'value\')" id="numx" type="number" value=' + tempScale + ' />' + '<br>';
                    }else{
                        var tempScale = 1;
                        var hasScale = false;
                        if (element[prop][scaleObj] !== undefined){
                            tempScale = element[prop][scaleObj];
                            hasScale = true;
                        }
                        output += '<div class="entrylabel c_entrylabel_pos w100">' + scaleObj + '</div><span ' +  (hasScale ? "" : 'style="display:none"') + '>';
                        output += ' <input class="auth_xy"  onchange="'+win+'(this, \''+ element.name + '\', \'' + 'scale.'+scaleObj + '\', \''+ type + '\', \'value\')" type="number" step="any" value=' + tempScale + ' />';
                        if (scaleObj !== 'current')  output += '<div class ="divbutton" onclick="window.author.reload()">Disable</div>'
                        output += '</span>'
                        if (!hasScale) output += '<div class ="divbutton" onclick="window.author.reload()">Enable</div>'
                        output += '<br>';
                    }
                }
                output += '</div></div>';
            }
            if (pType === "activitylist"){
                var actList = [];
                rules.actions.forEach(function(template){actList.push(template.type)});
                output += '<div><div class="pos_holder"><div class="pos_title">' + prop + '</div>';
                if (element[prop] !== undefined){
                    element[prop].forEach(function(actElement, idx){
                        rules.actions.forEach(function(template){
                            if (template.type === actElement.type) console.log(template)
                        });
                        output += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>' +  buildSelect(actList, type, actElement.type, element.name, prop) + '<br>';

                        for(var actObj in actElement){
                            if (actObj === "type") continue;
                            output += '<div class="entrylabel c_entrylabel_pos w100">' + actObj + '</div>';
                            output += '<input class="auth_text" type="text" value="'+ actElement[actObj]+'" onchange="'+win+'(this, \''+ element.name + '\', \'' + prop + "." + idx + '.' + actObj + '\', \''+ type + '\', \'value\')"><br>';
                        }
                    });
                    output += '<br>';
                }
                output += '<div class ="divbutton" onclick="window.author.addaction(\''+prop+'\')">Add Action</div>'
                output += '</div>';
            }
        }
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

    function buildSelect(list, type, defaultId, element, prop){
        var out = '<select class="sellist" onchange="window.author.updateActivity(this, \''+ element + '\', \'' + prop + '\', \''+ type + '\', \'value\')">';
        console.log("HEY LOOK",list, type, defaultId, element, prop)
        list.unshift("---NONE---");
        list.forEach(function(listElement){
            out += '<option value="'+ listElement + '"'+ (listElement === defaultId ? " selected" : "" )+ '>' + listElement + '</option>';
           });
        out += "</select>";
        return out;
    }

    this.updateActivity = function(sel, element, prop, type, thingToCheck){
        var val = sel[thingToCheck];
        authorData[type].forEach(function(finder){
            if (finder.name === element) {
                setSubProp(finder, prop, val)
                updateObjects();
                getPropsObject("objects",finder.name)
            }
        });
        initCanvasser("sample", JSON.stringify(authorData), "string");
    }

    this.addaction = function(list){
        console.log(list);
        console.log(rules.actions)

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
                console.log(get_type(arrayElement) + " " + arrayElement);
                output += printRecusiveObj(indnt, arrayElement, indent+1);
            });
            return output;
        }
        output += " " + element;
        console.log(indent + " " + element );
        return output;
    }

    function get_type(thing){
        if(thing===null)return "[object Null]"; // special case
        return Object.prototype.toString.call(thing);
    }


    function initrules(data){
        rules = data;
    }

    function init(data){
        act.canvas  = document.createElement('canvas');
        act.context = act.canvas.getContext('2d');
        act.canvas.width  = data.settings.canvaswidth;
        act.canvas.height = data.settings.canvasheight;
        act.data = data;
        document.getElementById(data.settings.canvasparent).appendChild(act.canvas);
        act.canvas.addEventListener('mousemove', getMousePos, false);
        act.canvas.addEventListener('click', getClickPos, false);

        act.data.images.forEach(function(image){
            var imageObj = new Image();
            imageObj.onload = function() {
              act.imageList[image.id] = this;
            };

        imageObj.src = image.url;
        });


    }
}
