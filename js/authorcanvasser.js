function initAuthorCanvasser(vari, datafile, dataForm){
    window.author = new authorcanvasser(datafile, dataForm);
}

function authorcanvasser(dataFile, dataForm){

    //requestJSON("data/author.json", initrules);

    var authorData = {
        "objects":[
            {"type":"image", "show":true, "group":["images","shiny"], "name":"test",  "image":"p",     "scale":{"current":1}, "position":{"current":{"x": 360,"y": 350}}, "origin":"center",  "testp":true, "clicklist":[{"type":"console","text":"hi"}]},
            {"type":"image", "show":true, "group":["images"],         "name":"minus", "image":"minus", "scale":{"current":1}, "position":{"current":{"x": 160,"y": 150}}, "origin":"center",  "testp":true, "clicklist":[{"type":"console","text":"hi"}]}
        ],
        images:[
            {id:"p",  url:"image/particle.png"},
            {id:"texas",  url:"image/tx-map-rough.png"},
            {id:"minus",  url:"image/icon_minus.png"},
            {id:"plus",  url:"image/icon_plus.png"},
            {id:"up",  url:"image/icon_up.png"},
            {id:"down",  url:"image/icon_down.png"},
            {id:"left",  url:"image/icon_left.png"},
            {id:"right",  url:"image/icon_right.png"},
            {id:"lsp",  url:"image/lsp.png"}
        ],
        settings: {
		canvaswidth: 720,
		canvasheight: 700,
		canvasdomname: "activity",
                canvasparent: "canvasholder"
            }
        };
    initCanvasser("sample", authorData, "data");
    updateObjects();
    updateImages();
    var rules = null;

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
            objects += '<tr onclick="window.author.getProps(\'objects\',\''+ object.name +'\')">';
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
                var propHolder = document.getElementById("properties");
                var prop = '<div class="proptitle">' + name + '</div>';
                prop = printRecusiveObj(prop, finder, 0)
                propHolder.innerHTML = prop;
            }
        });
    }

    function printRecusiveObj(output, obj, indent){
        for(var prop in obj){
            var indnt = "<br>";
            for (var i = 0; i < indent; i++){
                indnt +="&nbsp;&nbsp;&nbsp;"
            }
            if (get_type(obj[prop]) === "[object Object]"){
                var tmp = prop;
                output += indnt + printRecusiveObj(tmp, obj[prop], indent+1);
            }
            else output += indnt + prop + ': ' + obj[prop];
        }
        return output;
    }


    function get_type(thing){
        if(thing===null)return "[object Null]"; // special case
        return Object.prototype.toString.call(thing);
    }


    function initrules(data){
        rules = data;
        var authorSpace = document.getElementById("authorspace");
        data.createtypes.forEach(function(type){
            authorSpace.innerHTML += "<br>" + type + "<br>";
            rules[type].forEach(function(subtype){
                authorSpace.innerHTML += "<br>Type: " + subtype.type + "<br>";
                authorSpace.innerHTML += "Widgets:<br>";
                for(var index in subtype.widgets) {
                    //authorSpace.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;" + index + " " + subtype.widgets[index] + "<br>";
                    if (subtype.widgets[index] === "text") authorSpace.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;" + index + '&nbsp;&nbsp;<input type="text" id="testing"><br>';
                    if (subtype.widgets[index] === "bool") authorSpace.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;" + index + '&nbsp;&nbsp;<input type="checkbox" id="testing"><br>';
                    if (subtype.widgets[index] === "int")  authorSpace.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;" + index + '&nbsp;&nbsp;<input type="number" id="testing" step="1"><br>';
                    if (subtype.widgets[index] === "xy")   authorSpace.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;" + index + '&nbsp;&nbsp;X&nbsp;<input type="number" id="testingx" step="1" maxlength="4">&nbsp;Y&nbsp;<input type="number" id="testingy" step="1" maxlength="4"><br>';
                }
                if (subtype.widgetbank !== undefined)
                {
                    authorSpace.innerHTML += "Widget Bank:<br>";
                    subtype.widgetbank.forEach(function(bank){
                        authorSpace.innerHTML += "&nbsp;&nbsp;" + bank + "<br>";
                        for(var index in rules[bank]) {
                            authorSpace.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + rules[bank][index].type +  "<br>";
                        }
                    });
                }
            });
            authorSpace.innerHTML += "<br>";
        });
        console.log(rules);
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