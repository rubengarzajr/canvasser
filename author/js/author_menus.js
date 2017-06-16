function Menus(){

  this.updateAnims = function(){
    var animsHolder = document.getElementById("animholder");
    var anims = '<table class="objtable" id="animstable" width="100%">';

    if (authorData.anims === undefined) authorData.anims = [];
    authorData.anims.forEach(function(anim){
      anims += '<tr class="clicktr" id="'+anim.id+'" onclick="window.author.getProps(\'anims\',\''+ anim.id + '\')">';
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
      images += '<tr class="clicktr" id="'+image.id+'" onclick="window.author.getProps(\'images\',\''+ image.id + '\')">';
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
      objects += '<tr class="clicktr" id="'+object.id+'" onclick="window.author.getProps(\'objects\',\''+ object.id + '\')">';
      objects +='<td width="50%">' + object.id + '</td>';
      objects +='<td width="50%">' + object.type + '</td>';
      objects += '</tr>';
    });
    objects +='</table>';
    objectHolder.innerHTML = objects;
  }
  this.updateSettings = function(){
    var settingHolder = document.getElementById("settingholder");
    var settings = '<table class="objtable" id="settingstable" width="100%">';

    Object.keys(authorData.settings).forEach(function(setting){
      settings += '<tr class="clicktr" id="'+setting+'" onclick="window.author.getSetting(\''+ setting + '\')">';
      settings +='<td width="50%">' + setting + '</td>';
      settings +='<td width="50%">' + authorData.settings[setting] + '</td>';
      settings += '</tr>';
    });
    settings +='</table>';
    settingHolder.innerHTML = settings;
  }
  this.updateShapes = function(){
    var imageHolder = document.getElementById("shapeholder");
    var images = '<table id="shapestable">';
    authorData.shapes.forEach(function(shape){
      images += '<tr class="clicktr" id="'+shape.id+'"onclick="window.author.getProps(\'shapes\',\''+ shape.id + '\')">';
      images +='<td class="shapeid"><div class="imagetext">' + shape.id + '</div></td>';
      images += '</tr>';
    });
    images +='</table>';
    imageHolder.innerHTML = images;
  }

  this.addImage = function(){
    authorData.images.push({id:"newImage",path:"",  url:"./image/no_image.png"});
    updateImages();
    initCanvasser("sample", JSON.stringify(authorData), "string");
    window.author.view()
  }

  this.addObject = function(){
    authorData.objects.push({id:"new_object", type:"image",  shape:"", show:true, position:{current:{x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)}}, scale:{current:1}});
    updateObjects();
    initCanvasser("sample", JSON.stringify(authorData), "string");
    window.author.view()
  }

}
