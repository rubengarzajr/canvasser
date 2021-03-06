// Canvasser rubengarzajr@gmail.com

function initCanvasser(vari, datafile, dataForm, overrides){
  if (overrides == undefined) overrides = [];

  if (typeof window[vari] === 'object' ){
    if (typeof window[vari].act === 'object' ){
      if (window[vari].act.videoList !== undefined){
        for (var property1 in window[vari].act.videoList) {
          window[vari].act.videoList[property1].pause();
        }
      }
      if (window[vari].act.soundList !== undefined){
        for (var property1 in window[vari].act.soundList) {
          window[vari].act.soundList[property1].pause();
        }
      }
    }
  }
  if (window[vari]) window[vari].act.loop = false;
  var oldPos = window[vari] ? {x:window[vari].act.position.x, y:window[vari].act.position.y} : {x:-1,y:-1};
  window[vari] = new canvasser(vari, datafile, dataForm, overrides);
  if (window[vari] !== undefined) window[vari].act.position = {x:oldPos.x, y:oldPos.y};
  return window[vari];
}

function canvasser(vari, interactiveData, dataForm, overrides){
  this.version  = '1.5.0';
  var act       = {
    actionList   : [],
    dragging     : null,
    external     : false,
    imageList    : {},
    loop         : true,
    mode         : "none",
    mouseDown    : false,
    mouseDownCnt : 0,
    pathList     : {},
    paused       : false,
    position     : {x:0, y:0},
    player       : [],
    prevPosition : {x:0, y:0},
    soundList    : {},
    touch        : [],
    videoList    : {}
  };

  var ease = new Ease();
  this.act = act;

  var pManager = {
    pSystemList : [],
    create: function(obj){
      var pExist = pManager.pSystemList.filter(function(parTest){return parTest.id === obj.id})[0];
      if (pExist === undefined) {
        var newPSystem = {
          pList: [],
          time: {start:Date.now(), now:Date.now(), prev:Date.now(), diff:0, total:0}
        };
        newPSystem.id               = obj.id;
        newPSystem.info             = copyObj(obj, {});
        newPSystem.info.position    = undefined;
        newPSystem.position         = {current:{x:obj.position.current.x, y:obj.position.current.y}};
        pManager.pSystemList.push(newPSystem);
      }
      else{
        pExist.time             = {start:Date.now(), now:Date.now(), prev:Date.now(), diff:0, total:0};
        pExist.info             = copyObj(obj, {});
        pExist.position         = {current:{x:obj.position.current.x, y:obj.position.current.y}};
      }
    },
    draw: function(id){
      var pSystem = pManager.pSystemList.filter(function(obj){return obj.id === id})[0];
      if (pSystem === undefined) return;
      if (act.imageList[pSystem.info.image] === undefined) return;
      if (act.imageList[pSystem.info.image].deferred && !act.imageList[pSystem.info.image].deferredStart) {
        act.imageList[pSystem.info.image].deferredStart = true;
        var imageLoad = act.data.images.filter(function(im){return im.id === pSystem.info.image})[0];
        if (imageLoad !== undefined) loadImage(imageLoad, pSystem.info.image, false);
      }
      if (act.imageList[pSystem.info.image].imageData === undefined) return;
      if (act.imageList[pSystem.info.image] == undefined) return;
      var imgDim = {x:act.imageList[pSystem.info.image].imageData.naturalWidth/2, y:act.imageList[pSystem.info.image].imageData.naturalHeight/2};
      if (pSystem.info.blend) act.context.globalCompositeOperation = pSystem.info.blend;

      // TODO: MAKE USE ACTUAL TIMESTAMP
      pSystem.pList.forEach(function(p){
        if (!pSystem.info.keepalive) p.life.current --;

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
      });
      pSystem.pList = pSystem.pList.filter(function(p){return p.life.current > 0});
      act.context.globalCompositeOperation = 'source-over';
    },
    getSystem: function(id){
      return pManager.pSystemList.filter(function(item){return item.id === id})[0];
    },
    update: function(){
      pManager.pSystemList.forEach(function(pSystem, index, particleSystemList){
        findParent(pSystem.info);
        pSystem.time.now   = Date.now();
        pSystem.time.diff  = pSystem.time.now - pSystem.time.prev;
        pSystem.time.total = pSystem.time.now - pSystem.time.start;

        if (pSystem.time.diff > 1000/pSystem.info.emitRate && pSystem.info.emitCounter > pSystem.time.total){
          var spawnCount = 1;
          if (pSystem.info.genType === 'burst') spawnCount = pSystem.info.emitRate;
          pSystem.time.prev = pSystem.time.now;
          for (var cnt=0; cnt < spawnCount; cnt ++){
            var partPos = {x:pSystem.position.current.x, y:pSystem.position.current.y};
            if (pSystem.info.emitterSize > 1){
              var t  = 2 * Math.PI * randInterval(0,1);
              var u  = randInterval(0,1) + randInterval(0,1);
              var r  = u > 1 ? 2-u : u
              r *= pSystem.info.emitterSize;
              partPos = {x:r*Math.cos(t) + partPos.x, y:r*Math.sin(t) + partPos.y};
            }
            if (isNaN(pSystem.info.emitDirStart)) pSystem.info.emitDirStart = 0;
            if (isNaN(pSystem.info.emitDirEnd))   pSystem.info.emitDirEnd = 0;
            var rot      = 0;
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
            var parentTransform = {position:{x:0,y:0}, scale:1, rotation:0};

            if (pSystem.info.parent !== undefined){
              if (pSystem.info.parent.object !== undefined) parentTransform.position = {x:pSystem.info.parent.object.position.current.x,y:pSystem.info.parent.object.position.current.y};
            }
            partPos = {x:partPos.x + parentTransform.position.x, y:partPos.y + parentTransform.position.y};
            pSystem.pList.push({position:partPos, rotation:rot,  dirNorm:unit, scale:scale, speed:speed, life:{max:rndLife, current:rndLife}});
          }
        }
        if (pSystem.time.total > pSystem.info.emitCounter && !pSystem.info.keepalive && pSystem.pList.length === 0) {
          particleSystemList.splice(index, 1);
        }
      });
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange, false);
  function handleVisibilityChange(){
    if (document.visibilityState == "hidden") act.paused = true;
    else act.paused = false;
  }

  if (dataForm == "file") requestJson(interactiveData, init);
  else if (dataForm == "string") init(JSON.parse(interactiveData));
  else init(interactiveData);

  function requestJson(fileNamePath, returnFunction){
    var fileToDl = fileNamePath;
    fileToDl += '?' + new Date().getTime();
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) returnFunction(JSON.parse(xhr.responseText));
      if (xhr.status == 404) console.error("JSON Load Error: " + xhr.statusText + " " + xhr.readyState);
    }
    xhr.overrideMimeType('application/json');
    xhr.open('GET', fileToDl, true);
    xhr.send(null);
  }

  function init(data){
    overrides.forEach(function(override){
      subPropSet(data, Object.keys(override)[0], Object.values(override)[0]);
    });

    if (data.settings === undefined) {
      console.log('Unable to load Canvasser.')
      return;
    }

    if (data.layers === undefined){
      data.layers = [{list:[], show:true}];
      var needOrder = ['objects','particles'];
      needOrder.forEach(function(type){
        if (data[type] === undefined) return;
        data[type].forEach(function(item){
          data.layers[0].list.push({id:item.id, type:type, name:item.name });
        });
      });
    }

    if (data.settings.fonts !== undefined){
      data.settings.fonts.forEach(function(font){
        if (font.url === undefined) return;
        if (document.head.innerHTML.indexOf(font.url)>-1) return;
        if (font.type === 'link'){
          var link  = document.createElement('link');
          link.href = font.url;
          link.rel  = 'stylesheet';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        if (font.type === 'url'){
          var newcss = '@font-face {font-family: '+ font.family+'; src: url('+font.url+');}';
          var style  = document.createElement('style');
          style.appendChild(document.createTextNode(newcss));
          document.getElementsByTagName('head')[0].appendChild(style);
        }
      });
    }
    act.canvas        = document.createElement('canvas');
    act.canvasdom     = document.getElementById(data.settings.canvasparent);
    act.context       = act.canvas.getContext('2d');
    act.canvas.width  = data.settings.canvaswidth;
    act.canvas.height = data.settings.canvasheight;
    if (data.settings.responsive){
      act.canvas.style.maxWidth   = "100%";
      act.canvas.style.height     = "auto";
    }

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

    if (act.data.paths){act.data.paths.forEach(function(path){
      act.pathList[path.id] = path.url;});
    }

    if (act.data.sounds){
      act.data.sounds.forEach(function(sound){
        if (sound.path != undefined) sound.url = act.pathList[sound.path] + '/' + sound.url;
        act.soundList[sound.id] = new Audio(sound.url);
      });
    }

    if (act.data.tests === undefined) act.data.tests = [];

    act.data.images.forEach(function(image){
      if (image.deferred) {
        act.imageList[image.id] = {deferred:true};
        return;
      }
      if (image.local){
        var tempImage = document.createElement("img")
        tempImage.src = image.data;
        imageObj.src  = "data:image;base64," + btoa(image.data);
        act.imageList[image.id] = {};
        act.imageList[image.id].imageData     = tempImage;
        act.imageList[image.id].canvas        = document.createElement('canvas');
        act.imageList[image.id].canvas.width  = tempImage.width;
        act.imageList[image.id].canvas.height = tempImage.height;
        act.imageList[image.id].context       = act.imageList[image.id].canvas.getContext('2d');
        act.imageList[image.id].context.drawImage(tempImage, 0, 0, imageObj.src.width, imageObj.src.height);
        if (image.atlas){
          act.imageList[image.id].atlas = {};
          act.imageList[image.id].atlas.cellwidth  = image.cellwidth;
          act.imageList[image.id].atlas.cellheight = image.cellheight;
          act.imageList[image.id].atlas.numX       = Math.floor(imageObj.src.width / image.cellwidth);
          act.imageList[image.id].atlas.numY       = Math.floor(imageObj.src.height / image.cellheight);
        }
      } else {
        loadImage(image, null, false);
      }
    });

    if (act.data.videos === undefined) act.data.videos = [];
    act.data.videos.forEach(function(video){
      if (video.deferred) {
        act.videoList[video.id] = {deferred:true};
        return;
      }
      loadVideo(video, null, false);
    });

    if (act.data.anims !== undefined){
      act.data.anims.forEach(function(anim){
        if (!anim.autostart) return;
        act.player.push(copyObj(anim, {}));
      });
    }

    if (act.data.constraints === undefined) act.data.constraints = [];
    var externals = Array.from(document.querySelectorAll('[data-canvasser="'+vari+'"]'));
    if (externals.length > 0){
      externals.forEach(function(element){
        element.addEventListener("click", function(){window[vari].external(JSON.parse(element.getAttribute('data-canvasser-command')))});
      });
    }
    loop();
  }

  this.external = function(cList){
    act.external = true;
    cList.forEach(function(cmd){
      if (cmd.command === "selectonly"){
        act.mode = "click";
        if (getObjById(cmd.item) !== undefined) act.actionList.push({mode:'click', obj:getObjById(cmd.item)});
      }
    });
  }

  this.report = function(wat){
    console.log(act[wat]);
  }

  this.export = function(){
    return act.data;
  }

  function tests(test){
    var goAll = true;
    if (test.testlist === undefined) return;
    test.testlist.forEach(function(subtest){
      if (subtest.type === 'position'){
        var item  = act.data.objects.filter(function(obj){return obj.id === subtest.itemtocheck})[0];
        var testp = act.data.objects.filter(function(obj){return obj.id === subtest.position})[0];
        if (act.imageList[item.image] === undefined){goAll = false; return;}
        var pos = {"x":item.position.current.x, "y":item.position.current.y};
        if (item.origin === "center") {
          var oPos = {x:item.position.current.x, y:item.position.current.y};
          pos={x:Math.floor(oPos.x-act.imageList[item.image].imageData.naturalWidth/2*item.scale.current),
               y:Math.floor(oPos.y-act.imageList[item.image].imageData.naturalHeight/2*item.scale.current)};
        }
        var pix = getPixel({id:item.image, pos:{x:testp.position.current.x-pos.x, y:testp.position.current.y-pos.y}});
        if (pix[3] === 0) goAll = false;

      }
      if (subtest.type === "var"){
        var thisVar = act.data.vars.filter(function(obj){return obj.id === subtest.itemtocheck})[0];
        if (thisVar !== undefined){
          var go = false;
          if (thisVar.type === 'number'){
             thisVar.value = Number(thisVar.value);
             subtest.value = Number(subtest.value);
          }
          if (subtest.comparetype === 'equal') {
            if (thisVar.value === subtest.value) go = true;
          }
          if (subtest.comparetype === 'greater') {
            if (thisVar.value > subtest.value) go = true;
          }
          if (subtest.comparetype === 'less') {
            if (thisVar.value < subtest.value) go = true;
          }
          if (go){

          } else {
            goAll = false;
          }
        }
      }

    });

    if (goAll){
      if (test.trueoff) test.active = false;
      act.actionList.push({mode:'true', obj:{truelist:test.truelist}, next:true});
    } else {
      if (test.falseoff) test.active = false;
      act.actionList.push({mode:'false', obj:{falselist:test.falselist}, next:true});
    }
  }

  function loop(){
    act.data.tests.forEach(function(test){
      if (!test.active) return;
      tests(test);
    });
    act.canvas.scale = act.canvas.scrollWidth / act.canvas.width;

    act.data.constraints.forEach(function(constraint){
      if (!constraint.active) return;
      constraint.driverlist.forEach(function(dr){
        if (dr.type === 'position'){
          if (dr.driver === undefined || dr.constrained === undefined || dr.axis === undefined || dr.operation === undefined || dr.value === undefined) return;
          var parent = act.data.objects.filter(function(obj){return obj.id === dr.driver})[0];
          var child  = act.data.objects.filter(function(obj){return obj.id === dr.constrained})[0];
          if (parent === undefined || child === undefined) return;
          if (dr.offset === undefined) dr.offset = {x:0, y:0};
          if (dr.offset.x === undefined) dr.offset.x = 0;
          if (dr.offset.y === undefined) dr.offset.y = 0;
          var modPos = {
            x:modVal(dr.operation, parent.position.current.x, dr.value),
            y:modVal(dr.operation, parent.position.current.y, dr.value)
          };
          if (dr.axis === 'x' || dr.axis === 'xy') child.position.current.x = modPos.x + dr.offset.x;
          if (dr.axis === 'y' || dr.axis === 'xy') child.position.current.y = modPos.y + dr.offset.y;
        }
        if (dr.type === 'lookat'){
          var parent = act.data.objects.filter(function(obj){return obj.id === dr.driver})[0];
          var child  = act.data.objects.filter(function(obj){return obj.id === dr.constrained})[0];
          if (parent === undefined || child === undefined) return;
          var diff   = {x: parent.position.current.x - child.position.current.x, y:parent.position.current.y - child.position.current.y};
          var vv = Math.sqrt(diff.x*diff.x + diff.y*diff.y);
          var norm = {x:diff.x / vv, y:diff.y / vv};
          if (dr.angle === undefined) dr.angle = 0;
          if (child.rotation === undefined) child.rotation = 0;
          child.rotation = -Math.atan2(norm.x, norm.y) + 3.1415926536 + radians(dr.angle);
        }
        if (dr.type === 'relation'){
          var parent = act.data.objects.filter(function(obj){return obj.id === dr.driver})[0];
          var child  = act.data.objects.filter(function(obj){return obj.id === dr.constrained})[0];
          if (parent === undefined || child === undefined) return;
          var driver      = 0;
          var constrained = 0;

          driver = subPropGet(parent, dr.driverop);

          if (dr.useminmax){
          var percent = (driver -  dr.drivermin) / (dr.drivermax -  dr.drivermin);
          var out =  percent * (dr.constrainmax -  dr.constrainmin) + dr.constrainmin ;
          driver = out;
          }
          subPropSet(child, dr.constrainop, driver)
        }
        if (dr.type === 'var'){
          var parent = act.data.vars.filter(function(obj){return obj.id === dr.var})[0];
          if (parent === undefined) return
          subPropSet(act.data, dr.path, parent.value);
        }
      });
    });

    act.player.forEach(function(play){
      if (play.playing    === undefined) play.playing    = [];
      if (play.nowStamp   === undefined) {
        if (play.reverse) play.nowStamp = Date.now()+30;
        else play.nowStamp = Date.now()-30;
      }
      if (play.timeActual === undefined) play.timeActual = 1;
      if (play.time       === undefined) play.time       = 1;
      if (play.speed      === undefined) play.speed      = 1;

      play.prevStamp     = play.nowStamp;
      play.prevTime      = play.time;
      play.nowStamp      = Date.now();

      if (play.pause) return;
      if (play.nowStamp-play.prevStamp < 2000) {
        play.timeActual += play.nowStamp - play.prevStamp;
        if (play.reverse) play.time = (play.length - play.timeActual) * play.speed;
        else play.time = play.timeActual * play.speed;
      }

      var deleteAnim = false;
      if (!play.reverse && play.time >= play.length) deleteAnim = true;
      if (play.reverse && play.time <= 0) deleteAnim = true;

      if (deleteAnim) {
        play.delete = true;
        if (play.loop){
          var animToPlay = act.data.anims.filter(function(anim){return anim.id === play.id})[0];
          act.player.push(copyObj(animToPlay, {}));
        }
      }

      if (play.timelist != undefined) {
        play.timelist.forEach(function(animList){
          if (animList.starttime < 1 || animList.starttime === undefined) animList.starttime = 1;
          var addAnim = false;
          if (animList.endtime === undefined) animList.endtime = animList.starttime;
          if (!play.reverse && animList.starttime >= play.prevTime && animList.starttime <= play.time) addAnim = true;
          if (play.reverse && animList.endtime >= play.time && animList.endtime <= play.prevTime) addAnim = true;
          if (addAnim){
            var animCopy = copyObj(animList, {})
            play.playing.push(animCopy);
          }
        });
      }

      play.playing.forEach(function(anim){
        if (anim.type === "blend"){
          if (anim.filter === 'group') {
            var groupObjs = findInGroup(anim.id);
            groupObjs.forEach(function(animSubOb){animSubOb.blend = anim.mode});
          } else {
            var animOb = act.data.objects.filter(function(obj){return obj.id === anim.id})[0];
            if (animOb !== undefined) animOb.blend = anim.mode
          }
          anim.delete = true;
        }
        if (anim.type === "flipbook"){
          var animOb = act.data.objects.filter(function(obj){return obj.id === anim.id})[0];
          if (anim.atlascell   === undefined) anim.atlascell = {x:0, y:0};
          if (anim.atlascell.x === undefined) anim.atlascell.x = 0;
          if (anim.atlascell.y === undefined) anim.atlascell.y = 0;
          if (animOb) animOb.atlascell = {x:anim.atlascell.x, y:anim.atlascell.y};
          anim.delete = true;
        }
        if (anim.type === 'layerassign'){
          var layerNumber = -1;
          act.data.layers.forEach(function(layer, layerIdx){
            if (layer.id === anim.tolayer) layerNumber = layerIdx;
          });
          var found = false;
          act.data.layers.forEach(function(layer, layerIdx){
            layer.list.forEach(function(item, itemIdx){
              if (found) return;
              if (item.id === anim.id){
                found = true;
                var toMove = act.data.layers[layerIdx].list.splice(itemIdx, 1)[0];
                if (anim.layerpos === 'bottom') act.data.layers[layerNumber].list.splice(itemIdx, 0, toMove);
                if (anim.layerpos === 'top') act.data.layers[layerNumber].list.push(toMove);
              }
            });

          });
          anim.delete = true;
        }
        if (anim.type === 'loadinto'){
          act.loop = false;
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
          if (anim.id != undefined){
            act.soundList[anim.id].play();
          }
          anim.delete = true;
        }
        if (anim.type === "soundstop"){
          if (anim.id != undefined){
            act.soundList[anim.id].pause();
            act.soundList[anim.id].currentTime = 0;
          }
          anim.delete = true;
        }
        if (anim.type === "testpset"){
          if (anim.filter === 'group') {
            var groupObjs = findInGroup(anim.id);
            groupObjs.forEach(function(animSubOb){animSubOb.testp = anim.testp});
          } else {
            var animOb = act.data.objects.filter(function(obj){return obj.id === anim.id})[0];
            if (animOb !== undefined) animOb.testp = anim.testp
          }
          anim.delete = true;
        }
        if (anim.type === "varset"){
          var thisVar = act.data.vars.filter(function(obj){return obj.id === anim.var})[0];
          thisVar.value = anim.value;
          anim.delete = true;
        }
        if (anim.type === "videoplay"){
          if (anim.video != undefined){
            if (anim.play) act.videoList[anim.video].play();
            else act.videoList[anim.video].pause();
            if (anim.loop) act.videoList[anim.video].loop = true;
            if (!anim.current) checkSet(act.videoList[anim.video], 'currentTime', anim.timestart,0);
            checkSet(act.videoList[anim.video], 'playbackRate', anim.speed,0,10);
            checkSet(act.videoList[anim.video], 'volume', anim.volume,0,1);
          }
          anim.delete = true;
        }
        if (anim.type === "vis"){
          if (anim.filter === 'group') {
            var groupObjs = findInGroup(anim.id);
            groupObjs.forEach(function(animSubOb){animSubOb.show = anim.show;});
          } else {
            var animOb = act.data.objects.filter(function(obj){return obj.id === anim.id})[0];
            if (animOb !== undefined) animOb.show = anim.show;
          }
          anim.delete = true;
        }
        if (anim.endtime === undefined) return;
        if (anim.endtime < play.time){
          var animOb = getAnimItem(anim);
          if (animOb === undefined) return;

          if (anim.type === "fade") {
            if (anim.filter === 'group') {
              var groupObjs = findInGroup(anim.id);
              groupObjs.forEach(function(animSubOb){
                if (animSubOb.opacity === undefined) animSubOb.opacity = {current:0};
                animSubOb.opacity.current = anim.endalpha;
              });
            } else {
              var animOb = act.data.objects.filter(function(obj){return obj.id === anim.id})[0];
              if (animOb != undefined) {
                if (animOb.opacity === undefined) animOb.opacity = {current:0};
                if (anim.endalpha === undefined) anim.endalpha = 0;
                animOb.opacity.current = anim.endalpha;
             }
            }
          }
          if (anim.type === "move") {
            if (anim.endpos != undefined){
              if (anim.filter === 'group') {
                var groupObjs = findInGroup(animOb.id);
                groupObjs.forEach(function(animSubOb){animSubOb.position.current = {x:anim.endpos.x,y:anim.endpos.y};});
              } else animOb.position.current = {x:anim.endpos.x,y:anim.endpos.y};
            }
          }
          if (anim.type === "turn") {
            animOb.rotation = radians(anim.endrot);
            anim.fromCurrentStart = undefined;
          }
          anim.delete = true;
        }
      });
      play.playing = play.playing.filter(function(anim){return !anim.delete});

      play.playing.forEach(function(anim){
        var animOb = getAnimItem(anim);
        if (animOb === undefined) return;

        if (anim.type === "fade") {
          if (anim.startalpha === undefined ) anim.startalpha = 0;
          if (anim.endalpha === undefined)    anim.endalpha   = 0;

          if (anim.filter === 'group') {
            var groupObjs = findInGroup(anim.id);
            groupObjs.forEach(function(animSubOb){
              if (animSubOb.opacity === undefined) animSubOb.opacity = {current:0};
              if (anim.fromcurrent) anim.startalpha = animSubOb.opacity.current;
              var percent = (play.time - anim.starttime) / (anim.endtime - anim.starttime);
              var alphaDiff = (anim.endalpha - anim.startalpha) * percent + anim.startalpha;
              animSubOb.opacity.current = alphaDiff;
            });
          } else {
            var animOb = act.data.objects.filter(function(obj){return obj.id === anim.id})[0];
            if (animOb.opacity === undefined) animOb.opacity = {current:0};
            if (anim.fromcurrent) anim.startalpha = animOb.opacity.current;
            var percent = (play.time - anim.starttime) / (anim.endtime - anim.starttime);
            var alphaDiff = (anim.endalpha - anim.startalpha) * percent + anim.startalpha;
            if (animOb != undefined) {
              if (animOb.opacity === undefined) animOb.opacity = {current:0}
              if (anim.endalpha === undefined) anim.endalpha = 0;
              animOb.opacity.current = alphaDiff;
           }
          }
        }
        if (anim.type === "move") {
          if (anim.fromcurrent) anim.startpos = {x:animOb.position.current.x,y:animOb.position.current.y};
          if (anim.startpos === undefined) anim.startpos = {x:0, y:0};
          if (anim.endpos === undefined)   anim.endpos   = {x:0, y:0};
          if(isNaN(anim.startpos.x)) anim.startpos.x = 0;
          if(isNaN(anim.startpos.y)) anim.startpos.y = 0;
          if(isNaN(anim.endpos.x))   anim.endpos.x   = 0;
          if(isNaN(anim.endpos.y))   anim.endpos.y   = 0;

          var percent = (play.time - anim.starttime) / (anim.endtime - anim.starttime);
          var t       = play.time    - anim.starttime;
          var d       = anim.endtime - anim.starttime;

          if (anim.ease === undefined) anim.ease = 'linear';
          var posDiff = {
            x:ease[anim.ease](t, anim.startpos.x, anim.endpos.x-anim.startpos.x, d),
            y:ease[anim.ease](t, anim.startpos.y, anim.endpos.y-anim.startpos.y, d)
          };
          if (isNaN(posDiff.x)){console.log("posDiff x NaN");}
          if (isNaN(posDiff.y)){console.log("posDiff y NaN");}
          if (anim.filter === 'group') {
            var groupObjs = findInGroup(animOb.id)
            groupObjs.forEach(function(animSubOb){animSubOb.position.current = {x:Math.round(posDiff.x), y:Math.round(posDiff.y)};});
          } else animOb.position.current = {x:Math.round(posDiff.x), y:Math.round(posDiff.y)};
        }
        if (anim.type === "scale") {
          var objs = [animOb];
          if (anim.filter === 'group') objs = findInGroup(animOb.id);

          objs.forEach(function(animSubOb){
            if (anim.startscale === undefined || anim.fromcurrent) anim.startscale = animSubOb.scale.current;
            var percent   = (play.time - anim.starttime) / (anim.endtime - anim.starttime);
            var t       = play.time    - anim.starttime;
            var d       = anim.endtime - anim.starttime;
            if (anim.ease === undefined) anim.ease = 'linear';
            var scaleDiff = ease[anim.ease](t, anim.startscale, anim.endscale-anim.startscale, d);
            animSubOb.scale.current = scaleDiff;
          });
        }
        if (anim.type === "turn") {
          var objs = [animOb];
          if (anim.filter === 'group') objs = findInGroup(animOb.id);
          objs.forEach(function(animSubOb){
            if (animSubOb.rotation === undefined) animSubOb.rotation = 0;
            var startrot = 0;
            var endrot   = radians(anim.endrot);
            if (anim.fromcurrent) {
              if (anim.fromCurrentStart == undefined){
                startrot = animSubOb.rotation;
                anim.fromCurrentStart = startrot;
              } else {
                startrot = anim.fromCurrentStart;
              }
            } else if (anim.startrot !== undefined) startrot = radians(anim.startrot);
            var percent = (play.time - anim.starttime) / (anim.endtime - anim.starttime);
            var t       = play.time    - anim.starttime;
            var d       = anim.endtime - anim.starttime;
            if (anim.ease === undefined) anim.ease = 'linear';
            var rotDiff = ease[anim.ease](t, startrot, endrot-startrot, d);
            animSubOb.rotation = rotDiff;
          });
        }
      });
    });
    act.player = act.player.filter(function(play){return !play.delete});

    if (act.mode === "true") act.mode = "none";
    if (act.mouseDown){
      act.mouseDownCnt ++;
      if ((act.position.x !== act.prevPosition.x || act.position.y !== act.prevPosition.y) && act.mouseDownCnt > 2) {
        act.mode = 'drag';
        act.canvas.style.cursor = "move";
      }
    }
    else act.canvas.style.cursor = "default";
    act.context.clearRect(0,0,act.canvas.width,act.canvas.height);

    function updateObject(obj){
      if (obj === undefined) return;
      findParent(obj);
      if (obj.type === "shape" && obj.show){
        var objParent = obj.parent != undefined ? obj.parent.object : undefined;
        var currentShape = act.data.shapes.filter(function(shape){return shape.id === obj.shape})[0];
        if (obj.opacity === undefined) obj.opacity = {current:1};
        if (obj.opacity.current === undefined) obj.opacity.current=1;
        act.context.save();
        act.context.globalAlpha = obj.opacity.current;
        if (obj.blend) act.context.globalCompositeOperation = obj.blend;
        var posCheck = drawShapes(act, objParent, obj.position.current, currentShape, obj.color, obj.testp, act.position, obj.scale.current, obj.usecolor);
        act.context.restore();
        if (!obj.testp || act.mode === 'none') return;
        if (posCheck) {
          act.actionList.push({mode:act.mode, obj:obj});
        } else {
          if (act.dragging !== null) {
            if (obj.id === act.dragging.id) {
              act.actionList.push({mode:act.mode, obj:obj});
            }
          }
        }
      }

      if (obj.type === "image" && obj.show){
        if (act.imageList[obj.image] === undefined) return;
        if (act.imageList[obj.image].deferred && !act.imageList[obj.image].deferredStart) {
          act.imageList[obj.image].deferredStart = true;
          var imageLoad = act.data.images.filter(function(im){return im.id === obj.image})[0];
          if (imageLoad !== undefined) loadImage(imageLoad, obj.image, false);
        }
        if (act.imageList[obj.image].imageData === undefined) return;
        obj.parentTransform = {position:{x:0,y:0}, scale:1, rotation:0};
        if (obj.parent !== undefined){
          if (obj.parent.object !== undefined){
            obj.parentTransform = {
              position:{x: obj.parent.object.position.current.x, y: obj.parent.object.position.current.y},
              scale:obj.parent.object.scale.current,
              rotation:obj.parent.object.rotation
            };
          }
        }

        var pos = {
          x:obj.position.current.x * obj.parentTransform.scale + obj.parentTransform.position.x,
          y:obj.position.current.y * obj.parentTransform.scale + obj.parentTransform.position.y
        };
        var atlas = act.imageList[obj.image].atlas;
        if (obj.scale.current === 0 || obj.scale.current === NaN || obj.scale.current < 0) {
          obj.scale.current = 0.01;
        }
        if (obj.originxy           === undefined) obj.originxy = {current:{x:0, y:0}};
        if (obj.originxy.current   === undefined) obj.originxy.current = {x:0, y:0};
        if (obj.originxy.current.x === undefined) obj.originxy.current.x = 0;
        if (obj.originxy.current.y === undefined) obj.originxy.current.y = 0;
        var oxy = {x:obj.originxy.current.x, y:obj.originxy.current.y};
        if (obj.origin === "center") {
          if (atlas){
              oxy ={"x":-Math.floor((atlas.cellwidth/2*obj.scale.current)), "y":-Math.floor((atlas.cellheight/2*obj.scale.current))};
          } else {
            oxy = {
              "x":-(Math.floor(act.imageList[obj.image].imageData.naturalWidth  / 2 * obj.scale.current * obj.parentTransform.scale)),
              "y":-(Math.floor(act.imageList[obj.image].imageData.naturalHeight / 2 * obj.scale.current * obj.parentTransform.scale))
            };
          }
        } else {
          if (atlas){
              oxy ={"x":-Math.floor((obj.originxy.current.x*obj.scale.current)), "y":-Math.floor((obj.originxy.current.y*obj.scale.current))};
          } else {
            oxy = {
              "x":-(Math.floor(obj.originxy.current.x * obj.scale.current)),
              "y":-(Math.floor(obj.originxy.current.y * obj.scale.current))
            };
          }
        }
        if (isNaN(pos.x)){console.log("x NaN"); pos.x = 0;}
        if (isNaN(pos.y)){console.log("y NaN"); pos.y = 0;}

        if (obj.show){
          if (obj.opacity === undefined) obj.opacity = {current:1};
          act.context.save();
          act.context.globalAlpha = obj.opacity.current;
          if (obj.blend) act.context.globalCompositeOperation = obj.blend;
          act.context.translate(pos.x, pos.y);
          act.context.rotate(obj.rotation);
          act.context.translate(oxy.x, oxy.y);
          act.context.scale(obj.scale.current * obj.parentTransform.scale, obj.scale.current * obj.parentTransform.scale);
          if (atlas){
            if (obj.atlascell   === undefined) obj.atlascell = {x:0,y:0};
            if (obj.atlascell.x === undefined) obj.atlascell.x = 0;
            if (obj.atlascell.y === undefined) obj.atlascell.y = 0;
            act.context.drawImage(act.imageList[obj.image].imageData,
              atlas.cellwidth*obj.atlascell.x, atlas.cellheight*obj.atlascell.y,
              atlas.cellwidth, atlas.cellheight, 0,0,
              atlas.cellwidth, atlas.cellheight,
              atlas.cellwidth, atlas.cellheight
            );
          } else {
            act.context.drawImage(act.imageList[obj.image].imageData, 0, 0, act.imageList[obj.image].imageData.naturalWidth, act.imageList[obj.image].imageData.naturalHeight);
          }
          act.context.restore();
          if (!obj.testp || act.mode==='none') return;
          var pix = [0,0,0,0];
          if (obj.scale.current>.001){
            if (obj.origin === 'center'){
              var offWidth  = atlas ? atlas.cellwidth  : act.imageList[obj.image].imageData.naturalWidth;
              var offHeight = atlas ? atlas.cellheight : act.imageList[obj.image].imageData.naturalHeight;
              obj.originxy.current.x = Math.floor(offWidth  / 2);
              obj.originxy.current.y = Math.floor(offHeight / 2);
            }

            pix = getPixel({id:obj.image, pos:{
              x:Math.floor((act.position.x-pos.x+(obj.originxy.current.x * obj.scale.current))/obj.scale.current),
              y:Math.floor((act.position.y-pos.y+(obj.originxy.current.y * obj.scale.current))/obj.scale.current)}
            });
          }
          if (pix[3] != 0 && act.mode !== 'none') {
            act.actionList.push({mode:act.mode, obj:obj});
          }
          else {
            if (act.dragging !== null) {
              if (obj.id === act.dragging.id) {
                act.actionList.push({mode:act.mode, obj:obj});
              }
            }
          }
        }
      }

      if (obj.type === "video" && obj.show){
        if (act.videoList[obj.video] === undefined) return;
        obj.parentTransform = {position:{x:0,y:0}, scale:1, rotation:0};
        if (obj.parent !== undefined){
          if (obj.parent.object !== undefined){
            obj.parentTransform = {
              position:{x: obj.parent.object.position.current.x, y: obj.parent.object.position.current.y},
              scale:obj.parent.object.scale.current,
              rotation:obj.parent.object.rotation
            };
          }
        }

        var pos = {
          x:obj.position.current.x * obj.parentTransform.scale + obj.parentTransform.position.x,
          y:obj.position.current.y * obj.parentTransform.scale + obj.parentTransform.position.y
        };
        if (obj.scale.current === 0 || obj.scale.current === NaN || obj.scale.current < 0) {
          obj.scale.current = 0.01;
        }
        if (obj.originxy           === undefined) obj.originxy = {current:{x:0, y:0}};
        if (obj.originxy.current   === undefined) obj.originxy.current = {x:0, y:0};
        if (obj.originxy.current.x === undefined) obj.originxy.current.x = 0;
        if (obj.originxy.current.y === undefined) obj.originxy.current.y = 0;
        var oxy = {x:obj.originxy.current.x, y:obj.originxy.current.y};
        if (obj.origin === "center") {
          oxy = {
            "x":-(Math.floor(act.videoList[obj.video].videoWidth  / 2 * obj.scale.current * obj.parentTransform.scale)),
            "y":-(Math.floor(act.videoList[obj.video].videoHeight / 2 * obj.scale.current * obj.parentTransform.scale))
          };
        } else {
          oxy = {
            "x":-(Math.floor(obj.originxy.current.x * obj.scale.current)),
            "y":-(Math.floor(obj.originxy.current.y * obj.scale.current))
          };

        }
        if (isNaN(pos.x)){console.log("x NaN"); pos.x = 0;}
        if (isNaN(pos.y)){console.log("y NaN"); pos.y = 0;}

        if (obj.opacity === undefined) obj.opacity = {current:1};
        act.context.save();
        act.context.globalAlpha = obj.opacity.current;
        if (obj.blend) act.context.globalCompositeOperation = obj.blend;
        act.context.translate(pos.x, pos.y);
        act.context.rotate(obj.rotation);
        act.context.translate(oxy.x, oxy.y);
        act.context.scale(obj.scale.current * obj.parentTransform.scale, obj.scale.current * obj.parentTransform.scale);

        act.context.drawImage(act.videoList[obj.video], 0, 0, act.videoList[obj.video].videoWidth, act.videoList[obj.video].videoHeight);
        act.context.restore();
      }
    }

    pManager.update();
    act.data.layers.forEach(function(layer){
      if (!layer.show) return;
      layer.list.forEach(function(item){
        if (item.type === 'particles'){
          pManager.draw(item.id);
        }
        if (item.type === 'objects'){
          var obj = act.data.objects.filter(function(obj){return obj.id === item.id })[0];
          updateObject(obj)
        }
      });
    });
    actions();
    act.prevPosition = {x:act.position.x, y:act.position.y};
    if (act.mode === 'drop') mouseLeave();
    if (act.loop) window.requestAnimationFrame(loop);
  }

  function drawShapes(act, parent, pos, shapeData, color, doTest, testP, scale, usecolor){
    if (color === undefined) return;
    if (color.current === undefined) color.current = ['rgb(0,0,0,1)'];
    if (shapeData === undefined) return;
    var ctx        = act.context;
    var test       = false;
    var colorIndex = 0;
    var par        = {"x":0,"y":0, "scale":1};
    if (parent !== undefined) {
      par = {"x":parent.position.current.x, "y":parent.position.current.y, "scale":parent.scale.current};
    }
    var origin = {
      "x":parseInt(pos.x * par.scale + par.x ),
      "y":parseInt(pos.y * par.scale + par.y )
    }
    var sizer = scale * par.scale;
    ctx.beginPath();
    if (shapeData.drawcode === undefined) shapeData.drawcode = [];
    shapeData.drawcode.forEach(function(shape){
      var offset = {x:0, y:0};
      if (shape.offset !== undefined){
        if (shape.offset.x !== undefined) offset.x = shape.offset.x;
        if (shape.offset.y !== undefined) offset.y = shape.offset.y;
      }

      if (shape.type === "arc"){
        ctx.beginPath();
        if (shape.startangle === undefined) shape.startangle = 0;
        if (shape.endangle === undefined)   shape.endangle   = 0;
        ctx.arc(origin.x+offset.x*sizer, origin.y+offset.y*sizer, shape.radius*sizer,
          radians(shape.startangle), radians(shape.endangle), shape.counterclockwise);
        if (shape.stroke){
          if (shape.linecolor !== undefined) ctx.strokeStyle = shape.linecolor;
          if (shape.linewidth !== undefined) ctx.lineWidth   = shape.linewidth ;
          ctx.stroke();
        }
        if (shape.fill){
          if (shape.fillcolor !== undefined) ctx.fillStyle = shape.fillcolor;
          ctx.fill();
        }
        ctx.closePath();
      }
      if (shape.type === "bcurve"){
        ctx.bezierCurveTo(origin.x+offseta.x*sizer, origin.y+offseta.y*sizer,
          origin.x+offsetb.x*sizer, origin.y+offsetb.y*sizer, origin.x+offsetc.x*sizer,
          origin.y+offsetc.y*sizer);
      }

      if (shape.type === "line"){
        ctx.beginPath();
        shape.startpos = checkPos(shape.startpos);
        shape.endpos   = checkPos(shape.endpos);
        ctx.moveTo(origin.x+shape.startpos.x+offset.x*sizer, origin.y+shape.startpos.y+offset.y*sizer);
        ctx.lineTo(origin.x+shape.endpos.x  +offset.x*sizer, origin.y+shape.endpos.y  +offset.y*sizer);
        ctx.strokeStyle = shape.linecolor;
        ctx.lineWidth   = shape.linewidth;
        ctx.stroke();
        ctx.closePath();
      }
      if (shape.type === "move")      ctx.moveTo(origin.x+offset.x*sizer, origin.y+offset.y*sizer);
      if (shape.type === "rect"){
        ctx.beginPath();
        ctx.rect(origin.x+offset.x*sizer, origin.y+offset.y*sizer, shape.width*sizer,shape.height*sizer);
        if (shape.stroke){
          if (shape.linecolor !== undefined) ctx.strokeStyle = shape.linecolor;
          if (shape.linewidth !== undefined) ctx.lineWidth   = shape.linewidth ;
          ctx.stroke();
        }
        if (shape.fill){
          if (shape.fillcolor !== undefined) ctx.fillStyle = shape.fillcolor;
          ctx.fill();
        }
        if (ctx.isPointInPath(testP.x, testP.y)) {test = true;}
        ctx.closePath();
      }

      if (shape.type === "rectround"){
        ctx.beginPath();
        //ctx.rect(origin.x+offset.x*sizer, origin.y+offset.y*sizer, shape.width*sizer,shape.height*sizer);

        var x = origin.x+offset.x*sizer;
        var y = origin.y+offset.y*sizer;

        ctx.moveTo(x + shape.tl, y);
        ctx.lineTo(x + shape.width - shape.tr, y);
        ctx.quadraticCurveTo(x + shape.width, y, x + shape.width, y + shape.tr);
        ctx.lineTo(x + shape.width, y + shape.height - shape.br);
        ctx.quadraticCurveTo(x + shape.width, y + shape.height, x + shape.width - shape.br, y + shape.height);
        ctx.lineTo(x + shape.bl, y + shape.height);
        ctx.quadraticCurveTo(x, y + shape.height, x, y + shape.height - shape.bl);
        ctx.lineTo(x, y + shape.tl);
        ctx.quadraticCurveTo(x, y, x + shape.tl, y);

        if (shape.stroke){
          if (shape.linecolor !== undefined) ctx.strokeStyle = shape.linecolor;
          if (shape.linewidth !== undefined) ctx.lineWidth   = shape.linewidth ;
          ctx.stroke();
        }
        if (shape.fill){
          if (shape.fillcolor !== undefined) ctx.fillStyle = shape.fillcolor;
          ctx.fill();
        }
        if (ctx.isPointInPath(testP.x, testP.y)) {test = true;}
        ctx.closePath();
      }

      if (shape.type === "textfill") { processText(shape); }
      if (shape.type === "textline") { processText(shape); }
      function processText(shape){
        if (origin === undefined) origin = {x:0,y:0};
        var offset = {x:0, y:0};
        if (shape.offset != undefined){
          if (shape.offset.x !== undefined) offset.x = shape.offset.x;
          if (shape.offset.y !== undefined) offset.y = shape.offset.y;
        }
        var size = 1;
        var height = 0;
        if (shape.size   !== undefined) size   = shape.size;
        if (shape.height !== undefined) height = shape.height;
        if (shape.font) ctx.font = size*sizer + "px " + shape.font;
        if (shape.text === undefined) shape.text = '';
        var varText=String(shape.text).replace(/\{{(.+?)\}}/g, replacer);
        var lines = varText.split("\n");

        var maxWidth = 0;

        lines.forEach(function(line, idx){
          var adjust = 0;
          if (shape.type === 'textline'){
            ctx.lineWidth = shape.width;
            if (usecolor) ctx.strokeStyle = color.current[colorIndex];
            else {
              if (shape.color !== undefined) ctx.strokeStyle = shape.color;
            }
            width = ctx.measureText(line).width;
            if (shape.justify === 'right') { adjust = Math.floor(-width);   }
            if (shape.justify === 'center'){ adjust = Math.floor(-width/2); }
            ctx.strokeText(line, origin.x+adjust+offset.x*sizer, origin.y+(height*idx)+offset.y*sizer);
          }
          if (shape.type === 'textfill'){
            if (usecolor) ctx.fillStyle = color.current[colorIndex];
            else {
              if (shape.color !== undefined) ctx.fillStyle = shape.color;
            }
            width = ctx.measureText(line).width;
            if (shape.justify === 'right') { adjust = Math.floor(-width);   }
            if (shape.justify === 'center'){ adjust = Math.floor(-width/2); }
            ctx.fillText(line, origin.x+adjust+offset.x*sizer, origin.y+(height*idx)+offset.y*sizer);
          }
        });


        function replacer(match, p1, p2, p3, offset, string) {
          var val = act.data.vars.filter(function(obj){return obj.name === p1})[0];
          if (val       === undefined || val       === null) return '';
          if (val.value === undefined || val.value === null) return '';
          return val.value;
        }

      }
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

  function loadImage(image, deferred, loadNew){
    var forceLoad = !act.data.settings.usecache;
    if (loadNew) forceLoad = true;
    var imageObj = new Image();
    imageObj.setAttribute('crossOrigin', 'anonymous');
    imageObj.src = (image.path != undefined ? act.pathList[image.path] + '/' + image.url : image.url) + (forceLoad ? '?' + new Date().getTime() : '');
    //imageObj.crossOrigin = 'anonymous';
    imageObj.onload = function(){
      act.imageList[image.id]               = {};
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

      try { var tester = act.imageList[image.id].context.getImageData(0, 0, 1, 1).data; }
      catch(err){ act.imageList[image.id].tainted = true; }

      if (deferred !== null){
        delete act.imageList[deferred].deferred;
        delete act.imageList[deferred].deferredStart;
      }
    };
  }

  function loadVideo(video, deferred, loadNew){
    videosrc = video.path != undefined ? act.pathList[video.path] + '/' + video.url : video.url;

    if (act.videoList[video.id] === undefined){
      act.videoList[video.id]     = document.createElement('video');
      act.videoList[video.id].src = videosrc;
    }
  }

  function modVal(operation, startVal, val){
    if (operation === "add")      return startVal + val;
    if (operation === "subtract") return startVal - val;
    if (operation === "multiply") return startVal * val;
    if (operation === "divide")   return startVal / val;
  }

  function actions(){
    var clickList = {};
    var objList = [];
    var topClick = undefined;
    if (act.actionList.length>0){
      var actIdx = act.actionList.length;
      while (actIdx--) {
        if (act.actionList[actIdx]) {
          objList.push(act.actionList[actIdx].obj.id)
          clickList[act.actionList[actIdx].obj.id] = act.actionList[actIdx];
          act.actionList.splice(actIdx, 1);
        }
      }
      act.data.layers.forEach(function(layer){
        layer.list.forEach(function(obj){
          if (objList.includes(obj.id)) topClick = obj.id
        });
      });
      act.actionList.push(clickList[topClick]);
    }
    act.actionList.forEach(function(over){
      if (over.obj[over.mode+"list"] === undefined) return;

      over.obj[over.mode+"list"].forEach(function(action){
        if (action.type === 'cleardown'){
          act.mode = "none";
        }
        if (action.type === 'console'){
          console.log(action.text);
        }
        if (action.type === 'conditional'){
          if (action.check === 'position'){
            var item  = act.data.objects.filter(function(obj){return obj.id === action.itemtocheck})[0];
            var testp = act.data.objects.filter(function(obj){return obj.id === action.position})[0];
            var pos = {x:item.position.current.x, y:item.position.current.y};

            if (item.origin === "center") {
              //TODO: Need scale and numberic offset even if not centered
              var oPos = {x:item.position.current.x, y:item.position.current.y};
              pos={x:Math.floor(oPos.x-act.imageList[item.image].imageData.naturalWidth/2*item.scale.current), y:Math.floor(oPos.y-act.imageList[item.image].imageData.naturalHeight/2*item.scale.current)};
            }
            var pix = getPixel({id:item.image, pos:{x:testp.position.current.x-pos.x, y:testp.position.current.y-pos.y}});
            if (pix[3] != 0) act.actionList.push({mode:'true', obj:testp, next:true});
            else act.actionList.push({mode:'false', obj:testp, next:true});
          }
          if (action.check === "var"){
            var thisVar = act.data.vars.filter(function(obj){return obj.id === action.itemtocheck})[0];
            if (thisVar !== undefined){
              var go = false;
              if (thisVar.type === 'number') {
                if (action.value===undefined) action.value = 0;
                thisVar.value = Number(thisVar.value);
                action.value  = Number(action.value);
              }
              if (action.comparetype === 'equal') {
                if (thisVar.value === action.value) {
                  go = true;
                }
              }
              if (action.comparetype === 'greater') {
                if (thisVar.value > action.value) go = true;
              }
              if (action.comparetype === 'less') {
                if (thisVar.value < action.value) go = true;
              }
              if (go){
                act.actionList.push({mode:'true', obj:over.obj, next:true});
              } else  {
                act.actionList.push({mode:'false', obj:over.obj, next:true});
              }
            }
          }
        }
        if (action.type === 'copyelement'){
          var target = document.getElementById(action.target);
          var source = document.getElementById(action.source);
          if (target !== undefined && source !== undefined && target !== null && source !== null){
            target.innerHTML = source.innerHTML;
          }
        }
        if (action.type === 'execute'){
          window[action.function](action.params);
        }
        if (action.type === 'function'){
          var funct = action.function.split(".");
          var win = window[funct.shift()];
          if (win !== undefined){
            while (funct.length > 0){
              win = win[funct.shift()];
            }
            win({id:action.id});
          }
        }
        if (action.type === 'increment'){
          act.data.objects.forEach(function(obj){
            if (!checkAction(action, obj)) return;
            var amt = Number(subPropGet(obj, action.prop)) + Number(action.newvalue);

            if (action.rangemin) {if (amt < Number(action.rangemin)) return;}
            if (action.rangemax) {if (amt > Number(action.rangemax)) return;}
            subPropSet(obj, action.prop, amt.toString());
          });
        }
        if (action.type === 'loadinto'){
          act.loop = false;
          initCanvasser(action.vari, action.url, 'file');
        }
        if (action.type === 'loadpage'){
          if (action.newpage) {
            if (action.backcolor === undefined) action.backcolor = 'black'
            if (action.textcolor === undefined) action.backcolor = 'white'
            var goDiv = document.getElementById("canvasserLoadPageInNewTab");
            if (goDiv !== null) goDiv.parentNode.removeChild(goDiv);
            goDiv = document.createElement('div');
            goDiv.style = 'width: 100%;height: 100%;background-color: '+action.backcolor+';left: 0px;top: 0px;position: absolute;';
            goDiv.id = "canvasserLoadPageInNewTab"
            act.canvasdom.appendChild(goDiv);
            goDiv2 = document.createElement('div');
            goDiv2.style = 'width: 100%;height: 100%;display: table;';
            goDiv.appendChild(goDiv2);
            var button = document.createElement('a');
            button.innerHTML = action.message + '<br>' + (action.showurl ? action.url : '');
            button.style = "color:"+action.textcolor+";display: table-cell;vertical-align: middle;text-align: center;"
            button.href = action.url;
            button.target="_blank";
            goDiv2.appendChild(button);
            button.onclick = function(){goDiv.parentNode.removeChild(goDiv);};

          }
          else {window.location.href = action.url;}
        }
        if (action.type === 'pauseanim'){
          var animPlaying = act.player.filter(function(obj){return obj.id === action.animation})[0];
          if (animPlaying !== undefined){
            if (animPlaying.pause === undefined) animPlaying.pause = false;
            if (action.toggle) animPlaying.pause = !animPlaying.pause;
            else animPlaying.pause = true;
          }
        }
        if (action.type === 'playanim'){
          var animToPlay = act.data.anims.filter(function(obj){return obj.id === action.animation})[0];
          act.player.push(copyObj(animToPlay, {}));
        }
        if (action.type === 'modvar'){
          var varChange = act.data.vars.filter(function(obj){return obj.id === action.id})[0];
          if (action.operation === "add") varChange.value = Number(varChange.value) + Number(action.amount);
          if (action.operation === "sub") varChange.value = Number(varChange.value) - Number(action.amount);
          if (action.operation === "set") {
            varChange.value = varChange.type ==='number' ? Number(action.amount) : action.amount ;
            if (varChange.type ==='boolean') varChange.type = action.amount === 'true' ? true : false;
          }
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
            subPropSet(obj, action.prop, action.newvalue.toString());
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
          var filter = "object";
          if (action.filter!== undefined) filter = action.filter;
          act.data.objects.forEach(function(obj){
            if (action.id === undefined) return;
            if (filter !== 'group'){
              if (obj.id === undefined) return;
              if (act.dragging !== null && obj.id !== act.dragging.id) return;
              if (obj.id !== action.id) return;
              act.dragging = obj;
            }
            if (filter === 'group'){
              if (obj.groups.find(function(e){return e.id === action.id}) === undefined) return;
            }
            if (obj.parent !== undefined){
              if (obj.position.offset === undefined) obj.position.offset = {x:obj.position.current.x,y:obj.position.current.y};
              if (!action.constrainx) obj.position.current.x += (act.position.x - act.prevPosition.x);
              if (!action.constrainy) obj.position.current.y += (act.position.y - act.prevPosition.y);
            } else {
              if (!action.constrainx) obj.position.current.x += (act.position.x - act.prevPosition.x);
              if (!action.constrainy) obj.position.current.y += (act.position.y - act.prevPosition.y);
            }
            if (action.limitx){
              if (obj.position.current.x < action.minx) obj.position.current.x = action.minx;
              if (obj.position.current.x > action.maxx) obj.position.current.x = action.maxx;
              if (action.usebounds){
                if (obj.type === 'image'){
                  var dimX = act.imageList[obj.image].canvas.width * obj.scale.current;
                  if (obj.position.current.x + dimX > action.maxx)
                    obj.position.current.x = action.maxx - dimX;
                }
              }
            }
            if (action.limity){
              if (obj.position.current.y < action.miny) obj.position.current.y = action.miny;
              if (obj.position.current.y > action.maxy) obj.position.current.y = action.maxy;
              if (action.usebounds){
                if (obj.type === 'image'){
                  var dimY = act.imageList[obj.image].canvas.height * obj.scale.current;
                  if (obj.position.current.y + dimY > action.maxy)
                    obj.position.current.y = action.maxy - dimY;
                }
              }
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
          var filter = "object";
          if (action.filter!== undefined) filter = action.filter;
          if (filter === 'group'){
            var groupObjs = findInGroup(action.id);
            groupObjs.forEach(function(obj){obj.testp = action.testp});
          } else {
            var actObj = act.data.objects.filter(function(obj){return obj.id === action.id})[0];
            actObj.testp = action.testp;
          }
        }
        if (action.type === "textentry"){
          var scaleAmt = 1;
          var testWidth = act.canvasdom.clientWidth;
          if (parseInt(act.canvasdom.style.width) < act.canvasdom.clientwidth){
            testWidth = parseInt(act.canvasdom.style.width);
          }
          if (testWidth < act.data.settings.canvaswidth){
            scaleAmt = testWidth / act.data.settings.canvaswidth;
          }
          if (action.style === undefined) action.style = '';
          var holder    = document.getElementById(act.data.settings.canvasparent);
          var text      = document.getElementById(act.data.settings.canvasparent+'_text_input');
          var actVari   = act.data.vars.filter(function(obj){return obj.id ===action.vari})[0];
          var canvasPos = act.canvas.getBoundingClientRect();
          if (action.position === undefined) action.position = {x:0,y:0};
          if (action.position.x  === undefined) action.position.x = 0;
          if (action.position.y  === undefined) action.position.y = 0;
          var abs = {
            x:canvasPos.left + (action.position.x * scaleAmt),
            y:canvasPos.top  + (action.position.y * scaleAmt)
            };
          if (action.overcursor){
            abs = {
              x:canvasPos.left + (act.position.x * scaleAmt),
              y:canvasPos.top  + (act.position.y * scaleAmt)
            };
          }
          text          = document.createElement("input");

          var varType   = 'text';
          if (actVari.type === undefined) actVari.type = 'text';
          if (actVari.type === 'number') varType = 'number';
          text.setAttribute("type", varType);
          text.value      = actVari.value;
          text.id         = act.data.settings.canvasparent + '_text_input';
          text.style      = 'position:absolute;' + action.style;
          text.style.left = '0px';
          text.style.top  = '0px';
          holder.appendChild(text);

          var textPos = text.getBoundingClientRect();
          var diff    = {x:abs.x-textPos.left-textPos.width/2, y:abs.y-textPos.top-textPos.height/2};
          text.style.left = diff.x + 'px';
          text.style.top  = diff.y + 'px';
          text.focus();

          text.addEventListener ("blur", function(e){
            document.getElementById(act.data.settings.canvasparent+'_text_input').remove();
            e.target.removeEventListener(e.type, arguments.callee);
          }, false);
          text.addEventListener ("input", function(e){
            actVari.value = text.value;
          }, false);
          text.addEventListener ("keydown", function(e){
            if(event.key === 'Enter') {
              document.getElementById(act.data.settings.canvasparent+'_text_input').blur();
            }
          }, false);

        }
        if (action.type === 'url'){
          var target = document.getElementById(action.target);
          if (target != undefined){
            loadInPlace(action.url, target);
          }
        }
        if (action.type === 'vis'){
          act.data.objects.forEach(function(obj){
            if (!checkAction(action, obj)) return;
            obj.show = action.show;
          });
        }
      });
    });

    act.actionList = act.actionList.filter(function(action){return action.next});
    act.actionList.forEach(function(action){delete action.next});

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

  function checkAction(action, obj){
    if (action.filter === undefined) return false;
    if (action.filter === "group"){
      if (obj.groups === undefined) return false;
      if (obj.groups.find(function(item){return item.id ===action.id}) === undefined) return false;
    }
    if (action.filter === "object"){
      if (obj.id !== action.id) return false;
    }
    return true;
  }

  function checkSet(check, prop, set, min, max){
    if (check === undefined || prop === undefined || set === undefined) return;
    if (min !== undefined){
      if (set < min) set = min;
    }
    if (max !== undefined){
      if (set > max) set = max;
    }
    check[prop] = set;
  }

  function checkPos(pos){
    var returnValue = {x:0, y:0};
    if (pos === undefined) return returnValue;
    if (pos.x !== undefined) returnValue.x = checkNumVar(pos.x);
    if (pos.y !== undefined) returnValue.y = checkNumVar(pos.y);
    return returnValue;
  }

  function checkNumVar(val){
    if (val.toString().includes('{{')) {
      var varName = val.match(/{{([^']+)}}/)[1];
      var thisVar = act.data.vars.filter(function(obj){return obj.name === varName})[0];
      return Number(thisVar.value);
    } else return Number(val);
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

  function findInGroup(groupName){
    var objList = [];
    return act.data.objects.filter(function(obj){
      if (obj.groups === undefined) return;
      var hasId = false
      obj.groups.forEach(function(subObj){
        if (subObj.id === groupName) {
          hasId = true;
        }
      });
      if (hasId) return true;
    });
  }

  function findParent(item){
    if (item.parent !== undefined){
      if (item.parent.object === undefined){
        var parentObj = act.data.objects.filter(function(parent){return parent.id === item.parent.id})[0];
        if (parentObj !== undefined) item.parent.object = parentObj;
      }
    }
  }

  function getAnimItem(anim){
    if (anim.filter === undefined) anim.filter = 'object';
    var filter = 'objects';
    if (anim.filter != undefined) filter = anim.filter+'s';
    var animOb = act.data[anim.filter+'s'].filter(function(item){return item.id === anim.id})[0];
    if (filter === 'particles') animOb = pManager.getSystem(anim.id);
    return animOb;
  }

  function getMagnitude(vector){
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  }

  function getMousePos(event) {
    var rect = act.canvas.getBoundingClientRect();
    act.position = {x:(event.clientX-rect.left)/act.canvas.scale, y:(event.clientY-rect.top)/act.canvas.scale};
  }

  function getObjById(id){
    return act.data.objects.filter(function(obj){return obj.id === id})[0];
  }

  function getPixel(image){
    if (act.imageList[image.id].tainted) {
      var imageLoad = act.data.images.filter(function(im){return im.id === image.id})[0];
      loadImage(imageLoad, null, true);
      return [0,0,0,0];
    }
    return act.imageList[image.id].context.getImageData(image.pos.x, image.pos.y, 1, 1).data;
  }

  function getUnit(vector){
    var mag = getMagnitude(vector);
    return {x:vector.x/mag, y:vector.y/mag};
  }

  function loadInPlace(url, place){
    var fileToDl = url;
    if (act.data.settings.usecache === false) fileToDl += '?' + new Date().getTime();
    function reqListener(){
      place.innerHTML = this.responseText;
    }
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", fileToDl);
    oReq.send();
  }

  function mouseDown(){
    act.mode         = "click";
    act.external     = false;
    act.mouseDown    = true;
    act.mouseDownCnt = 0;
  }

  function mouseUp(){
    act.mode         = 'none';
    act.mouseDown    = false;
    act.mouseDownCnt = 0;
    if (act.dragging !== null){
      act.mode       = 'drop';
      act.dragging   = null;
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

  function radians(degrees){ return degrees * 0.01745329251994; };

  function randInterval(min,max){ return Math.random()*(max-min)+min; }

  function randIntervalInt(min,max){ return Math.floor(Math.random()*(max-min+1)+min); }

  function subPropGet(obj, desc){
    if (obj === undefined || desc === undefined) return;
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

  function subPropSet(obj, desc, val){
    if (desc === undefined) return;
    var arr = desc.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj[arr[0]] = val;
  }

  // TODO: Does not support multi-touch
  function touchDown(event){
    event.preventDefault();
    var rect = act.canvas.getBoundingClientRect();
    act.position     = {x:(event.changedTouches[0].clientX-rect.left)/act.canvas.scale,
                        y:(event.changedTouches[0].clientY-rect.top)/act.canvas.scale};
    act.prevPosition = {x:act.position.x, y:act.position.y};
    mouseDown();
  }

  function touchMove(event){
    var rect = act.canvas.getBoundingClientRect();
    event.preventDefault();
    act.position = {x:(event.changedTouches[0].clientX-rect.left)/act.canvas.scale, y:(event.changedTouches[0].clientY-rect.top)/act.canvas.scale};
  }

  function touchUp(event){
    event.preventDefault();
    var rect = act.canvas.getBoundingClientRect();
    mouseUp();
  }

}
