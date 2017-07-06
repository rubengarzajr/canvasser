function Menus(){

  this.updateAnims = function(){
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


  this.updateImages = updateImages
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
  this.updateObjects = updateObjects;
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
  this.updateParticles = function(){
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
  this.updatePaths = function(){
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
  this.updateSettings = function(){
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
  this.updateSamples = function(){
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
  this.updateShapes = function(){
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
    authorData.images.push({id:"newImage",path:"",  url:"./image/no_image.png"});
    updateImages();
    initCanvasser("sample", JSON.stringify(authorData), "string");
    window.author.view();
  }

  this.addObject = function(){
    authorData.objects.push({id:"new_object", type:"image",  shape:"", show:true, position:{current:{x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)}}, scale:{current:1}});
    updateObjects();
    initCanvasser("sample", JSON.stringify(authorData), "string");
    window.author.view();
  }

}
