function authorcanvasser(dataFile){

    requestJSON("data/author.json", initrules);

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