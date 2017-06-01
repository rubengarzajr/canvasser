function BuildProp(){
  var utils = new CanvasserUtils();
  var menus = new Menus();

  this.anim = function(animation){
    var output = '<div class="propbody">';
    var animList = utils.objPartToArr(authorData.anims, "id");

    window.rules.anim.animdata.widgets.forEach(function(widget, idx, source){
      console.log(widget.type)
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
            console.log(actobject)
            var actionWidgets = window.rules.anims.filter(function(type){ return type.type === actobject.type});
            if (actionWidgets.length === 0) return;
            actionWidgets = actionWidgets[0].widgets;
            output += '<div class="actionspacer"></div><div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
            output += utils.buildSelect('window.author.updateActionList',  animation.id, "anim", timeList, actobject.type, widget.field+'.'+idx+'.type') + '<br>';

            actionWidgets.forEach(function(subWidget, idxPart){
              var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
              if (subWidget.type === 'bool')    output += utils.handleBoolean(animation,        'anim', subWidget, widgetPath);
              if (subWidget.type === 'number')  {
                console.log(animation,   'anim', subWidget, widgetPath)
                output += utils.handleNumber(animation,   'anim', subWidget, widgetPath);
              }
              if (subWidget.type === 'objlist') output += handleObjectList(animation,     'anim', subWidget, widgetPath);
              if (subWidget.type === 'posxy')   output += utils.handlePosition(animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'select')  output += utils.handleSelect(animation,   'anim', subWidget, widgetPath);
              if (subWidget.type === "text")    output += handleText(animation,           'anim', subWidget, widgetPath, 'w100');
            });

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
        output += '<input class="auth_text w400" type="text" value="'+ image[widget.field] + '" ';
        output += utils.buildFnString('window.author.updateActivity', ['images', 'text', image.id, widget.field, 'none'], true);
        output += '><br>';
      }
      if (widget.type === "select"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += utils.buildSelect('window.author.updateItem',  image.id, 'image', pathList, defaultId, 'path') + '<br>';
      }
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
      }
      if (widget.type === "shapelist") output += handleShapeList(object,'object', widget, widget.field);
      if (widget.type === "objlist")   output += handleObjectList(object, 'object', widget, widget.field);

      if (widget.type === "posxy"){
        output += '<div style="display:flex"><div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
        var hasDestination = false;
        var hasRate        = false;
        var hasOffset      = false;
        for(var posObj in object[widget.field]){
          if (posObj === "destination") hasDestination = true;
          if (posObj === "offset")      hasOffset      = true;
          if (posObj === "rate")        hasRate        = true;
        }
        if (object.parent !== undefined && !hasOffset) object[widget.field].offset = object[widget.field].current;
        if (!hasDestination) object[widget.field].destination = undefined;
        if (!hasRate) object[widget.field].rate = 0;

        for(var posObj in object[widget.field]){
          if (posObj === "rate"){
            var tempPos =  (object[widget.field][posObj] !== undefined ? tempPos = object[widget.field][posObj] : 0);
            output += '<div class="entrylabel c_entrylabel_pos w50">' + posObj + '</div><input class="auth_xy"';
            output += utils.buildFnString('window.author.updateItem', [object.id, 'object', 'position.'+posObj], true);
            output += 'type="number" value=' + object.position.rate + ' />' + '<br>';
          }else{
            var tempPos = {x:Math.floor(authorData.settings.canvaswidth/2), y:Math.floor(authorData.settings.canvasheight/2)};
            var hasXY = false;
            var enable = true;
            if (object[widget.field][posObj] !== undefined){
              tempPos = object[widget.field][posObj];
              hasXY = true;
              enable = false;
            }
            var goPos = false;
            if (object.parent === undefined || object.parent === {id: undefined}) {
               goPos = true;
            }

            if (posObj === "current" && !goPos) {hasXY = false; enable=false;}
            if (posObj === "offset" && goPos) {hasXY = false; enable=false;}
            output += '<div class="entrylabel c_entrylabel_pos w100">' + posObj + '</div><span ' +  (hasXY ? "" : 'style="display:none"') + '>';
            output += ' <span class="entrytitle c_entrylabel_pos">X</span> <input class="auth_xy" ';
            output += utils.buildFnString('window.author.updateItem', [object.id, 'object', 'position.'+posObj+'.x'], true);
            output += 'type="number" value=' + tempPos.x + ' />';
            output += ' <span class="entrytitle c_entrylabel_pos">Y</span> <input class="auth_xy" ';
            output += utils.buildFnString('window.author.updateItem', [object.id, 'object', 'position.'+posObj+'.y'], true);
            output += 'type="number" value=' + tempPos.y + ' />';
            if (posObj !== 'current' && posObj !== 'offset') output += '<div class ="divbutton" onclick="window.author.reload()">Disable</div>'
            output += '</span>'
            if (enable) output += '<div class ="divbutton" onclick="window.author.createPosXY(\''+object.id+'\',\'destination\')">Enable</div>'
            output += '<br>';
          }
        }
        output += '<div class ="divbutton" onclick="window.author.reload()">Add position</div>'
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
        var hasDestination = false;
        var hasRate        = false;
        var hasOffset      = false;
        for(var scaleObj in object[widget.field]){
          if (scaleObj === "destination") hasDestination = true;
          if (scaleObj === "rate")        hasRate        = true;
          if (scaleObj === "offset")      hasOffset      = true;
        }
        if (object.parent !== undefined && !hasOffset) object[widget.field].offset = object[widget.field].current;
        if (!hasDestination) object[widget.field].destination = undefined;
        if (!hasRate) object[widget.field].rate = 0;

        for (var scaleObj in object[widget.field]){
          if (scaleObj === "rate"){
            var tempScale =  (object[widget.field][scaleObj] !== undefined ? tempScale = object[widget.field][scaleObj] : 0);
            output += '<div class="entrylabel c_entrylabel_pos w50">' + scaleObj + '</div><input class="auth_xy"';
            output += utils.buildFnString('window.author.updateItem', [object.id, 'object', 'scale.'+scaleObj], true);
            output += 'type="number" value=' + object.scale.rate + ' />' + '<br>';
          }else{
            var tempScale = 1;
            var hasScale = false;
            if (object[widget.field][scaleObj] !== undefined){
              tempScale = object[widget.field][scaleObj];
              hasScale = true;
            }
            output += '<div class="entrylabel c_entrylabel_pos w100">' + scaleObj + '</div><span ' +  (hasScale ? "" : 'style="display:none"') + '>';
            output += ' <input class="auth_xy" ';
            output += utils.buildFnString('window.author.updateItem', [object.id, 'object', 'scale.'+scaleObj], true);
            output += 'type="number" value=' +tempScale + ' />';
            if (scaleObj !== 'current')  output += utils.buildDiv('divbutton', 'Disable', 'window.author.reload', []);
            output += '</span>'
            if (!hasScale) output += utils.buildDiv('divbutton', 'Enable', 'window.author.createScale', [object.id, 'destination']);
            output += '<br>';
          }
        }
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
              output += '<div class="actionspacer"></div><div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
              output += utils.buildSelect('window.author.updateActionList',  object.id, "object", actionsList, actobject.type, widget.field+'.'+idx+'.type') + '<br>';

              actionWidgets.forEach(function(subWidget, idxPart){
                var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
                if (subWidget.type === 'bool')    output += utils.handleBoolean(object,    'object', subWidget, widgetPath);
                if (subWidget.type === 'number')  output += utils.handleNumber(object,     'object', subWidget, widgetPath);
                if (subWidget.type === 'objlist') output += handleObjectList(object, 'object', subWidget, widgetPath);
                if (subWidget.type === 'posxy')   output += utils.handlePosition(object,   'object', subWidget, widgetPath);
                if (subWidget.type === 'select')  output += utils.handleSelect(object,     'object', subWidget, widgetPath);
                if (subWidget.type === "text")    output += handleText(object,       'object', subWidget, widgetPath, 'w100');
              });

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
    console.log("wee")
    var str = '';
    var animList = utils.objPartToArr(authorData.anims, "id");
    var defaultId = utils.getSubProp(animation, path);
    str += utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += utils.buildSelect('window.author.updateItem',  animation.id, type, animList, defaultId, path) + '<br>';
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
