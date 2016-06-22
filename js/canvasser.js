// Canvasser v0.2 rubengarzajr@gmail.com

function initCanvasser(vari, datafile, dataForm){
    window[vari] = new canvasser(datafile, dataForm);
}

function canvasser(interactiveData, dataForm){
    var act      = new interaction();
    var pManager = new particleManager();

    if (dataForm == "file") requestJSON(interactiveData, init);
    else init(interactiveData);

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
        document.getElementById(data.settings.canvasparent).innerHTML = "";
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

        act.vars = {};
        if (act.data.vars != undefined){
            act.data.vars.forEach(function(v){
               act.vars[v.name] = v.value;
            });
        }
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
        this.applyAction  = [];
        this.mouseDown    = false;
        this.mouseDownCnt = 0;
        this.clickLeft    = false;
        this.external     = false;
        this.mode         = "none";
        this.dragging     = null;
    }

    function particleManager(){
        var pSystemList = [];
        this.create = function(obj){
            var newPSystem                 = new pSystem();
            newPSystem.name                = obj.system.name;
            newPSystem.position            = obj.system.position;
            newPSystem.on                  = obj.system.on;
            newPSystem.image               = obj.system.image;
            newPSystem.emitCounter         = obj.system.emitCounter;
            newPSystem.emitRate            = obj.system.emitRate;
            newPSystem.pParams.life        = obj.particles.life;
            newPSystem.pParams.fadePercent = obj.particles.fadePercent;
            newPSystem.pParams.speed       = obj.particles.speed;
            newPSystem.pParams.scale       = obj.particles.scale;
            pSystemList.push(newPSystem);
        }
        function pSystem(){
            this.name         = "";
            this.position     = {current:{x:0,y:0}, destination:{x:0,y:0}};
            this.on           = false;
            this.emitCounter  = 0;
            this.emitRate     = 0;
            this.count        = 0;
            this.image        = null;
            this.forces       = [];
            this.pList        = [];
            this.pParams      ={life:{min:0,max:1},fadePercent:{in:5,out:95},scale:{min:1,max:1},speed:{position:{min:0, max:1 },rotation:{min:0,max:0}}};

            function pTemplate(){
                this.position     = {x:0,y:0};
                this.rotation     = 0;
                this.scale        = 1;
                this.dirNorm      = {x:0,y:0};
                this.speed        = {position:0, rotation:0};
                this.life         = 0;
            }

            this.createP = function(obj){
                var p = new pTemplate();
                p.position = obj.position;
                p.rotation = obj.rotation;
                p.scale    = obj.scale;
                p.dirNorm  = obj.dirNorm;
                p.speed    = obj.speed;
                p.life     = obj.life;
                this.pList.push(p);
            }
        }
            this.update = function(){
            pSystemList.forEach(function(pSystem){
                if (pSystem.emitCounter > 0){
                    pSystem.emitCounter --;
                    for (cnt =0; cnt < pSystem.emitRate; cnt ++){
                        var rndDir  = {x:randInterval(-0.5,0.5),y:randInterval(-0.5,0.5)};
                        var scale   = randInterval(pSystem.pParams.scale.min,pSystem.pParams.scale.max);
                        var rndLife = randIntervalInt(pSystem.pParams.life.min,pSystem.pParams.life.max);
                        var speed   = {position:randInterval(pSystem.pParams.speed.position.min,pSystem.pParams.speed.position.max),rotation:randInterval(pSystem.pParams.speed.rotation.min,pSystem.pParams.speed.rotation.max)}
                        var unit    = getUnit(rndDir);
                        pSystem.createP({position:pSystem.position.current, rotation:0,  dirNorm:unit, scale:scale, speed:speed, life:{max:rndLife, current:rndLife}});
                    }
                }

                var newVals                  = lerpTo(pSystem.position.current, pSystem.position.destination, pSystem.position.rate);
                pSystem.position.current     = newVals.newCurrent;
                pSystem.position.destination = newVals.newDestination;

                if (act.imageList[pSystem.image] !== undefined){
                    var imgDim = {x:act.imageList[pSystem.image].imageData.naturalWidth/2, y:act.imageList[pSystem.image].imageData.naturalHeight/2};
                    pSystem.pList.forEach(function(p){
                        p.life.current --;
                        if (p.life.current > 0){
                            p.position  = {x:p.position.x+p.dirNorm.x*p.speed.position, y: p.position.y+p.dirNorm.y*p.speed.position}
                            var scale   = p.scale;
                            var lifeCnt = p.life.max - p.life.current;
                            var pcent   = lifeCnt / p.life.max;

                            var alpha = 1;
                            if (pcent*100 < pSystem.pParams.fadePercent.in)  alpha = lifeCnt / (p.life.max*(pSystem.pParams.fadePercent.in*0.01));
                            if (pcent*100 > pSystem.pParams.fadePercent.out) alpha = p.life.current / (p.life.max - p.life.max*(pSystem.pParams.fadePercent.out*0.01));

                            var pos     = {"x":parseInt(p.position.x+imgDim.x), "y":parseInt(p.position.y+imgDim.y)};
                            p.rotation += p.speed.rotation;
                            act.context.save();
                            act.context.translate(pos.x, pos.y);
                            act.context.globalCompositeOperation = 'source-over';   // overlay source-over destination-over source-in destination-in source-out destination-out source-atop destination-atop lighter xor copy 
                            act.context.globalAlpha =  alpha;
                            act.context.rotate(p.rotation);
                            act.context.drawImage(act.imageList[pSystem.image].imageData, -imgDim.x*scale, -imgDim.y*scale, act.imageList[pSystem.image].imageData.naturalWidth*scale, act.imageList[pSystem.image].imageData.naturalHeight*scale);
                            act.context.restore();
                            act.context.globalAlpha = 1;
                            act.context.globalCompositeOperation = 'source-over';
                        }
                    });
                }
            });
        }
    }

    this.external = function(cList){
        act.external = true;
        cList.forEach(function(cmd){
            if (cmd.command === "selectonly"){
                    act.applyAction = [];
                    act.mode = "click";
                    act.data.objects.forEach(function(obj){
                    if (obj.name === cmd.item) act.applyAction.push(obj);
                });
            }
        });

        actions();
    }

    function loop(){
        if (act.mode === "true") act.mode = "none";
        if (act.mouseDown){
            act.mouseDownCnt ++;
            if (act.position.x !== act.prevPosition.x && act.position.y !== act.prevPosition.y && act.mouseDownCnt > 2) {
                act.mode = "drag";
                act.canvas.style.cursor = "move";
            }
            actions();
            if (act.mode === "click") document.body.style.cursor.cursor = "default";
            if (act.mode === "drag")  document.body.style.cursor.cursor = "move";
        }
        else{
            act.canvas.style.cursor = "default";
        }
        act.context.clearRect(0,0,act.canvas.width,act.canvas.height);
        if (!act.external) act.applyAction = [];

        act.data.objects.forEach(function(obj){
            if (obj.parent !== undefined){
                    if (obj.parent.update){
                        act.data.objects.forEach(function(parent){
                            if (parent.name !== obj.parent.name) return;
                            obj.parent.object = parent;
                            obj.parent.update = false;
                        });
                    }
                }

            if (obj.type === "shape"){
                if (obj.show){
                    var posCheck = drawShapes(act, obj.parent.object, obj.position.current, act.data.shapes[obj.shape], obj.color, obj.testp, act.position, obj.scale.current);
                    if (!obj.testp) return;
                    if (posCheck) act.applyAction.push(obj);
                }
            }

            if (obj.type === "image"){
                if (act.imageList[obj.image] === undefined) return;

                if (obj.parent !== undefined) {
                    if (obj.position.offset === undefined){
                        obj.position.offset = {x:obj.parent.object.position.current.x + obj.position.current.x, y:obj.parent.object.position.current.y + obj.position.current.y};
                    }
                    obj.position.current = {
                        "x":obj.parent.object.position.current.x +  Math.floor(obj.position.offset.x * obj.parent.object.scale.current), //act.imageList[obj.image].imageData.naturalWidth/2*obj.scale.current),
                        "y":obj.parent.object.position.current.y +  Math.floor(obj.position.offset.y * obj.parent.object.scale.current) //act.imageList[obj.image].imageData.naturalHeight/2*obj.scale.current)
                    };
                    obj.scale.current = obj.parent.object.scale.current;
                }
                var newVals              = lerpTo(obj.position.current, obj.position.destination, obj.position.rate);
                obj.position.current     = newVals.newCurrent;
                obj.position.destination = newVals.newDestination;

                if (obj.scale.destination !== undefined){
                    if (obj.scale.current < obj.scale.destination) obj.scale.current += obj.scale.rate;
                    if (obj.scale.current > obj.scale.destination) obj.scale.current -= obj.scale.rate;

                    if (obj.scale.current === obj.scale.destination || obj.scale.current + obj.scale.rate >= obj.scale.destination && obj.scale.current - obj.scale.rate <= obj.scale.destination) {
                        obj.scale.current = obj.scale.destination;
                        if (obj.scale.hideafter) obj.show = false;
                        obj.scale.destination = undefined;
                        obj.scale.hideafter = false;
                    }
                }

                var pos = {"x":obj.position.current.x, "y":obj.position.current.y};
                if (obj.origin === "center") pos={"x":Math.floor(pos.x-act.imageList[obj.image].imageData.naturalWidth/2*obj.scale.current), "y":Math.floor(pos.y-act.imageList[obj.image].imageData.naturalHeight/2*obj.scale.current)};
                if (obj.show){
                    act.context.drawImage(act.imageList[obj.image].imageData, pos.x, pos.y, act.imageList[obj.image].imageData.naturalWidth*obj.scale.current, act.imageList[obj.image].imageData.naturalHeight*obj.scale.current);
                    if (!obj.testp) return;
                    var pixelData_img = act.imageList[obj.image].context.getImageData(Math.floor((act.position.x-pos.x)/obj.scale.current), Math.floor((act.position.y-pos.y)/obj.scale.current), 1, 1).data;
                    if (pixelData_img[3] != 0) act.applyAction.push(obj);
                }
            }
        });
        pManager.update();
        act.prevPosition = {x:act.position.x, y:act.position.y};
        window.requestAnimationFrame(loop);
    }

    function drawShapes(act, parent, pos, shapeData, color, doTest, testP, scale){
        var ctx = act.context;
        var test = false;
        var colorIndex = 0;
        var par = {"x":0,"y":0, "scale":1};
        if (parent !== undefined) {
            par = {"x":parent.position.current.x, "y":parent.position.current.y, "scale":parent.scale.current};
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
        if (act.dragging !== null){
            act.applyAction = [act.dragging];
            act.mode        = "drop";
            act.dragging    = null;
            actions();
        }
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
        act.dragging     = null;
    }

    function mouseDown(){
        act.mode         = "click";
        act.external     = false;
        act.mouseDown    = true;
        act.mouseDownCnt = 0;
    }

    function actions(){
        act.applyAction.forEach(function(over){
            if (over[act.mode+"list"] === undefined) return;
            over[act.mode+"list"].forEach(function(action){
                if (action.type === 'cleardown'){
                    act.mode         = "none";
                    act.mouseDown    = false;
                    act.mouseDownCnt = 0;
                }
                if (action.type === 'console'){
                    console.log(action.text);
                }
                if (action.type === 'conditional'){
                    if (action.check === 'position'){
                        var item  = undefined;
                        var testp = undefined;
                        act.data.objects.forEach(function(obj){
                            if (obj.name === action.itemtocheck) item = obj;
                            if (obj.name === action.position)    testp = obj;
                        });
                        var pos = {"x":item.position.current.x, "y":item.position.current.y};
                        var pixelData_img = act.imageList[item.image].context.getImageData(testp.position.current.x-pos.x, testp.position.current.y-pos.y, 1, 1).data;
                        if (pixelData_img[3] != 0) {
                            act.applyAction = [testp];
                            act.mode = 'true';
                            actions();
                        }
                    }
                    if (action.check === "var"){
                        if (act.vars[action.itemtocheck] === action.value){
                            act.applyAction = [over];
                            act.mode = 'true';
                            actions();
                        }
                    }
                }
                if (action.type === 'copyelement'){
                    var target = document.getElementById(action.target);
                    var source = document.getElementById(action.source);
                    if (target !== undefined && source !== undefined){
                        target.innerHTML = source.innerHTML;
                    }
                }
                if (action.type === 'destposition'){
                    act.data.objects.forEach(function(obj){
                        if (action.filter === undefined) return;
                        if (action.filter === "group"){
                            if (obj.group.indexOf(action.name) < 0) return;
                        }
                        if (action.filter === "name"){
                            if (obj.name !== action.name) return;
                        }
                        if (typeof action.destination === "string"){
                            obj.position.destination = {x:obj.position[action.destination].x, y:obj.position[action.destination].y};
                        }
                        else{
                            obj.position.destination = {x:action.destination.x, y:action.destination.y};
                        }
                        obj.position.rate = action.rate;
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
                if (action.type === 'groupvis'){
                    act.data.objects.forEach(function(obj){
                        if (obj.group === undefined) return;
                        if (obj.group.indexOf(action.name) > -1) obj.show = action.show
                    });
                }
                if (action.type === 'modvar'){
                    if (action.operation === "add") act.vars[action.name] += action.amount;
                }
                if (action.type === 'moveobject'){
                    act.data.objects.forEach(function(obj){
                        if (obj.name === undefined) return;
                        if (obj.name !== action.name) return;
                        if (action.frame === "absolute") {
                            obj.position.current = {x:action.amount.x, y:action.amount.y};
                        }
                        if (action.frame === "relative"){
                            obj.position.current.x += action.amount.x;
                            obj.position.current.y += action.amount.y;
                        }
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
                if (action.type === 'objectvis'){
                    act.data.objects.forEach(function(obj){
                        if (obj.name === undefined) return;
                        if (obj.name === action.name) obj.show = action.show;
                    });
                }
                if (action.type === 'pstart'){
                        act.data.particles.forEach(function(obj){
                        if (obj.system.name === undefined) return;
                        console.log(obj)
                        //if (obj.name === action.name) pManager.create({system:{name:"test1", position:{current:{x:0,y:400},destination:{x:600,y:100}, rate:8}, on:true, image:"p", genType:"burst", emitCounter:100, emitRate:3},particles:{life:{min:19, max:80 },fadePercent:{in:25,out:90},scale:{min:0.25,max:1.5},speed:{position:{min:0, max:2},rotation:{min:-0.1, max:0.1}}}});
                        if (obj.system.name === action.name) pManager.create(obj);
                        
                    });
                }
                if (action.type === 'scaledest'){
                    act.data.objects.forEach(function(obj){
                        if (action.filter === undefined) return;
                        if (action.filter === "group"){
                            if (obj.group.indexOf(action.name) < 0) return;
                        }
                        if (action.filter === "name"){
                            if (obj.name !== action.name) return;
                        }
                        obj.scale.destination = action.destination;
                        obj.scale.rate = action.rate;
                        obj.scale.hideafter = action.hideafter;
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
                if (action.type === "slideobject"){
                    act.data.objects.forEach(function(obj){
                        if (obj.name === undefined) return;
                        if (act.dragging !== null && obj.name !== act.dragging.name) return;
                        if (obj.name === action.name) {
                            if (obj.parent !== undefined){
                                if (obj.position.offset === undefined) obj.position[mover] = {x:0,y:0};
                                obj.position.offset.x += (act.position.x - act.prevPosition.x) / obj.scale.current;
                                obj.position.offset.y += (act.position.y - act.prevPosition.y) / obj.scale.current;
                            }
                            else{
                                obj.position.current.x += (act.position.x - act.prevPosition.x);
                                obj.position.current.y += (act.position.y - act.prevPosition.y);
                            }
                            act.dragging = obj;
                        }
                    });
                }
                if (action.type === 'url'){
                    var target = document.getElementById(action.target);
                    if (target != undefined){
                        loadInto(action.url, target);
                    }
                }
            });
        });
        act.applyAction = [];
    }

    function loadInto(url, place){
        function reqListener(){
            place.innerHTML = this.responseText;
        }
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("GET", url);
        oReq.send();
    }

    function getMagnitude(vector){
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }
    function getUnit(vector){
        var mag = getMagnitude(vector);
        return {x:vector.x/mag, y:vector.y/mag};
    }

    function randInterval(min,max)
    {
        return Math.random()*(max-min)+min;
    }
    function randIntervalInt(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    function lerpTo(inCurrent, inDestination, rate){
        if (inDestination === undefined) return {newCurrent:inCurrent, newDestination:inDestination};
        if (inDestination.x === undefined || inDestination.y === undefined) return {newCurrent:inCurrent, newDestination:inDestination};
        var current     = inCurrent;
        var destination = inDestination;
        var dist = Math.sqrt( (destination.x-current.x)*(destination.x-current.x) + (destination.y-current.y)*(destination.y-current.y) );
        if (dist < rate) {
            current = {x:destination.x, y:destination.y};
            destination = undefined;
        }
        else{
            var vec = {x:destination.x-current.x, y:destination.y-current.y};
            var magnitude = getMagnitude(vec);
            vec = {x:parseInt(vec.x/magnitude*rate), y:parseInt(vec.y/magnitude*rate)};
            current = {x:current.x + vec.x, y:current.y + vec.y};
        }
        return {newCurrent:current, newDestination:destination};
    }

}

