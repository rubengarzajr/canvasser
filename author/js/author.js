var authorLibs = {
  externalsPath:  './',
  defaultJSONobj: false,
  defaultJSON:    "./json/default.json",
  dom:{},
  contentPath: '../../canvasser_content',
  gui: {
    currentLayer:    0,
    mousedown:       false,
    parentMouseDown: false,
    moveElement:     null,
    mousePos:        {x:0,y:0},
    offset:          {x:0,y:0},
    zidx:            25
  },
  lists:{
    fileManager:[],
    fileList:undefined
  },
  uploadList:[],
  endpoints:{
    files:    "api/v1/files",
    projects: "api/v1/projects"
  }
};

document.onreadystatechange = function(){
     if(document.readyState === 'complete'){
        initAuthorCanvasser();
     }
}

function learning(action, page){
  if (window.learningHistory === undefined) window.learningHistory = {idx:-1, pages:[]};

  if (action === 'load'){
    if (window.learningHistory.idx != window.learningHistory.pages.length-1){
      window.learningHistory.pages = window.learningHistory.pages.slice(0, window.learningHistory.idx+1);
    }
    window.learningHistory.pages.push(page);
    window.learningHistory.idx ++;
    authorLibs.utils.requestFile(authorLibs.externalsPath + "learning/html/"+page+".html", popLearn);
  }
  if (action === 'back'){
    if (window.learningHistory.idx <= 0) return;
    window.learningHistory.idx --;
    authorLibs.utils.requestFile(authorLibs.externalsPath + "learning/html/"+window.learningHistory.pages[ window.learningHistory.idx]+".html", popLearn);
  }
}

function popLearn(contents){
  var newContent = contents.split('"./').join('"' + authorLibs.externalsPath);
  document.getElementById("learning").innerHTML = newContent;
}

function pickWin(win, toggle, size, bank){
  document.getElementById(bank).style.zIndex = authorLibs.utils.zPlus();
  authorLibs.windows.toggleminmax(win, toggle, size);
}

function initAuthorCanvasser(vari, datafile, dataForm){
  authorLibs.windows.build();
  learning('load', 'welcome');
  authorLibs.utils.requestJson(authorLibs.externalsPath + "json/author.json", setRules);
  authorLibs.windows.theme('default');
  function setRules(data){
    authorLibs.rules  = data;
    if (authorLibs.defaultJSONobj) initEdit(authorLibs.defaultJSON);
    else authorLibs.utils.requestJson(authorLibs.defaultJSON, initEdit);
  }

  function initEdit(datafile){
    authorLibs.author = new authorcanvasser(datafile, 'file');
  }
}

function restartCanvasser(name, data, type){
  data.paths.forEach(function(path){
    if (path.url.substring(0,2) === './') path.url = authorLibs.externalsPath + path.url.substring(2)
  });

  authorLibs.authorData = data;
  authorLibs.canvasser = initCanvasser(name, JSON.stringify(data), type);
  authorLibs.menus.update();

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  var canvasParent = document.getElementById(data.settings.canvasparent);
  var canvas       = canvasParent.firstChild;
  var context      = canvas.getContext('2d');
  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    var message  = parseInt(mousePos.x) + ',' + parseInt(mousePos.y);
    document.getElementById('outputtitle').innerHTML = message;
  }, false);

  var title = document.getElementById('titlelabel');
  if (title !== undefined) title.innerHTML = 'Canvasser <div class = "version">version ' + authorLibs.canvasser.version + '</span>';
}

function authorcanvasser(dataFile, dataForm){
  authorLibs.authorData = dataFile;
  window.addEventListener("mouseup",   moveObjU,  false);
  window.addEventListener("mousemove", mouseMove, false);
  restartCanvasser("sample", authorLibs.authorData, "string");
  authorLibs.menus.update();
  loop();

  function loop(){
    if (authorLibs.gui.moveElement !== null && authorLibs.gui.move){
      authorLibs.gui.moveElement.style.left = authorLibs.gui.mousePos.x  - authorLibs.gui.offset.x + "px";
      authorLibs.gui.moveElement.style.top  = authorLibs.gui.mousePos.y  - authorLibs.gui.offset.y + "px";
      var ext = authorLibs.utils.getVisibleArea();
      var win = authorLibs.gui.moveElement.getBoundingClientRect();

      if (authorLibs.gui.mousePos.x - authorLibs.gui.offset.x < 5) authorLibs.gui.moveElement.style.left = '5px';
      if (authorLibs.gui.mousePos.y - authorLibs.gui.offset.y < 5) authorLibs.gui.moveElement.style.top  = '5px';
      var maxX = ext.x-5-win.width > 5 ? ext.x-5-win.width : 5;
      var maxY = ext.y-10-win.height > 5 ? ext.y-10-win.height : 5;
      if (win.right  > ext.x-5)  authorLibs.gui.moveElement.style.left = maxX +'px';
      if (win.bottom > ext.y-10) {
        authorLibs.gui.moveElement.style.top  = maxY +'px';
        if (authorLibs.gui.moveElement.id === 'objectbank'){
          document.getElementById('objectholder').style.height = '200px';
        }
      }
    }
    window.requestAnimationFrame(loop);
  }

  function mouseMove(ev){
    authorLibs.gui.mousePos = {x:ev.clientX, y:ev.clientY };

    if (authorLibs.gui.moveElement !== null){
      if (document.selection) {
        document.selection.empty()
      } else {
        window.getSelection().removeAllRanges()
      }
    }
  }

  function moveObjU(ev){
    authorLibs.gui.mousedown = false;
    authorLibs.gui.moveElement = null;
  }

  function outText(label, value, cmd){
    '<div class="entrylabel c_entrytitle_text w100">' + label + '</div><input class="auth_text" type="text" value="'+ value +'"><br>';
    return output;
  }

  function init(data){
    act.canvas        = document.createElement('canvas');
    act.context       = act.canvas.getContext('2d');
    act.canvas.width  = data.settings.canvaswidth;
    act.canvas.height = data.settings.canvasheight;
    act.data          = data;
    document.getElementById(data.settings.canvasparent).appendChild(act.canvas);
    act.canvas.addEventListener('mousemove', getMousePos, false);
    act.canvas.addEventListener('click', getClickPos, false);

    act.data.images.forEach(function(image){
      var imageObj    = new Image();
      imageObj.onload = function() { act.imageList[image.id] = this; };
      imageObj.src = image.url;
    });
  }
}
