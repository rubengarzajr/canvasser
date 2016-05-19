//TODO: Check is mouse down when exits cause right now it keeps moving once you get back in


function initCanvasser(vari, datafile){
    window[vari] = new canvasser(datafile);
}


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
        act.canvas.addEventListener('mousedown', mouseDown, false);
        act.canvas.addEventListener('mouseup', mouseUp, false);
        act.canvas.addEventListener('mouseleave', mouseLeave, false);
        act.canvas.addEventListener('onmouseenter', mouseEnter, false);

        act.data.images.forEach(function(image){
            var imageObj = new Image();
            imageObj.onload = function() {
                act.imageList[image.id] = {};
                act.imageList[image.id].imageData = this;
                act.imageList[image.id].canvas = document.createElement('canvas');
                act.imageList[image.id].canvas.width = this.width;
                act.imageList[image.id].canvas.height = this.height;
                act.imageList[image.id].context = act.imageList[image.id].canvas.getContext('2d');
                act.imageList[image.id].context.drawImage(this, 0, 0, this.width, this.height);
            };

        imageObj.src = image.url;
        });

        loop();
    }

    function interaction(){
        this.position     = {x:0, y:0};
        this.prevPosition = {x:0, y:0};
        this.canvas       = null;
        this.context      = null;
        this.currentTime  = null;
        this.data         = null;
        this.previousTime = null;
        this.canvasSize   = {x:0, y:0};
        this.curveList    = [];
        this.imageList    = [];
        this.mouseOver    = [];
        this.mouseDown    = false;
        this.mouseDownCnt = 0;
        this.clickLeft    = false;
        this.external     = false;
        this.mode         = "none";
    }

    this.external = function(cList){
        act.external = true;
        cList.forEach(function(cmd){
            if (cmd.command === "selectonly"){
                    act.mouseOver = []
                    act.data.objects.forEach(function(obj){
                    if (obj.name === cmd.item) act.mouseOver.push(obj);
                });
            }
        });
        actions();
    }

    function loop(){
        console.log(act.mode +  act.mouseDownCnt);
        if (act.mouseDown){
            act.mouseDownCnt ++;
            if (act.position.x !== act.prevPosition.x && act.position.y !== act.prevPosition.y && act.mouseDownCnt > 2) act.mode = "drag";
            actions();
        }
        act.context.clearRect(0,0,act.canvas.width,act.canvas.height);
        act.context.fillStyle    = "white";
        act.context.fillRect(0,0,act.canvas.width,act.canvas.height);
        if (!act.external) act.mouseOver = [];

        act.data.objects.forEach(function(obj){
            // TODO: Add in fudge so null scale destination
            if (obj.scale.destination != null){
                if (obj.scale.current > obj.scale.destination){
                    obj.scale.current -= obj.scale.rate;
                }
                if (obj.scale.current < obj.scale.destination){
                    obj.scale.current += obj.scale.rate;
                }
                if (obj.scale.current <= 0) obj.scale.current = 0.1
            }
            if (!obj.show) return;
            if (obj.type === "shape"){
                if (obj.parent !== undefined){
                    if (obj.parent.update){
                        act.data.objects.forEach(function(parent){
                            if (parent.name !== obj.parent.name) return;
                            obj.parent.object = parent;
                            obj.parent.update = false;
                        });
                    }
                }
                var posCheck = drawShapes(act, obj.parent.object, obj.position, act.data.shapes[obj.shape], obj.color, obj.testp, act.position, obj.scale.current);
                if (!obj.testp) return;
                if (posCheck) act.mouseOver.push(obj);
            }
            if (obj.type === "image"){
                if (act.imageList[obj.image] === undefined) return;
                var pos = {"x":obj.position.x, "y":obj.position.y};
                if (obj.origin === "center") pos={"x":parseInt(pos.x-act.imageList[obj.image].imageData.naturalWidth/2*obj.scale.current), "y":parseInt(pos.y-act.imageList[obj.image].imageData.naturalHeight/2*obj.scale.current)};
                act.context.drawImage(act.imageList[obj.image].imageData, pos.x, pos.y, act.imageList[obj.image].imageData.naturalWidth*obj.scale.current, act.imageList[obj.image].imageData.naturalHeight*obj.scale.current);
                if (!obj.testp) return;

                var pixelData_img = act.imageList[obj.image].context.getImageData(act.position.x-obj.position.x, act.position.y-obj.position.y, 1, 1).data;
		if (pixelData_img[3] != 0) act.mouseOver.push(obj);
            }
        });

        act.prevPosition = {x:act.position.x, y:act.position.y};
        window.requestAnimationFrame(loop);
    }

    function drawShapes(act, parent, pos, shapeData, color, doTest, testP, scale){
        var ctx = act.context;
        var test = false;
        var colorIndex = 0;
        var par = {"x":0,"y":0, "scale":1};
        if (parent !== undefined) {
            par = {"x":parent.position.x, "y":parent.position.y, "scale":parent.scale.current};
        }
        var origin = {
            "x":parseInt(pos.x * par.scale + par.x ),
            "y":parseInt(pos.y * par.scale + par.y )
        }
        var sizer = scale * par.scale;
        ctx.beginPath();
        shapeData.forEach(function(shape){
            if (shape.type === "move")      ctx.moveTo(origin.x+shape.offset.x*sizer, origin.y+shape.offset.y*sizer);
            if (shape.type === "rect")      ctx.rect(origin.x+shape.offset.x*sizer, origin.y+shape.offset.y*sizer, shape.width*sizer,shape.height*sizer);
            if (shape.type === "arc")       ctx.arc(origin.x+shape.offset.x*sizer, origin.y+shape.offset.y*sizer, shape.radius*sizer, shape.startangle, shape.endangle, shape.counterclockwise);
            if (shape.type === "bcurve")    ctx.bezierCurveTo(origin.x+shape.offseta.x*sizer, origin.y+shape.offseta.y*sizer, origin.x+shape.offsetb.x*sizer, origin.y+shape.offsetb.y*sizer, origin.x+shape.offsetc.x*sizer, origin.y+shape.offsetc.y*sizer);
            if (shape.type === "line")      ctx.lineTo(origin.x+shape.offset.x*sizer, origin.y+shape.offset.y*sizer);
            if (shape.type === "linewidth") ctx.lineWidth = shape.width*sizer;
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

    function mouseUp(){
        act.mode         = "none";
        act.mouseDown    = false;
        act.mouseDownCnt = 0;
    }

    function mouseEnter(){
        act.mode         = "none";
        act.mouseDown    = false;
        act.mouseDownCnt = 0;
    }


    function mouseLeave(){
        act.mode         = "none";
        act.mouseDown    = false;
        act.mouseDownCnt = 0;
    }

    function mouseDown(event){
        act.mode         = "click";
        act.external     = false;
        act.mouseDown    = true;
        act.mouseDownCnt = 0;
    }

    function actions(){
        act.mouseOver.forEach(function(over){
            console.log(act.mode+"list " + act.position.x + " " + act.position.y + " " + act.prevPosition.x+ " " + act.prevPosition.y);
            if (over[act.mode+"list"] === undefined) return;

            over[act.mode+"list"].forEach(function(action){
                if (action.type === 'console'){
                    console.log(action.text);
                }
                if (action.type === 'url'){
                    var target = document.getElementById(action.target);
                    if (target != undefined){
                        loadInto(action.url, target);
                    }
                }
                if (action.type === 'copyelement'){
                    var target = document.getElementById(action.target);
                    var source = document.getElementById(action.source);
                    if (target !== undefined && source !== undefined){
                        target.innerHTML = source.innerHTML;
                    }
                }
                if (action.type === "slideobject"){
                    act.data.objects.forEach(function(obj){
                        if (obj.name === undefined) return;
                        if (obj.name === action.name) {
                            obj.position.x += act.position.x - act.prevPosition.x;
                            obj.position.y += act.position.y - act.prevPosition.y
                        }
                    });
                }
                if (action.type === 'groupvis'){
                    act.data.objects.forEach(function(obj){
                        if (obj.group === undefined) return;
                        if (obj.group.indexOf(action.name) > -1) obj.show = action.show
                    });
                }
                if (action.type === 'groupcolor'){
                    act.data.objects.forEach(function(obj){
                        if (obj.group === undefined) return;
                        if (obj.group.indexOf(action.name) < 0) return;
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
                if (action.type === 'scalegroup'){
                    act.data.objects.forEach(function(obj){
                        if (obj.group === undefined) return;
                        if (obj.group.indexOf(action.name) < 0) return;
                        if (action.frame === "increment") obj.scale.current += action.amount;
                        if (action.frame === "multiply"){
                            obj.scale.current = obj.scale.current * action.amount;
                        }
                        if (action.frame === "absolute")  obj.scale.current =  action.amount;
                    });
                }
                if (action.type === 'scaleobject'){
                    act.data.objects.forEach(function(obj){
                        if (obj.name === undefined) return;
                        if (obj.name !== action.name) return;
                        if (action.frame === "increment") obj.scale.current += action.amount;
                        if (action.frame === "multiply"){
                            obj.scale.current = obj.scale.current * action.amount;
                        }
                        if (action.frame === "absolute")  obj.scale.current =  action.amount;
                    });
                }
                if (action.type === 'moveobject'){
                    act.data.objects.forEach(function(obj){
                        if (obj.name === undefined) return;
                        if (obj.name !== action.name) return;
                        if (action.frame === "absolute") obj.position = action.amount.slice();
                        if (action.frame === "relative"){
                            obj.position.x += action.amount.x;
                            obj.position.y += action.amount.y;
                        }
                    });
                }
            });
        });
    }


    function loadInto(url, place){
        function reqListener () {
            place.innerHTML = this.responseText;
        }

        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("GET", url);
        oReq.send();
    }
}

