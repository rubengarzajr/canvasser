// Canvasser rubengarzajr@gmail.com
// TODO:
// Responsive Scaling: Fix - currently borked

function initCanvasser(vari, datafile, dataForm){
  window[vari] = new canvasser(vari, datafile, dataForm);
}

function canvasser(vari, interactiveData, dataForm){
  var act      = new interaction();
  var pManager = new particleManager();
  var ease     = new Ease();
  if (dataForm == "file") requestJSON(interactiveData, init);
  else if (dataForm == "string") init(JSON.parse(interactiveData));
  else init(interactiveData);

  function requestJSON(fileNamePath, returnFunction){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4){
        returnFunction(JSON.parse(xhr.responseText));
      }
      if (xhr.status == 404) console.error("JSON File Load Error: " + xhr.statusText + " " + xhr.readyState);
    }
    xhr.overrideMimeType('application/json');
    xhr.open('GET', fileNamePath, true);
    xhr.send(null);
  }

  function init(data){
    act.canvas        = document.createElement('canvas');
    act.canvas.id     = data.settings.canvasdomname;
    act.context       = act.canvas.getContext('2d');
    act.canvas.width  = data.settings.canvaswidth;
    act.canvas.height = data.settings.canvasheight;
    act.data          = data;
    document.getElementById(data.settings.canvasparent).innerHTML = "";
    document.getElementById(data.settings.canvasparent).appendChild(act.canvas);
    act.canvas.addEventListener('mousemove',    getMousePos, false);
    act.canvas.addEventListener('mousedown',    mouseDown,   false);
    act.canvas.addEventListener('mouseup',      mouseUp,     false);
    act.canvas.addEventListener('mouseleave',   mouseLeave,  false);
    act.canvas.addEventListener('onmouseenter', mouseEnter,  false);
    act.canvas.addEventListener("touchstart",   touchDown,   false);
    act.canvas.addEventListener("touchmove",    touchMove,   false);
    act.canvas.addEventListener("touchend",     touchUp,     false);

    act.pathList = {};
    if (act.data.paths){act.data.paths.forEach(function(path){
      act.pathList[path.id] = path.url;});
    }

    act.soundList = {};
    if (act.data.sounds){
      act.data.sounds.forEach(function(sound){
        if (sound.path != undefined) sound.url = act.pathList[sound.path] + '/' + sound.url;
        act.soundList[sound.id] = new Audio(sound.url);
      });
    }

    act.imageList = {};
    act.data.images.forEach(function(image){
      if (image.path != undefined) image.url = act.pathList[image.path] + '/' + image.url;
      var imageObj = new Image();
      imageObj.crossOrigin = "Anonymous";
      imageObj.onload = function(){
        act.imageList[image.id] = {};
        act.imageList[image.id].imageData     = this;
        act.imageList[image.id].canvas        = document.createElement('canvas');
        act.imageList[image.id].canvas.width  = this.width;
        act.imageList[image.id].canvas.height = this.height;
        act.imageList[image.id].context       = act.imageList[image.id].canvas.getContext('2d');
        act.imageList[image.id].context.drawImage(this, 0, 0, this.width, this.height);
        if (image.atlas){
          act.imageList[image.id].atlas = {};
          act.imageList[image.id].atlas.cellwidth  = image.cellwidth;
          act.imageList[image.id].atlas.cellheight = image.cellheight;
          act.imageList[image.id].atlas.numX       = Math.floor(this.width / image.cellwidth);
          act.imageList[image.id].atlas.numY       = Math.floor(this.height / image.cellheight);
        }
      };
      imageObj.src = image.url + '?' + new Date().getTime();
    });

    act.vars = {};
    if (act.data.vars != undefined){
      act.data.vars.forEach(function(v){
       act.vars[v.id] = v.value;
      });
    }
    act.player = [];
    if (act.data.anims !== undefined){
      act.data.anims.forEach(function(anim){
        if (!anim.autostart) return;
        act.player.push(copyObj(anim, {}));
      });
    }
    var externals = Array.from(document.querySelectorAll('[data-canvasser="'+vari+'"]'));
    if (externals.length > 0){
      externals.forEach(function(element){
        element.addEventListener("click", function(){window[vari].external(JSON.parse(element.getAttribute('data-canvasser-command')))});
      });
    }
    if (window.location.hash !== "") window[vari].external([{"command":"selectonly", "item":window.location.hash.substring(1)}]);
    loop();
  }

  function interaction(){
    this.position     = {x:0, y:0};
    this.prevPosition = {x:0, y:0};
    this.applyAction  = [];
    this.mouseDown    = false;
    this.mouseDownCnt = 0;
    this.external     = false;
    this.mode         = "none";
    this.dragging     = null;
    this.touch        = [];
  }

  function particleManager(){
    var pSystemList = [];

    this.create = function(obj){
      var newPSystem   = new pSystem();
      newPSystem.info  = obj;
      newPSystem.info.currentEmitCounter = obj.emitCounter;
      pSystemList.push(newPSystem);
    }

    function pSystem(){this.pList = [];}

    this.update = function(){
      pSystemList.forEach(function(pSystem, index, particleList){
        if (pSystem.info.currentEmitCounter > 0){
          pSystem.info.currentEmitCounter --;
          for (cnt =0; cnt < pSystem.info.emitRate; cnt ++){
            var partPos = pSystem.info.position.current;
            if (pSystem.info.emitterSize > 1){
              t = 2*Math.PI*randInterval(0,1);
              u = randInterval(0,1)+randInterval(0,1);
              r = u>1 ? 2-u : u
              r *= pSystem.info.emitterSize;
              partPos = {x:r*Math.cos(t) + pSystem.info.position.current.x, y:r*Math.sin(t)+pSystem.info.position.current.y};
            }
            var rot = 0;
            var dirgrees = randInterval(pSystem.info.emitDirStart-90, pSystem.info.emitDirEnd-90);
            var dir      = radians(dirgrees);

            if (pSystem.info.faceMotion){
              rot = dir;
              if (pSystem.info.faceAngle) rot += radians(pSystem.info.faceAngle);
            }

            var rndDir   = {x:Math.cos(dir),y:Math.sin(dir)};
            var scale    = randInterval(pSystem.info.pParams.scale.min,pSystem.info.pParams.scale.max);
            var rndLife  = randIntervalInt(pSystem.info.pParams.life.min,pSystem.info.pParams.life.max);
            var speed    = {position:randInterval(pSystem.info.pParams.speed.position.min,pSystem.info.pParams.speed.position.max),rotation:randInterval(pSystem.info.pParams.speed.rotation.min,pSystem.info.pParams.speed.rotation.max)}
            var unit     = getUnit(rndDir);
            pSystem.pList.push({position:partPos, rotation:rot,  dirNorm:unit, scale:scale, speed:speed, life:{max:rndLife, current:rndLife}});
          }
        }

        if (act.imageList[pSystem.info.image] == undefined) return;
        var imgDim = {x:act.imageList[pSystem.info.image].imageData.naturalWidth/2, y:act.imageList[pSystem.info.image].imageData.naturalHeight/2};
        var keepParticleSystem = false;
        if (pSystem.info.blend) act.context.globalCompositeOperation = pSystem.info.blend;
        pSystem.pList.forEach(function(p){
          p.life.current --;
          if (p.life.current > 0){
            keepParticleSystem = true;
            p.position  = {x:p.position.x+p.dirNorm.x*p.speed.position, y: p.position.y+p.dirNorm.y*p.speed.position}
            var scale   = p.scale;
            var lifeCnt = p.life.max - p.life.current;
            var pcent   = lifeCnt / p.life.max;

            var alpha = 1;
            if (pcent*100 < pSystem.info.pParams.fade.in)  alpha = lifeCnt / (p.life.max*(pSystem.info.pParams.fade.in*0.01));
            if (pcent*100 > pSystem.info.pParams.fade.out) alpha = p.life.current / (p.life.max - p.life.max*(pSystem.info.pParams.fade.out*0.01));

            var pos     = {"x":parseInt(p.position.x), "y":parseInt(p.position.y)};
            p.rotation += p.speed.rotation;
            act.context.save();
            act.context.translate(pos.x, pos.y);
            act.context.globalAlpha = alpha;
            act.context.rotate(p.rotation);
            act.context.drawImage(act.imageList[pSystem.info.image].imageData, -imgDim.x*scale, -imgDim.y*scale, act.imageList[pSystem.info.image].imageData.naturalWidth*scale, act.imageList[pSystem.info.image].imageData.naturalHeight*scale);
            act.context.restore();
            act.context.globalAlpha = 1;

          }
        });
        act.context.globalCompositeOperation = 'source-over';
        if (!keepParticleSystem) particleList.splice(index, 1);
      });

    };
  }

  this.external = function(cList){
    act.external = true;
    cList.forEach(function(cmd){
      if (cmd.command === "selectonly"){
        act.applyAction = [];
        act.mode = "click";
        act.data.objects.forEach(function(obj){
          if (obj.id === cmd.item) act.applyAction.unshift(obj);
        });
      }
    });
    actions();
  }

  this.report = function(wat){
    console.log(act[wat]);
  }

  this.export = function(){
    return act.data;
  }

  function loop(){
    act.canvas.scale = act.canvas.scrollWidth / act.canvas.width;

    act.player.forEach(function(play){
      if (play.playing   === undefined) play.playing   = [];
      if (play.prevStamp === undefined) play.prevStamp = Date.now();
      if (play.time      === undefined) play.time      = 1;
      if (play.prevTime  === undefined) play.prevTime  = 0;

      play.nowStamp = Date.now();
      play.time    += play.nowStamp - play.prevStamp;
      if (play.time >= play.length) {
        play.delete = true;
        if (play.loop){
          var animToPlay = act.data.anims.filter(function(anim){return anim.id === play.id})[0];
          act.player.push(copyObj(animToPlay, {}));
        }
      }

        play.timelist.forEach(function(animList){
          if (animList.starttime < 1 || animList.starttime === undefined) animList.starttime = 1;
          if (animList.starttime >= play.prevTime && animList.starttime <= play.time) {
            var animCopy = copyObj(animList, {})
            play.playing.push(animCopy);
          }
        });

      play.playing.forEach(function(anim){
        if (anim.type === "flipbook"){
          var animOb = act.data.objects.filter(function(obj){return obj.id === anim.id})[0];
          if (animOb) animOb.atlascell = {x:anim.atlascell.x, y:anim.atlascell.y};
          anim.delete = true;
        }
        if (anim.type === 'loadinto'){
            initCanvasser(anim.vari, anim.url, 'file');
        }
        if (anim.type === "play"){
          var animToPlay = act.data.anims.filter(function(obj){return obj.id === anim.id})[0];
          act.player.push(copyObj(animToPlay, {}));
          anim.delete = true;
        }
        if (anim.type === 'pstart'){
          act.data.particles.forEach(function(obj){
              if (obj.id === undefined) return;
              if (obj.id === anim.id) pManager.create(obj);
          });
          anim.delete = true;
        }
        if (anim.type === "sound"){
            act.soundList[anim.id].play();
            anim.delete = true;
        }
        if (anim.type === "testpset"){
            var animOb = act.data.objects.filter(function(obj){return obj.id === anim.id})[0];
            animOb.testp = anim.testp
            anim.delete = true;
        }
        if (anim.type === "vis"){
            var animOb = act.data.objects.filter(function(obj){return obj.id === anim.id})[0];
            animOb.show = anim.show;
            anim.delete = true;
        }

        if (anim.endtime === undefined) return;
        if (anim.endtime < play.time){
          var animOb = act.data.objects.filter(function(obj){return obj.id === anim.id})[0];
          if (animOb === undefined) return;

          if (anim.type === "fade") {
            if (animOb.opacity === undefined) animOb.opacity = {current:1};
            animOb.opacity.current = anim.endalpha;
          }
          if (anim.type === "move") {
            animOb.position.current = {x:anim.endpos.x,y:anim.endpos.y};
          }
          if (anim.type === "turn") {
            animOb.rotation = radians(anim.endrot);
          }

          anim.delete = true;
        }
      });
      play.playing = play.playing.filter(function(anim){return !anim.delete});

      play.playing.forEach(function(anim){
        var animOb = act.data[anim.filter+'s'].filter(function(obj){return obj.id === anim.id})[0];
        if (animOb === undefined) return;
        if (anim.type === "fade") {
          if (animOb.opacity === undefined) animOb.opacity = {current:1};
          if (anim.startalpha === undefined || anim.startalpha === null || anim.fromcurrent){
            anim.startalpha = animOb.opacity.current;
          }
          var percent = (play.time - anim.starttime) / (anim.endtime - anim.starttime);
          var alphaDiff = (anim.endalpha - anim.startalpha) * percent + anim.startalpha;
          animOb.opacity.current = alphaDiff;
        }
        if ( anim.type === "move") {
          if (anim.startpos === undefined || anim.startpos === null || anim.fromcurrent){
            anim.startpos = {x:animOb.position.current.x,y:animOb.position.current.y};
          }
          if(isNaN(anim.startpos.x)) anim.startpos.x = 0;
          if(isNaN(anim.startpos.y)) anim.startpos.y = 0;
          var percent = (play.time - anim.starttime) / (anim.endtime - anim.starttime);
          var t = play.time - anim.starttime;
          var d = anim.endtime - anim.starttime;

          if (anim.ease === undefined) anim.ease = 'linear';
          var posDiff = {
            x:ease[anim.ease](t, anim.startpos.x, anim.endpos.x-anim.startpos.x, d),
            y:ease[anim.ease](t, anim.startpos.y, anim.endpos.y-anim.startpos.y, d)
          };
          if (isNaN(posDiff.x)){console.log("posDiff x NaN");}
          if (isNaN(posDiff.y)){console.log("posDiff y NaN");}
          animOb.position.current = {x:posDiff.x,y:posDiff.y};
        }
        if (anim.type === "scale") {
          if (anim.startscale === undefined || anim.fromcurrent) anim.startscale = animOb.scale.current;
          var percent = (play.time - anim.starttime) / (anim.endtime - anim.starttime);
          var scaleDiff = (anim.endscale - anim.startscale) * percent + anim.startscale;
          animOb.scale.current = scaleDiff;
        }
        if (anim.type === "turn") {
          var startrot = 0;
          var endrot   = radians(anim.endrot);
          if (anim.startrot === undefined || anim.fromcurrent) startrot = animOb.rotation;
          else startrot = radians(anim.startrot);
          var percent = (play.time - anim.starttime) / (anim.endtime - anim.starttime);
          var rotDiff =(endrot - startrot) * percent + startrot;
          animOb.rotation = rotDiff;
        }

      });
      play.prevTime = play.time;
      play.prevStamp = play.nowStamp;
    });
    act.player = act.player.filter(function(play){return !play.delete
    });

    if (act.mode === "true") act.mode = "none";
    if (act.mouseDown){
      act.mouseDownCnt ++;
      if (act.position.x !== act.prevPosition.x && act.position.y !== act.prevPosition.y && act.mouseDownCnt > 2) {
        act.mode = "drag";
        act.canvas.style.cursor = "move";
      }
      actions();
    }
    else{
      act.canvas.style.cursor = "default";
    }
    act.context.clearRect(0,0,act.canvas.width,act.canvas.height);
    if (!act.external) act.applyAction = [];

    act.data.objects.forEach(function(obj){
      if (obj.parent !== undefined){
        if (obj.parent.object === undefined){
          var parentObj = act.data.objects.filter(function(parent){return parent.id === obj.parent.id})[0];
          if (parentObj !== undefined) obj.parent.object = parentObj;
        }
      }

      if (obj.type === "shape" && obj.show){
        var objParent = obj.parent != undefined ? obj.parent.object : undefined;
        var currentShape = act.data.shapes.filter(function(shape){return shape.id === obj.shape})[0];
        var posCheck = drawShapes(act, objParent, obj.position.current, currentShape, obj.color, obj.testp, act.position, obj.scale.current);
        if (!obj.testp) return;
        if (posCheck) act.applyAction.unshift(obj);
      }

      if (obj.type === "image"){
        if (act.imageList[obj.image] === undefined) return;

        obj.parentTransform = {position:{x:0,y:0}, scale:1, rotation:0};
        if (obj.parent !== undefined){
          var parentPos = {current:{x:0,y:0}};
          var parentScl = {current:1};
          if (obj.parent.object !== undefined){
            obj.parentTransform = {
              position:{x: obj.parent.object.position.current.x, y: obj.parent.object.position.current.y},
              scale:obj.parent.object.scale,
              rotation:obj.parent.object.rotation
            };
          }
          obj.scale.current = parentScl.current;
        }

        var pos = {x:obj.position.current.x + obj.parentTransform.position.x, y:obj.position.current.y + obj.parentTransform.position.y};
        var atlas = act.imageList[obj.image].atlas;

        if (obj.scale.current === 0 || obj.scale.current === NaN || obj.scale.current < 0) {
          obj.scale.current = 0.01;
        }
        if (obj.originxy === undefined) obj.originxy = {current:{x:0, y:0}};
        if (obj.origin === "center") {
          if (atlas){
              obj.originxy.current ={"x":-(atlas.cellwidth/2*obj.scale.current), "y":-(atlas.cellheight/2*obj.scale.current)};
          } else {
            obj.originxy.current ={"x":-(Math.floor(act.imageList[obj.image].imageData.naturalWidth/2*obj.scale.current)), "y":-(Math.floor(act.imageList[obj.image].imageData.naturalHeight/2*obj.scale.current))};
          }
        }
        if (isNaN(pos.x)){console.log("x NaN"); pos.x = 0;}
        if (isNaN(pos.y)){console.log("y NaN"); pos.y = 0;}

        if (obj.show){
          if (obj.opacity === undefined) obj.opacity = {current:1};
          act.context.globalAlpha = obj.opacity.current;
          act.context.save();
          act.context.translate(pos.x, pos.y);
          act.context.rotate(obj.rotation);
          act.context.translate(obj.originxy.current.x, obj.originxy.current.y);
          if (atlas){
            act.context.drawImage(act.imageList[obj.image].imageData,
              atlas.cellwidth*obj.atlascell.x, atlas.cellheight*obj.atlascell.y,
              atlas.cellwidth, atlas.cellheight, 0,0,
              atlas.cellwidth*obj.scale.current, atlas.cellheight*obj.scale.current,
              atlas.cellwidth, atlas.cellheight
            );
          } else {
            act.context.drawImage(act.imageList[obj.image].imageData, 0, 0, act.imageList[obj.image].imageData.naturalWidth*obj.scale.current, act.imageList[obj.image].imageData.naturalHeight*obj.scale.current);
          }
          act.context.restore();
          act.context.globalAlpha = 1;
          if (!obj.testp) return;
          var pixelData_img = [0,0,0,0];
          if (obj.scale.current>.001){
            pixelData_img = act.imageList[obj.image].context.getImageData(
              Math.floor((act.position.x-pos.x-obj.originxy.current.x)/obj.scale.current),
              Math.floor((act.position.y-pos.y-obj.originxy.current.y)/obj.scale.current), 1, 1
            ).data;
          }
          if (pixelData_img[3] != 0) act.applyAction.unshift(obj);
        }
    }
  });

    pManager.update();
    act.prevPosition = {x:act.position.x, y:act.position.y};
    window.requestAnimationFrame(loop);
  }

  function radians(degrees) {
    return degrees * 0.01745329251994;
  };

  function Ease(t, b, c, d){
    this.linear = function(t, b, c, d){
     return c*t/d + b;
    };
    this.inExp = function(t, b, c, d){
      return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
    }
    this.outExp = function(t, b, c, d){
      return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
    }
    this.inOutExp = function(t, b, c, d){
      t /= d/2;
      if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
      t--;
      return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
    }
    this.inQuad = function(t, b, c, d){
      t /= d;
      return c*t*t + b;
    };
    this.outQuad = function(t, b, c, d) {
      t /= d;
      return -c * t*(t-2) + b;
    };
    this.inOutQuad = function(t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
    };
  }

  function drawShapes(act, parent, pos, shapeData, color, doTest, testP, scale){
    if (shapeData === undefined) return;
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

    shapeData.drawcode.forEach(function(shape){
      var offset = {x:0, y:0};
      if (shape.offset!== undefined) offset = {x:shape.offset.x, y:shape.offset.y};
      if (shape.type === "move")      ctx.moveTo(origin.x+offset.x*sizer, origin.y+offset.y*sizer);
      if (shape.type === "rect")      ctx.rect(origin.x+offset.x*sizer, origin.y+offset.y*sizer, shape.width*sizer,shape.height*sizer);
      if (shape.type === "arc")       ctx.arc(origin.x+offset.x*sizer, origin.y+offset.y*sizer, shape.radius*sizer, shape.startangle, shape.endangle, shape.counterclockwise);
      if (shape.type === "bcurve")    ctx.bezierCurveTo(origin.x+offseta.x*sizer, origin.y+offseta.y*sizer, origin.x+offsetb.x*sizer, origin.y+offsetb.y*sizer, origin.x+offsetc.x*sizer, origin.y+offsetc.y*sizer);
      if (shape.type === "line")      ctx.lineTo(origin.x+offset.x*sizer, origin.y+offset.y*sizer);
      if (shape.type === "linewidth") ctx.lineWidth = shape.width*sizer;
      if (shape.type === "fillStyle") {
          if (color === null) ctx.fillStyle = shape.color;
          else ctx.fillStyle = color.current[colorIndex];
      }
      if (shape.type === "fill") {
        ctx.fillStyle = color.current[colorIndex];
        ctx.fill();
      }
      if (shape.type === "filltext") {
        ctx.fillStyle = color.current[colorIndex];
        var offset = {x:0, y:0};
        if (shape.offset != undefined) offset= {x:shape.offset.x, y:shape.offset.y};
        ctx.fillText(shape.text, origin.x+offset.x*sizer, origin.y+offset.y*sizer);
      }
      if (shape.type === "stroketext") {
        ctx.lineWidth = shape.stroke;
        ctx.strokeStyle = color.current[colorIndex];
        ctx.strokeText(shape.text, origin.x+shape.offset.x*sizer, origin.y+shape.offset.y*sizer);
      }
      if (shape.type === "outlinetext") {
        ctx.lineWidth   = shape.stroke;
        ctx.strokeStyle = color.current[colorIndex];
        ctx.strokeText(shape.text, origin.x+shape.offset.x*sizer, origin.y+shape.offset.y*sizer);
        colorIndex ++
        ctx.fillStyle = color.current[colorIndex];
        ctx.fillText(shape.text, origin.x+shape.offset.x*sizer, origin.y+shape.offset.y*sizer);
      }
      if (shape.type === "font") ctx.font = shape.size*sizer + "px " + shape.font;
      if (shape.type === "strokestyle"){
        if (color === null) ctx.strokeStyle = shape.color;
        else ctx.strokeStyle = color.current[colorIndex];
      }
      if (shape.type === "stroke") ctx.stroke();
      if (shape.type === "ptest" && doTest) {
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
    act.position = {x:(event.clientX-rect.left)/act.canvas.scale, y:(event.clientY-rect.top)/act.canvas.scale};
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

  function touchDown(event){
    event.preventDefault();
    var rect = act.canvas.getBoundingClientRect();
    for (var i = 0; i < event.changedTouches.length; i++) {
      act.touch.push(copyTouch(event.changedTouches[i]));
      act.position = {x:(event.changedTouches[i].pageX-rect.left)/act.canvas.scale, y:(event.changedTouches[i].pageY-rect.top)/act.canvas.scale};
    }
    act.mode         = "click";
    act.external     = false;
    act.mouseDown    = true;
    act.mouseDownCnt = 0;
  }

  function touchMove(event){
    var rect = act.canvas.getBoundingClientRect();
    event.preventDefault();
    for (var i = 0; i < event.changedTouches.length; i++) {
      var idx = event.changedTouches[i].identifier;
      if (idx >= 0) {
        act.position = {x:(event.changedTouches[i].pageX-rect.left)/act.canvas.scale, y:(event.changedTouches[i].pageY-rect.top)/act.canvas.scale};
        act.touch.splice(idx, 1, copyTouch(event.changedTouches[i]));  // swap in the new touch record
      }
    }
  }

  function touchUp(event){
    event.preventDefault();
    var rect = act.canvas.getBoundingClientRect();
    for (var i = 0; i < event.changedTouches.length; i++) {
      var idx = event.changedTouches[i].identifier;
      if (idx >= 0) {
        act.position = {x:(event.changedTouches[i].pageX-rect.left)/act.canvas.scale, y:(event.changedTouches[i].pageY-rect.top)/act.canvas.scale};
        act.touch.splice(idx, 1);  // swap in the new touch record
      }
    }
  }

  function copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
  }

    function actions(){
        act.applyAction.forEach(function(over){
            if (over[act.mode+"list"] === undefined) return;
            over[act.mode+"list"].forEach(function(action){
                if (action.type === 'cleardown'){
                    act.mode    = "none";
                }
                if (action.type === 'console'){
                    console.log(action.text);
                }
                if (action.type === 'conditional'){
                    if (action.check === 'position'){
                        var item  = act.data.objects.filter(function(obj){return obj.id === action.itemtocheck})[0];
                        var testp = act.data.objects.filter(function(obj){return obj.id === action.position})[0];
                        var pos = {"x":item.position.current.x, "y":item.position.current.y};
                        if (item.origin === "center") {
                          //TODO: Not working
                          var oPos = item.position.current
                            pos={"x":Math.floor(oPos.x-act.imageList[item.image].imageData.naturalWidth/2*item.scale.current), "y":Math.floor(oPos.y-act.imageList[item.image].imageData.naturalHeight/2*item.scale.current)};
                        }

                        var pixelData_img = act.imageList[item.image].context.getImageData(testp.position.current.x-pos.x, testp.position.current.y-pos.y, 1, 1).data;
                        if (pixelData_img[3] != 0) {
                            act.applyAction = [testp];
                            act.mode = 'true';
                            actions();
                        } else {
                          act.applyAction = [testp];
                          act.mode = 'false';
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
                    if (target !== undefined && source !== undefined && target !== null && source !== null){
                        target.innerHTML = source.innerHTML;
                        window.location.hash = over.id;
                    }
                }
                if (action.type === 'execute'){
                    window[action.function](action.params);
                }
                if (action.type === 'function'){
                    window[action.function]({id:action.id});
                }
                if (action.type === 'increment'){
                    act.data.objects.forEach(function(obj){
                      if (!checkAction(action, obj)) return;
                      var amt = Number(getSubProp(obj, action.prop)) + Number(action.newvalue);

                      if (action.rangemin) {if (amt < Number(action.rangemin)) return;}
                      if (action.rangemax) {if (amt > Number(action.rangemax)) return;}
                      setSubProp(obj, action.prop, amt.toString());
                    });
                }
                if (action.type === 'loadinto'){
                    initCanvasser(action.vari, action.url, 'file');
                }
                if (action.type === 'loadpage'){
                  if (action.newpage) {window.open(action.url);}
                  else {window.location.href = action.url;}
                }
                if (action.type === 'playanim'){
                  var animToPlay = act.data.anims.filter(function(obj){return obj.id === action.animation})[0];
                  act.player.push(copyObj(animToPlay, {}));
                }
                if (action.type === 'modvar'){
                    if (action.operation === "add") act.vars[action.id] += action.amount;
                }
                if (action.type === 'swapimage'){
                    act.data.objects.forEach(function(obj){
                        if (obj.id  === undefined) return;
                        if (obj.id !== action.id) return;
                        obj.image = action.image;
                    });
                }
                if (action.type === 'moveobject'){
                    act.data.objects.forEach(function(obj){
                        if (obj.id === undefined) return;
                        if (obj.id !== action.id) return;
                        if (action.frame === "absolute") {
                            obj.position.current = {x:action.amount.x, y:action.amount.y};
                        }
                        if (action.frame === "relative"){
                            obj.position.current.x += action.amount.x;
                            obj.position.current.y += action.amount.y;
                        }
                    });
                }
                if (action.type === 'pstart'){
                    act.data.particles.forEach(function(obj){
                        if (obj.id === undefined) return;
                        if (obj.id === action.id) pManager.create(obj);
                    });
                }
                if (action.type === 'scale'){
                    act.data.objects.forEach(function(obj){
                        if (!checkAction(action, obj)) return;
                        if (action.frame === "increment") obj.scale.current += action.amount;
                        if (action.frame === "multiply"){
                            obj.scale.current = obj.scale.current * action.amount;
                        }
                        if (action.frame === "absolute")  obj.scale.current =  action.amount;
                    });
                }
                if (action.type === 'set'){
                    act.data.objects.forEach(function(obj){
                      if (!checkAction(action, obj)) return;
                      setSubProp(obj, action.prop, action.newvalue.toString());
                    });
                }
                if (action.type === 'shapecolor'){
                    act.data.objects.forEach(function(obj){
                        if (!checkAction(action, obj)) return;
                        if (action.source === "default")     obj.color = obj.defaultcolor;
                        if (action.source === "hover")       obj.color = obj.hovercolor;
                        if (action.source === "selectcolor") obj.color = obj.selectcolor;
                        if (action.source === "value")       obj.color = action.color;
                    });
                }
                if (action.type === "slideobject"){
                    act.data.objects.forEach(function(obj){
                        if (obj.id === undefined) return;
                        if (act.dragging !== null && obj.id !== act.dragging.id) return;
                        if (obj.id === action.id) {
                            if (obj.parent !== undefined){
                              if (obj.position.offset === undefined) obj.position.offset = {x:obj.position.current.x,y:obj.position.current.y};
                              if (!action.constrainx) obj.position.current.x += (act.position.x - act.prevPosition.x);
                              if (!action.constrainy) obj.position.current.y += (act.position.y - act.prevPosition.y);
                            } else{
                              if (!action.constrainx) obj.position.current.x += (act.position.x - act.prevPosition.x);
                              if (!action.constrainy) obj.position.current.y += (act.position.y - act.prevPosition.y);
                            }
                            act.dragging = obj;
                        }
                    });
                }
                if (action.type === "slideover"){
                    console.log("slideOver");
                }
                if (action.type === "sound"){
                    act.soundList[action.id].play();
                }
                if (action.type === "testpset"){
                    var actObj = act.data.objects.filter(function(obj){return obj.id === action.id})[0];
                    actObj.testp = action.testp
                }
                if (action.type === 'url'){
                    var target = document.getElementById(action.target);
                    if (target != undefined){
                        loadInto(action.url, target);
                    }
                }
                if (action.type === 'vis'){
                    act.data.objects.forEach(function(obj){
                        if (!checkAction(action, obj)) return;
                        obj.show = action.show
                    });
                }
            });
        });
        act.applyAction = [];
    }

  function checkAction(action, obj){
    if (action.filter === undefined) return false;
    if (action.filter === "group"){
      if (obj.group === undefined) return false;
      if (obj.group.indexOf(action.id) < 0) return false;
    }
    if (action.filter === "object"){
      if (obj.id !== action.id) return false;
    }
    return true;
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

  function randInterval(min,max){
    return Math.random()*(max-min)+min;
  }

  function randIntervalInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
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

  function setSubProp(obj, desc, val){
    var arr = desc.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj[arr[0]] = val;
  }

  function copyObj(object, newObj){
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        if (typeof(object[key]) === 'object') {
          if (Array.isArray(object[key])){
            newObj[key] = appendToArray(object[key])
          } else newObj[key] = copyObj(object[key], {});
        } else newObj[key] = object[key] ;
      }
    }
    return newObj
  }

  function appendToArray(inArray){
    var newArr = []
    inArray.forEach(function(element){
      if (typeof(element) === 'object') {
          if (Array.isArray(element)){
            newArr.push(appendToArray(element))
          } else newArr.push(copyObj(element, {}));
        } else newArr.push(element)
    });
    return newArr;
  }

}