function Menus(){

this.update = function(toUp){
  if (!toUp || toUp === "anims")     updateAnims();
  if (!toUp || toUp === "images")    updateImages();
  if (!toUp || toUp === "objects")   updateObjects();
  if (!toUp || toUp === "particles") updateParticles();
  if (!toUp || toUp === "paths")     updatePaths();
  if (!toUp || toUp === "samples")   updateSamples();
  if (!toUp || toUp === "settings")  updateSettings();
  if (!toUp || toUp === "shapes")    updateShapes();
}

  function updateAnims(){
    var animsHolder = document.getElementById("animholder");
    var anims = '<table class="objtable" id="animstable" width="100%">';

    if (authorData.anims === undefined) authorData.anims = [];
    authorData.anims.forEach(function(anim){
      anims += '<tr class="clicktr" id="anims_'+anim.id+'" onclick="window.author.getProps(\'anims\',\''+ anim.id + '\')">';
      anims +='<td width="100%">' + anim.id + '</td>';
      anims += '</tr>';
    });
    anims +='</table>';
    animsHolder.innerHTML = anims;
  }

  function updateImages(){
    var imageHolder = document.getElementById("imageholder");
    var images = '<table id="imagestable">';
    authorData.images.forEach(function(image){
      var url = image.url;
      if (image.path != undefined){
        preUrl  = authorData.paths.filter(function(selected){return selected.id === image.path;})[0];
        if (preUrl !== undefined) {
          url = preUrl.url + '/' + image.url;
        }
      }
      images += '<tr class="clicktr" id="images_'+image.id+'" onclick="window.author.getProps(\'images\',\''+ image.id + '\')">';
      images +='<td class="imageid"><div class="imagetext">' + image.id + '</div></td>';
      images +='<td width="50%"><img src="' + url + '" alt="' + image.id + '"></td>';
      images += '</tr>';
    });
    images +='</table>';
    imageHolder.innerHTML = images;
  }

  function updateObjects(){
    var objectHolder = document.getElementById("objectholder");
    var objects = '<table class="objtable"id="objectstable" width="100%">';
    authorData.objects.forEach(function(object){
      objects += '<tr class="clicktr" id="objects_'+object.id+'" onclick="window.author.getProps(\'objects\',\''+ object.id + '\')">';
      objects +='<td width="75%" style="font-size:1.3em;">' + object.id + '</td>';
      objects +='<td width="25%">' + object.type + '</td>';
      objects += '</tr>';
    });
    objects +='</table>';
    objectHolder.innerHTML = objects;
  }

  function updateParticles(){
    if (authorData.particles === undefined) return;
    var particlesHolder = document.getElementById("particleholder");
    var particles = '<table class="objtable" id="particlestable" width="100%">';

    authorData.particles.forEach(function(particle){
      particles += '<tr class="clicktr" id="'+particle.id+'" onclick="window.author.getProps(\'particles\',\''+ particle.id + '\')">';
      particles +='<td width="100%">' + particle.id + '</td>';
      particles += '</tr>';
    });
    particles +='</table>';
    particlesHolder.innerHTML = particles;
  }

  function updatePaths(){
    var pathsHolder = document.getElementById("pathholder");
    var paths = '<table class="objtable" id="pathstable" width="100%">';

    authorData.paths.forEach(function(path){
      paths += '<tr class="clicktr" id="'+path.id+'" onclick="window.author.getPath(\''+ path.id + '\')">';
      paths +='<td width="50%">' + path.id + '</td>';
      paths +='<td width="50%">' +path.url + '</td>';
      paths += '</tr>';
    });
    paths +='</table>';
    pathsHolder.innerHTML = paths;
  }
  function updateSettings(){
    var settingHolder = document.getElementById("settingholder");
    var settings = '<table class="objtable" id="settingstable" width="100%">';

    Object.keys(authorData.settings).forEach(function(setting){
      settings += '<tr class="clicktr" id="settings_'+setting+'" onclick="window.author.getSetting(\''+ setting + '\')">';
      settings +='<td width="50%">' + setting + '</td>';
      settings +='<td width="50%">' + authorData.settings[setting] + '</td>';
      settings += '</tr>';
    });
    settings +='</table>';
    settingHolder.innerHTML = settings;
  }
  this.updateSounds = updateSounds
  function updateSounds(){
    if (authorData.sounds === undefined) return;
    var soundsHolder = document.getElementById("soundholder");
    var sounds = '<table class="objtable" id="soundstable" width="100%">';

    authorData.sounds.forEach(function(sound){
      sounds += '<tr class="clicktr" id="'+sound.id+'" onclick="window.author.getProps(\'sounds\',\''+ sound.id + '\')">';
      sounds +='<td width="100%">' + sound.id + '</td>';
      sounds += '</tr>';
    });
    sounds +='</table>';
    soundsHolder.innerHTML = sounds;
  }
  function updateSamples(){
    var imageHolder = document.getElementById("sampleholder");
    var images = '<table id="samplestable" class="objtable w100p">';
    window.rules.samples.forEach(function(sampy){
      images += '<tr class="clicktr" id="shapes_'+sampy.id+'"onclick="window.author.loadSample(\''+ sampy.url + '\')">';
      images +='<td class="shapeid"><div>' + sampy.id + '</div></td>';
      images += '</tr>';
    });
    images +='</table>';
    imageHolder.innerHTML = images;
  }
  function updateShapes(){
    var imageHolder = document.getElementById("shapeholder");
    var images = '<table id="shapestable" class="objtable w100p">';
    authorData.shapes.forEach(function(shape){
      images += '<tr class="clicktr" id="shapes_'+shape.id+'"onclick="window.author.getProps(\'shapes\',\''+ shape.id + '\')">';
      images +='<td class="shapeid"><div>' + shape.id + '</div></td>';
      images += '</tr>';
    });
    images +='</table>';
    imageHolder.innerHTML = images;
  }

  this.addImage = function(){
    var imgName  = 'newImage';
    var imgCnt   = 0;
    var tryAgain = true;
    while (tryAgain){
      if (authorData.images.filter(function(img){return img.id === imgName}).length > 0){
        imgCnt ++;
        imgName ='newImage'+imgCnt;
      } else tryAgain = false;
    }
    authorData.images.push({id:imgName,path:"author",  url:"no_image.png"});
    updateImages();
    initCanvasser("sample", JSON.stringify(authorData), "string");
    window.author.view();
  }

  this.addObject = function(){
    var objName  = 'object';
    var objCnt   = 0;
    var tryAgain = true;
    while (tryAgain){
      if (authorData.objects.filter(function(obj){return obj.id === objName}).length > 0){
        objCnt ++;
        objName ='object'+objCnt;
      } else tryAgain = false;
    }
    authorData.objects.push({id:objName, type:"image",  shape:"", show:true, position:{current:{x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)}}, scale:{current:1}});
    updateObjects();
    initCanvasser("sample", JSON.stringify(authorData), "string");
    window.author.view();
  }
  this.addParticle = function(){
    if (!authorData.particles) authorData.particles=[];
    var particleName  = 'particle';
    var particleCnt   = 0;
    var tryAgain = true;
    while (tryAgain){
      if (authorData.particles.filter(function(particle){return particle.id === particleName}).length > 0){
        particleCnt ++;
        particleName ='particle'+particleCnt;
      } else tryAgain = false;
    }
    authorData.particles.push({id:particleName, position:{current:{x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)}}});
    updateParticles();
    initCanvasser("sample", JSON.stringify(authorData), "string");
    window.author.view();
  }
  this.addSound = function(){
    var soundName  = 'sound';
    var soundCnt   = 0;
    var tryAgain = true;
    while (tryAgain){
      if (authorData.sounds.filter(function(sound){return sound.id === soundName}).length > 0){
        soundCnt ++;
        soundName ='sound'+soundCnt;
      } else tryAgain = false;
    }
    authorData.sounds.push({id:soundName, url:"./"});
    updateSounds();
    initCanvasser("sample", JSON.stringify(authorData), "string");
    window.author.view();
  }
}
