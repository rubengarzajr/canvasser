function canvasser(dataFile){
    requestJSON(dataFile, init);
    var act = new interaction();

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

    function interaction(){
        this.position     = {x:0, y:0};
        this.canvas       = null;
        this.context      = null;
        this.currentTime  = null;
        this.data         = null;
        this.previousTime = null;
        this.canvasSize   = {x:0, y:0};
        this.curveList    = [];
        this.imageList    = [];
        this.mouseOver    = [];
    }

    function loop(){
        act.context.clearRect(0,0,act.canvas.width,act.canvas.height);
        act.context.fillStyle    = "white";
        act.context.fillRect(0,0,act.canvas.width,act.canvas.height);
        act.mouseOver = [];

        act.data.objects.forEach(function(obj){
            if (!obj.show) return;
            if (obj.type === "shape"){
                var posCheck = drawShapes(act.context, obj.position, act.data.shapes[obj.shape], obj.color, obj.testp, act.position);
                if (!obj.testp) return;
                if (posCheck) act.mouseOver.push(obj);
                
            }
            if (obj.type === "image"){
                if (act.imageList[obj.image] === undefined) return;
                if (obj.function === "none") act.context.drawImage(act.imageList[obj.image], obj.offsetx, obj.offsety);
                if (obj.function === "scale") act.context.drawImage(act.imageList[obj.image], obj.offsetx, obj.offsety, obj.width, obj.height);
            }
        });

        window.requestAnimationFrame(loop);
    }

    function drawShapes(ctx, origin, shapeData, color, doTest, testP){
        var test = false;
        var colorIndex = 0;
        ctx.beginPath();
        shapeData.forEach(function(shape){
            if (shape.type === "move") ctx.moveTo(origin.x+shape.offsetx, origin.y+shape.offsety);
            if (shape.type === "arc") ctx.arc(origin.x+shape.offsetx, origin.y+shape.offsety, shape.radius, shape.startangle, shape.endangle, shape.counterclockwise);
            if (shape.type === "bcurve") ctx.bezierCurveTo(origin.x+shape.offsetxa, origin.y+shape.offsetya, origin.x+shape.offsetxb, origin.y+shape.offsetyb,origin.x+shape.offsetxc, origin.y+shape.offsetyc);
            if (shape.type === "line") ctx.lineTo(origin.x+shape.offsetx, origin.y+shape.offsety);
            if (shape.type === "linewidth") ctx.lineWidth = shape.width;
            if (shape.type === "fillStyle") {
                if (color === null) ctx.fillStyle = shape.color;
                else ctx.fillStyle = color[colorIndex];
            }
            if (shape.type === "fill") ctx.fill();
            if (shape.type === "strokestyle"){
                if (color === null) ctx.strokeStyle = shape.color;
                else ctx.strokeStyle = color[colorIndex];
            }
            if (shape.type === "stroke") ctx.stroke();
            if (shape.type === "ptest" && doTest){
                if (ctx.isPointInPath(testP.x, testP.y)) test = true;
            }
            if (shape.type === "close") ctx.closePath();
            if (shape.type === "begin") {
                ctx.beginPath();
                colorIndex ++;
            }
        });
        ctx.closePath();
        return test;
   }

    function getMousePos(event) {
        var rect = act.canvas.getBoundingClientRect();
        act.position = {x:event.clientX-rect.left, y:event.clientY-rect.top};
    }

    function getClickPos(event){
        act.mouseOver.forEach(function(over){
            over.color = over.selectcolor;
            if (over.actionlist === undefined) return;
            console.log(over.name);
            over.actionlist.forEach(function(action){
                if (action.type === 'url'){
                    var target = document.getElementById(action.target);
                    if (target != undefined){
                        loadInto(action.url, target);
                    }
                }
                if (action.type === 'groupvis'){
                    act.data.objects.forEach(function(obj){
                        if (obj.group === undefined) return;
                        if (obj.group === action.name) obj.show = action.show
                    });
                }
                if (action.type === 'groupcolor'){
                    act.data.objects.forEach(function(obj){
                        if (obj.group === undefined) return;
                        if (obj.group !== action.name) return;
                        if (action.source === "default")     obj.color = obj.defaultcolor;
                        if (action.source === "hover")       obj.color = obj.hovercolor;
                        if (action.source === "selectcolor") obj.color = obj.selectcolor;
                        if (action.source === "value")       obj.color = action.color;
                    });
                }
                if (action.type === 'objectvis'){
                    act.data.objects.forEach(function(obj){
                        if (obj.name === undefined) return;
                        if (obj.name === action.name) obj.show = action.show
                    });
                }
                if (action.type === 'objectcolor'){
                    act.data.objects.forEach(function(obj){
                        if (obj.name === undefined) return;
                        if (obj.name !== action.name) return;
                        if (action.source === "default")     obj.color = obj.defaultcolor;
                        if (action.source === "hover")       obj.color = obj.hovercolor;
                        if (action.source === "selectcolor") obj.color = obj.selectcolor;
                        if (action.source === "value")       obj.color = action.color;
                    });
                }
            });
        });

    }

    function loadInto(url, place){
        function reqListener () {
            console.log(this.responseText);
            place.innerHTML = this.responseText;
        }

        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("GET", url);
        oReq.send();
    }
}

