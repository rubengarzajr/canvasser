function initAuthorCanvasser(vari, datafile, dataForm){
    window.author = new authorcanvasser(datafile, dataForm);
}

function authorcanvasser(dataFile, dataForm){

    requestJSON("data/author.json", initrules);

    var authorData = {
        objects:[
            {type:"image", show:true, group:["images","shiny"], name:"test",  image:"p",     scale:{current:1}, position:{current:{x: 200,y: 300}, destination:{x: 160,y: 150}, rate:4}, origin:"center",  testp:true, clicklist:[{type:"console",text:"hi"}]},
            {type:"image", show:true, group:["images"],         name:"minus", image:"minus", scale:{current:1}, position:{current:{x: 160,y: 150}}, origin:"center",  testp:true, "clicklist":[{type:"console",text:"hi"}]}
        ],
        images:[
            {id:"minus",  url:"image/icon_minus.png"},
            {id:"plus",  url:"image/icon_plus.png"},
            {id:"p",  url:"image/particle.png"},
            {id:"texas",  url:"image/tx-map-rough.png"},
            {id:"up",  url:"image/icon_up.png"},
            {id:"down",  url:"image/icon_down.png"},
            {id:"left",  url:"image/icon_left.png"},
            {id:"right",  url:"image/icon_right.png"},
            {id:"si01",  url:"image/si01.png"}
        ],
        settings: {
            canvaswidth: 400,
            canvasheight: 400,
            canvasdomname: "activity",
            canvasparent: "canvasholder"
        }
    };

    console.log(JSON.stringify(authorData))
    initCanvasser("sample", JSON.stringify(authorData), "string");
    updateObjects();
    updateImages();
    var rules = null;

    this.reload = function(){
        initCanvasser("sample", JSON.stringify(authorData), "string");
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
        var objects = '<table  width="100%">';
        authorData.objects.forEach(function(object){
            objects += '<tr onclick="window.author.getProps(\'objects\',\''+ object.name + '\')">';
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
            images += '<tr>';
            images +='<td class="imageid"><div class="imagetext">' + image.id + '</div></td>';
            images +='<td width="50%"><img src="' + image.url + '" alt="' + image.id + '"></td>';
            images += '</tr>';
        });
        images +='</table>';
        imageHolder.innerHTML = images;
    }

    this.getProps = function(type, name){
        authorData[type].forEach(function(finder){
            if (finder.name === name) {
                document.getElementById("propertiestitle").innerHTML ='<div class="proptitle">' + name + " : " + finder.type + '</div>';
                var propUI = document.getElementById("properties");
                var prop = '<div class="propbody">' ;
                prop       = buildPropUI(prop, type, finder, 0);
                propUI.innerHTML = prop + '</div>';
            }
        });
    }

    function buildPropUI(output, type, element, indent){
        var win = 'window.author.updateActivity';
        console.log("C2:", element.type, rules.object[element.type]);
        for(var prop in rules.object[element.type].widgets){
            pType = rules.object[element.type].widgets[prop];
            console.log("C3: " + prop + "  " + pType + "  " + element[prop])
            if (pType === "text") output += '<div class="entrylabel c_entrytitle_text w100">' + prop + '</div><input class="auth_text" type="text" value="'+ element[prop]+'"><br>';
            if (pType === "bool") output += '<div class="entrylabel c_entrytitle_text w100">' + prop + '</div><input type="checkbox" ' + (element[prop] ? "checked" : "") + ' onchange="'+win+'(this, \''+ element.name + '\', \'' + prop + '\', \''+ type + '\', \'checked\')"><br>';
            if (pType === "imagedata"){
                imageList = ObjPartToArr(authorData.images, "id");
                output += '<div class="entrylabel c_entrytitle_text w100">' + prop + '</div>' +  buildSelect(imageList, type, element[prop], element.name, prop) + '<br>';
            }
            if (pType === "xyobjects"){
                output += '<div class="pos_holder"><div class="pos_title">' + prop + '</div>';
                var hasDestination = false;
                var hasRate = false
                for(var posObj in element[prop]){
                    if (posObj === "destination") hasDestination = true;
                    if (posObj === "rate") hasRate = true;
                }
                if (!hasDestination) element[prop].destination = undefined;
                if (!hasRate) element[prop].rate = 0;

                for(var posObj in element[prop]){
                    if (posObj === "rate"){
                        var tempPos =  (element[prop][posObj] !== undefined ? tempPos = element[prop][posObj] : 0);
                        output += '<div class="entrylabel c_entrylabel_pos w50">' + posObj + '</div><input class="auth_xy" onchange="'+win+'(this, \''+ element.name + '\', \'' + 'position.'+posObj+ '\', \''+ type + '\', \'value\')" id="numx" type="number" value=' + tempPos + ' />' + '<br>';
                    }else{
                        var tempPos = {x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)};
                        var hasXY = false;
                        if (element[prop][posObj] !== undefined){
                            tempPos = element[prop][posObj];
                            hasXY = true;
                        }
                        output += '<div class="entrylabel c_entrylabel_pos w100">' + posObj + '</div><span ' +  (hasXY ? "" : 'style="display:none"') + '>';
                        output += ' <span class="entrytitle c_entrylabel_pos">X</span> <input class="auth_xy"  onchange="'+win+'(this, \''+ element.name + '\', \'' + 'position.'+posObj+'.x' + '\', \''+ type + '\', \'value\')" id="numx" type="number" value=' + tempPos.x + ' />';
                        output += ' <span class="entrytitle c_entrylabel_pos">Y</span> <input class="auth_xy"  onchange="'+win+'(this, \''+ element.name + '\', \'' + 'position.'+posObj+'.y' + '\', \''+ type + '\', \'value\')" id="numx" type="number" value=' + tempPos.y + ' />';
                        if (posObj !== 'current')  output += '<div class ="divbutton" onclick="window.author.reload()">Disable</div>'
                        output += '</span>'
                        if (!hasXY) output += '<div class ="divbutton" onclick="window.author.reload()">Enable</div>'
                        output += '<br>';
                    }
                }

                output += '</div>';
            }
        }
        output += " " + element;
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
        var out = '<select onchange="window.author.updateActivity(this, \''+ element + '\', \'' + prop + '\', \''+ type + '\', \'value\')">';
        list.forEach(function(listElement){
            out += '<option value="'+ listElement + '"'+ (listElement === defaultId ? " selected" : "" )+ '>' + listElement + '</option>';
           });
        out += "</select>";
        return out;
    }

    this.updateActivity = function(sel, element, prop, type, thingToCheck){
        var val = sel[thingToCheck];
        console.log(val)
        authorData[type].forEach(function(finder){
            if (finder.name === element) {
                setSubProp(finder, prop, val)
            }
        });
        console.log(authorData);
        initCanvasser("sample", JSON.stringify(authorData), "string");
    }


    function setSubProp(obj, desc, val){
        console.log(val)
        console.log(isNaN(val))
        var arr = desc.split(".");
        while(arr.length > 1){
            if (obj[arr[0]] === undefined) {
                console.log(obj);
                console.log(arr);
                obj[arr[0]] = {};
            }
            obj = obj[arr.shift()];
        }
        obj[arr[0]] = (typeof(val) === "boolean" ? val : (isNaN(val) ? val : parseInt(val)));
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

        loop();
    }
}