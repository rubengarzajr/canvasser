function canvasser(dataFile){
    requestJSON(dataFile, init);
    var act = new interaction();

    dropPos = {x:10,y:100};

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
    }

    function loop(){
        act.context.clearRect(0,0,act.canvas.width,act.canvas.height);
        act.context.fillStyle    = "white";
        act.context.fillRect(0,0,act.canvas.width,act.canvas.height);


        drawShapes(act.context, act.position, act.data.shapes.drop);

        //console.log(position);
        dropPos.x = act.position.x;
        dropPos.y = act.position.y;
        act.context.beginPath();
        act.context.moveTo(170, 80);
        act.context.bezierCurveTo(130, 100, 130, 150, 230, 150);
        act.context.bezierCurveTo(250, 180, 320, 180, 340, 150);
        act.context.bezierCurveTo(420, 150, 420, 120, 390, 100);
        act.context.bezierCurveTo(430, 40, 370, 30, 340, 50);
        act.context.bezierCurveTo(320, 5, 250, 20, 250, 50);
        act.context.bezierCurveTo(200, 5, 150, 20, 170, 80);
        act.context.closePath(); // complete custom shape
        if (act.context.isPointInPath(act.position.x, act.position.y)) act.context.strokeStyle = 'blue';
        else act.context.strokeStyle = 'red';
        act.context.lineWidth = 5;
        act.context.stroke();

        act.context.beginPath();
        act.context.moveTo(act.position.x, act.position.y);
        act.context.lineTo(act.position.x+1, act.position.y+1);
        act.context.closePath(); // complete custom shape
        act.context.lineWidth = 1;
        act.context.strokeStyle = 'black';
        act.context.stroke();

        act.context.beginPath();
        act.context.arc(50, 50, 50, 0, 2 * Math.PI, false);
        act.context.fillStyle = 'green';
        act.context.fill();
        act.context.closePath(); // complete custom shape

        window.requestAnimationFrame(loop);
    }

    function drawShapes(ctx, origin, shapeData){
        ctx.beginPath();
        shapeData.forEach(function(shape){
            if (shape.type === "move") ctx.moveTo(origin.x+shape.offsetx, origin.y+shape.offsety);
            if (shape.type === "arc") ctx.arc(origin.x+shape.offsetx, origin.y+shape.offsety, shape.radius, shape.startangle, shape.endangle, shape.counterclockwise);
            if (shape.type === "line") ctx.lineTo(origin.x+shape.offsetx, origin.y+shape.offsety);
            if (shape.type === "linewidth") ctx.lineWidth = shape.width;
            if (shape.type === "fillStyle") ctx.fillStyle = shape.color;
            if (shape.type === "fill") ctx.fill();
            if (shape.type === "stroke") ctx.stroke();
        });
        ctx.closePath();
   }

    function getMousePos(event) {
        var rect = act.canvas.getBoundingClientRect();
        act.position = {x:event.clientX-rect.left, y:event.clientY-rect.top};
    }
}

