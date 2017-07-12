function BuildProp(){
  var utils = new CanvasserUtils();
  var menus = new Menus();

  this.anim = function(animation){
    var output = '<div class="propbody">';
    var animList = utils.objPartToArr(authorData.anims, "id");

    window.rules.anim.animdata.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += '<input class="auth_text '+widget.css+'" type="text" value="'+ animation[widget.field] + '" ';
        output += utils.buildFnString('window.author.updateActivity', ['anims', 'text', animation.id, widget.field, 'none'], true);
        output += '><br>';
      }
      if (widget.type === "number")   output += utils.handleNumber(animation, 'anim', widget, widget.field);
      if (widget.type === "bool")     output += utils.handleBoolean(animation, 'anim', widget, widget.field);
      if (widget.type === "timelist"){
        var timeList = [];
        window.rules.anims.forEach(function(template){timeList.push(template.type)});
        output += '<div><div class="pos_holder mw400"><div class="pos_title">' + widget.display + '</div>';
        if (animation[widget.field] !== undefined){
          animation[widget.field].forEach(function(actobject, idx){
            var actionWidgets = window.rules.anims.filter(function(type){ return type.type === actobject.type});
            if (actionWidgets.length === 0) return;
            actionWidgets = actionWidgets[0].widgets;
            output += '<div class="actionblock">';
            output += '<div class="rightx" onclick="window.author.deletetimeline('+"'"+animation.id+"'"+','+idx+')">X</div>' + '<br>';
            output += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
            output += utils.buildSelect('window.author.updateTimeline',  animation.id, "anim", timeList, actobject.type, widget.field+'.'+idx+'.type') + '<br>';

            actionWidgets.forEach(function(subWidget, idxPart){
              var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
              if (subWidget.type === 'bool')    output += utils.handleBoolean(animation,        'anim', subWidget, widgetPath);
              if (subWidget.type === 'number')  {
                output += utils.handleNumber(animation,   'anim', subWidget, widgetPath);
              }
              if (subWidget.type === 'objlist') output += handleObjectList(animation,     'anim', subWidget, widgetPath);
              if (subWidget.type === 'anmlist') output += handleAnimList(animation,       'anim', subWidget, widgetPath);
              if (subWidget.type === 'parlist') output += handleParticleList(animation,   'anim', subWidget, widgetPath);
              if (subWidget.type === 'sndlist') output += handleSoundList(animation,      'anim', subWidget, widgetPath);
              if (subWidget.type === 'posxy')   output += utils.handlePosition(animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'select')  output += utils.handleSelect(animation,   'anim', subWidget, widgetPath);
              if (subWidget.type === "text")    output += handleText(animation,           'anim', subWidget, widgetPath, 'w100');
            });
            output += '</div>';
          });
          output += '<br>';
        }
        output += utils.buildDiv('divbutton', 'Add Command', 'window.author.addAnimCommand', [animation.id, widget.field]);
        output += '</div>';
      }
    });
    menus.updateAnims();
    return output + '</div>';
  }

  this.image = function(image){
    var output = '<div class="propbody">';
    var pathList = utils.objPartToArr(authorData.paths, "id");
    var defaultId = utils.getSubProp(image, 'path');
    window.rules.image.imagedata.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += '<input class="auth_text w200" type="text" value="'+ image[widget.field] + '" ';
        output += utils.buildFnString('window.author.updateActivity', ['images', 'text', image.id, widget.field, 'none'], true);
        output += '><br>';
      }
      if (widget.type === "select"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += utils.buildSelect('window.author.updateItem',  image.id, 'image', pathList, defaultId, 'path') + '<br>';
      }
      if (widget.type === "number")       output += utils.handleNumber(image, 'image', widget, widget.field);
      if (widget.type === "bool")         output += utils.handleBoolean(image, 'image', widget, widget.field);
    });
    menus.updateImages();
    return output + '</div>';
  }
  this.object = function(object){
    var output = '<div class="propbody">' ;
    var win = 'window.author.updateActivity';
    window.rules.object[object.type].widgets.forEach(function(widget, idx, source){
      if (widget.type === "text")         output += handleText(object, 'object', widget, widget.field, 'w100');
      if (widget.type === "number")       output += utils.handleNumber(object, 'object', widget, widget.field);
      if (widget.type === "select")       output += utils.handleSelect(object, 'object', widget, widget.field);
      if (widget.type === "arraystrings") output += '<div class="entrylabel c_entrytitle_text w100">' + widget.field + '</div><input class="auth_text" type="text" value="'+ object[widget.field]+'"><br>';
      if (widget.type === "bool")         output += utils.handleBoolean(object, 'object', widget, widget.field);
      if (widget.type === "imagedata"){
        var imageList = utils.objPartToArr(authorData.images, "id");
        output += utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
        output += utils.buildSelect('window.author.updateItem',  object.id, 'object', imageList, object[widget.field], widget.field) + '<br>';
        var flipTest = authorData.images.filter(function(img){ return img.id === object.image})[0];
        if (flipTest){
          if(flipTest.atlas){
            output += utils.handleNumber(object, 'object', {field:'atlascell.x'}, 'atlascell.x');
            output += utils.handleNumber(object, 'object', {field:'atlascell.y'}, 'atlascell.y');
          }
        }
      }
      if (widget.type === "shapelist") output += handleShapeList(object,  'object', widget, widget.field);
      if (widget.type === "objlist")   output += handleObjectList(object, 'object', widget, widget.field);
      if (widget.type === "posxy"){
        output += '<div style="display:block"><div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
        if (object[widget.field] === undefined) object[widget.field] = {current:{x:0,y:0}};
        var tempPos = {x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)};

        if (object[widget.field].current !== undefined){
          tempPos = object[widget.field].current;
        }

        output += '<span>';
        output += ' <span class="entrytitle c_entrylabel_pos">X</span> <input class="auth_xy" ';
        output += utils.buildFnString('window.author.updateItem', [object.id, 'object', widget.field+'.current.x'], true);
        output += 'type="number" value=' + tempPos.x + ' />';
        output += ' <span class="entrytitle c_entrylabel_pos">Y</span> <input class="auth_xy" ';
        output += utils.buildFnString('window.author.updateItem', [object.id, 'object', widget.field+'.current.y'], true);
        output += 'type="number" value=' + tempPos.y + ' />';
        output += '</span>'
        output += '</div>';
      }
      if (widget.type === "color"){
        output += '<div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
        Object.keys(object[widget.field]).forEach(function(colorList){
            output += '<div class="entrylabel c_entrylabel_pos w100">' + colorList + '</div>';
            object.color[colorList].forEach(function(color,idx){
            output += handleText(object, 'object', {field:idx}, widget.field+'.'+colorList+'.'+idx, 'w20');
          })
        });
        output += '</div><br>';
      }
      if (widget.type === "scale"){
        output += '<div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
        if (object[widget.field] === undefined) object[widget.field] = {current:1};
        scaleObj = object[widget.field].current;
        output += '<span><input class="auth_xy" ';
        output += utils.buildFnString('window.author.updateItem', [object.id, 'object', 'scale.current'], true);
        output += 'type="number" value=' +scaleObj + ' />';
        output += '</span>'
        //output += '<br>';
        output += '</div></div>';
      }
      if (widget.type === "actions"){
          var actionsList = [];
          window.rules.actions.forEach(function(template){actionsList.push(template.type)});
          output += '<div><div class="pos_holder mw400"><div class="pos_title">' + widget.display + '</div>';
          if (object[widget.field] !== undefined){
            object[widget.field].forEach(function(actobject, idx){
              var actionWidgets = window.rules.actions.filter(function(type){ return type.type === actobject.type});
              if (actionWidgets.length === 0) return;
              actionWidgets = actionWidgets[0].widgets;
              output += '<div class="actionblock">';
              output += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
              output += utils.buildSelect('window.author.updateActionList',  object.id, "object", actionsList, actobject.type, widget.field+'.'+idx+'.type');
              output += '<div class="rightx" onclick="window.author.deleteaction('+"'"+object.id+"'"+','+"'"+widget.field+"',"+idx+')">X</div>' + '<br>';
              actionWidgets.forEach(function(subWidget, idxPart){
                var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
                if (subWidget.type === 'bool')    output += utils.handleBoolean(object,  'object', subWidget, widgetPath);
                if (subWidget.type === 'number')  output += utils.handleNumber(object,   'object', subWidget, widgetPath);
                if (subWidget.type === 'objlist') output += handleObjectList(object,     'object', subWidget, widgetPath);
                if (subWidget.type === 'anmlist') output += handleAnimList(object,       'object', subWidget, widgetPath);
                if (subWidget.type === 'parlist') output += handleParticleList(object,   'object', subWidget, widgetPath);
                if (subWidget.type === 'sndlist') output += handleSoundList(object,      'object', subWidget, widgetPath);
                if (subWidget.type === 'posxy')   output += utils.handlePosition(object, 'object', subWidget, widgetPath);
                if (subWidget.type === 'select')  output += utils.handleSelect(object,   'object', subWidget, widgetPath);
                if (subWidget.type === "text")    output += handleText(object,           'object', subWidget, widgetPath, 'w100');
              });
              output += '</div>';
            });
            output += '<br>';
          }
          output += utils.buildDiv('divbutton', 'Add Action', 'window.author.addaction', [object.id, widget.field]);
          output += '</div>';
      }
    });
    output += " " + object;
    return output + '</div>';
  }

  this.particle = function(particle){
    var output = '<div class="propbody">' ;
    var win = 'window.author.updateActivity';
    window.rules.particle.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text")         output += handleText(particle, 'particle', widget, widget.field, 'w100');
      if (widget.type === "number")       output += utils.handleNumber(particle, 'particle', widget, widget.field);
      if (widget.type === "select")       output += utils.handleSelect(particle, 'particle', widget, widget.field);
      if (widget.type === "arraystrings") output += '<div class="entrylabel c_entrytitle_text w100">' + widget.field + '</div><input class="auth_text" type="text" value="'+ particle[widget.field]+'"><br>';
      if (widget.type === "bool")         output += utils.handleBoolean(particle, 'particle', widget, widget.field);
      if (widget.type === "imagedata"){
        var imageList = utils.objPartToArr(authorData.images, "id");
        output += utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
        output += utils.buildSelect('window.author.updateItem',  particle.id, 'particle', imageList, particle[widget.field], widget.field) + '<br>';
        var flipTest = authorData.images.filter(function(img){ return img.id === particle.image})[0];
        if (flipTest){
          if(flipTest.atlas){
            output += utils.handleNumber(particle, 'particle', {field:'atlascell.x'}, 'atlascell.x');
            output += utils.handleNumber(particle, 'particle', {field:'atlascell.y'}, 'atlascell.y');
          }
        }
      }
      if (widget.type === "shapelist") output += handleShapeList(particle,  'particle', widget, widget.field);
      if (widget.type === "objlist")   output += handleObjectList(particle, 'particle', widget, widget.field);
      if (widget.type === "posxy"){
        output += '<div style="display:block"><div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
        if (particle[widget.field] === undefined) particle[widget.field] = {current:{x:0,y:0}};
        var tempPos = {x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)};

        if (particle[widget.field].current !== undefined){
          tempPos = particle[widget.field].current;
        }

        output += '<span>';
        output += ' <span class="entrytitle c_entrylabel_pos">X</span> <input class="auth_xy" ';
        output += utils.buildFnString('window.author.updateItem', [particle.id, 'particle', widget.field+'.current.x'], true);
        output += 'type="number" value=' + tempPos.x + ' />';
        output += ' <span class="entrytitle c_entrylabel_pos">Y</span> <input class="auth_xy" ';
        output += utils.buildFnString('window.author.updateItem', [particle.id, 'particle', widget.field+'.current.y'], true);
        output += 'type="number" value=' + tempPos.y + ' />';
        output += '</span>'
        output += '</div>';
      }
      if (widget.type === "color"){
        output += '<div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
        particle.keys(particle[widget.field]).forEach(function(colorList){
            output += '<div class="entrylabel c_entrylabel_pos w100">' + colorList + '</div>';
            particle.color[colorList].forEach(function(color,idx){
            output += handleText(particle, 'particle', {field:idx}, widget.field+'.'+colorList+'.'+idx, 'w20');
          })
        });
        output += '</div><br>';
      }
      if (widget.type === "scale"){
        output += '<div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
        if (particle[widget.field] === undefined) particle[widget.field] = {current:1};
        scaleObj = particle[widget.field].current;
        output += '<span><input class="auth_xy" ';
        output += utils.buildFnString('window.author.updateItem', [particle.id, 'particle', 'scale.current'], true);
        output += 'type="number" value=' +scaleObj + ' />';
        output += '</span>'
        //output += '<br>';
        output += '</div></div>';
      }

    });
    output += " " + particle;
    return output + '</div>';
  }

  this.shape = function(shape){
    var drawList = [];
    window.rules.drawcode.forEach(function(template){drawList.push(template.type)});
    thisProp = authorData.shapes.filter(function(check){return check.id === shape.id;})[0];
    if (thisProp === undefined) return;

    document.getElementById("propertiestitle").innerHTML ='<div class="proptitle">Shape: ' + shape.id + '</div>';
    var prop = '<div class="propbody">' ;
    thisProp.drawcode.forEach(function(widget, idx, source){
      prop += '<div class="propbox">'
      prop += '<div class="rightfloater">';
      prop += '<div class="deleter" onclick="window.author.deleteprop(\'shapes\', \''+thisProp.id+'\', \'drawcode.'+idx+'\')">';
      prop += '<img id="removeshape" src="image/icon_x.png"/></div>';
      if (idx > 0){
        prop += '<div onclick="window.author.moveprop(\'shapes\', \''+thisProp.id+'\', \'drawcode.'+idx+'\',\''+(idx-1)+'\')">';
        prop += '<img id="removeshape" src="image/icon_move_up.png"/></div>';
      }
      if (idx < thisProp.drawcode.length-1){
        prop += '<div onclick="window.author.moveprop(\'shapes\', \''+thisProp.id+'\',\'drawcode.'+idx+'\',\''+(idx+1)+'\')">';
        prop += '<img id="removeshape" src="image/icon_move_down.png"/></div>';
      }
      prop += '</div>';
      prop += '<div class="entrylabel c_entrytitle_text w25">'+idx+'</div>';
      var tmpObj = {id:widget.type, field:'type'}
      prop += utils.handleSelect(thisProp, 'shape', tmpObj, 'drawcode.' + idx + '.type', drawList);
      var currentDraw = window.rules.drawcode.filter(function(draw){return draw.type === widget.type})[0];
      currentDraw.widgets.forEach(function(subWidget){
      var widgetPath =  'drawcode' + '.' +  idx + '.' +  subWidget.field ;
      prop += '<div class="propitem">'
      if (subWidget.type === "bool")      prop += utils.handleBoolean(thisProp,  'shape', subWidget, widgetPath);
      if (subWidget.type === 'number')    prop += utils.handleNumber(thisProp,   'shape', subWidget, widgetPath);
      if (subWidget.type === 'posxy')     prop += utils.handlePosition(thisProp, 'shape', subWidget, widgetPath);
      if (subWidget.type === "select")    prop += utils.handleSelect(thisProp,   'shape', subWidget, widgetPath);
      if (subWidget.type === "text")      prop += handleText(thisProp,     'shape', subWidget, widgetPath, 'w100');
      prop += '</div>';
      });
      prop += '</div>';
    });
    menus.updateShapes();
    prop += utils.buildDiv('divbutton', 'Add drawcode', 'window.author.adddrawcode', [shape.id]);
    return prop + '</div>';
  }


  function handleShapeList(object, type, widget, path){
    var str = '';
    var objectList = utils.objPartToArr(authorData.shapes, "id");
    var defaultId = utils.getSubProp(object, path);
    str += utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += utils.buildSelect('window.author.updateItem',  object.id, type, objectList, defaultId, path) + '<br>';
    return str;
  }

  function handleTimeList(animation, type, widget, path){
    var str = '';
    var animList = utils.objPartToArr(authorData.anims, "id");
    var defaultId = utils.getSubProp(animation, path);
    str += utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += utils.buildSelect('window.author.updateItem',  animation.id, type, animList, defaultId, path) + '<br>';
    return str;
  }
  function handleAnimList(object, type, widget, path){
    var str = '';
    var objectList = utils.objPartToArr(authorData.anims, "id");
    var defaultId = utils.getSubProp(object, path);
    str += utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += utils.buildSelect('window.author.updateItem',  object.id, type, objectList, defaultId, path) + '<br>';
    return str;
  }
  function handleObjectList(object, type, widget, path){
    var str = '';
    var objectList = utils.objPartToArr(authorData.objects, "id");
    var defaultId = utils.getSubProp(object, path);
    str += utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += utils.buildSelect('window.author.updateItem',  object.id, type, objectList, defaultId, path) + '<br>';
    return str;
  }
  function handleParticleList(object, type, widget, path){
    var str = '';
    var objectList = utils.objPartToArr(authorData.particles, "id");
    var defaultId = utils.getSubProp(object, path);
    str += utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += utils.buildSelect('window.author.updateItem',  object.id, type, objectList, defaultId, path) + '<br>';
    return str;
  }
  function handleSoundList(object, type, widget, path){
    var str = '';
    var objectList = utils.objPartToArr(authorData.sounds, "id");
    var defaultId = utils.getSubProp(object, path);
    str += utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += utils.buildSelect('window.author.updateItem',  object.id, type, objectList, defaultId, path) + '<br>';
    return str;
  }
  function handleText(object, type, widget, path, widthClass){
    var str = '';
    var defaultId = utils.getSubProp(object, path);
    str += utils.buildDiv('entrylabel c_entrytitle_text ' + widthClass, widget.field );
    str += '<input class="auth_text" type="text" value="'+ defaultId + '" ';
    str += utils.buildFnString('window.author.updateItem', [object.id, type, path], true);
    str +=   '>'  + "<br>";
    return str;
  }
}
