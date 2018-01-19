authorLibs.buildProp = {

  getProps: function(type, id){
    var thisProp = undefined;
    if (type === 'layers') thisProp = id;
    else{
      if (Array.isArray(authorLibs.authorData[type])) thisProp = authorLibs.authorData[type].filter(function(selected){return selected.id === id;})[0];
      else thisProp = id;
    }
    if (thisProp === undefined) return;
    if (thisProp.name === undefined) thisProp.name = thisProp.id;
    var titleText = '<div class="proptitle">' + type.charAt(0).toUpperCase() + type.slice(1, -1);
    document.getElementById("propertiestitle").innerHTML = titleText + ' : ' + thisProp.name + '</div>';
    var propUI = document.getElementById("properties");
    propUI.innerHTML = authorLibs.buildProp[type](thisProp);
    authorLibs.menus.updateSelectionWindow(type,id);
  },

  anims: function(animation){
    var output = '<div class="propbody">';

    authorLibs.rules.anim.animdata.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += '<input class="auth_text '+widget.css+'" type="text" value="'+ animation[widget.field] + '" ';
        output += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [animation.id, 'anim',  widget.field], true);
        output += '><br>';
      }
      if (widget.type === "number")   output += authorLibs.utils.handleNumber(animation, 'anim', widget, widget.field);
      if (widget.type === "bool")     output += authorLibs.utils.handleBoolean(animation, 'anim', widget, widget.field);
      if (widget.type === "timelist"){
        var timeList = [];
        authorLibs.rules.anims.forEach(function(template){timeList.push({id:template.type, name:template.type})});
        output += '<div><div class="pos_holder w95p"><div class="pos_title">' + widget.display + '</div>';
        if (animation[widget.field] !== undefined){
          animation[widget.field].forEach(function(actobject, idx){
            var actionWidgets = authorLibs.rules.anims.filter(function(type){ return type.type === actobject.type});
            if (actionWidgets.length === 0) return;
            actionWidgets = actionWidgets[0].widgets;
            output += '<div class="actionblock">';
            output += '<div class="rightx" onclick="authorLibs.author.deletetimeline('+"'"+animation.id+"'"+','+idx+')">X</div>' + '<br>';
            output += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
            output += authorLibs.utils.buildSelect(
              {fn:'authorLibs.author.updateTimeline', object:animation.id, type:"anim", list:timeList, defaultId:actobject.type, path:widget.field+'.'+idx+'.type'}
            ) + '<br>';

            actionWidgets.forEach(function(subWidget, idxPart){
              var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
              if (subWidget.type === 'bool')    output += authorLibs.utils.handleBoolean(animation,        'anim', subWidget, widgetPath);
              if (subWidget.type === 'number')  {
                output += authorLibs.utils.handleNumber(animation,   'anim', subWidget, widgetPath);
              }
              if (subWidget.type === 'objlist')    output += authorLibs.utils.handleTypeList('objects',   animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'animlist')   output += authorLibs.utils.handleTypeList('anims',     animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'grplist')    output += authorLibs.utils.handleTypeList('groups',    animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'anmlist')    output += authorLibs.utils.handleTypeList('anims',     animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'parlist')    output += authorLibs.utils.handleTypeList('particles', animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === "filterlink") output += authorLibs.utils.handleSelectLink(animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'sndlist')    output += authorLibs.utils.handleTypeList('sounds', animation,      'anim', subWidget, widgetPath);
              if (subWidget.type === 'posxy')      output += authorLibs.utils.handlePosition(animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'select')     output += authorLibs.utils.handleSelect(animation,   'anim', subWidget, widgetPath);
              if (subWidget.type === "text")       output += authorLibs.utils.handleText(animation,     'anim', subWidget, widgetPath, 'w100');
            });
            output += '</div>';
          });
          output += '<br>';
        }
        output += authorLibs.utils.buildDiv('divbutton', 'Add Command', 'authorLibs.author.addAnimCommand', [animation.id, widget.field]);
        output += '</div>';
      }
    });
    authorLibs.menus.update('anims');
    return output + '</div>';
  },

  constraints: function(constraint){
    var output = '<div class="propbody">';

    authorLibs.rules.constraint.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += '<input class="auth_text '+widget.css+'" type="text" value="'+ constraint[widget.field] + '" ';
        output += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [constraint.id, 'constraint',  widget.field], true);
        output += '><br>';
      }
      if (widget.type === "number")   output += authorLibs.utils.handleNumber(constraint, 'constraint', widget, widget.field);
      if (widget.type === "bool")     output += authorLibs.utils.handleBoolean(constraint, 'constraint', widget, widget.field);
      if (widget.type === "driverlist"){
        var timeList = [];
        authorLibs.rules.constraint.drivers.forEach(function(template){timeList.push({id:template.type, name:template.type})});
        output += '<div><div class="pos_holder w95p"><div class="pos_title">' + widget.display + '</div>';
        if (constraint[widget.field] !== undefined){
          constraint[widget.field].forEach(function(actobject, idx){
            var actionWidgets = authorLibs.rules.constraint.drivers.filter(function(type){ return type.type === actobject.type});
            if (actionWidgets.length === 0) return;
            actionWidgets = actionWidgets[0].widgets;
            output += '<div class="actionblock">';
            output += '<div class="rightx" onclick="authorLibs.author.deletedriver('+"'"+constraint.id+"'"+','+idx+')">X</div>' + '<br>';
            output += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
            output += authorLibs.utils.buildSelect(
              {fn:'authorLibs.author.updateItem',  object:constraint.id, type:"constraint", list:timeList, defaultId:actobject.type, path:widget.field+'.'+idx+'.type'}
            ) + '<br>';

            actionWidgets.forEach(function(subWidget, idxPart){
              var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
              if (subWidget.type === 'bool')    output += authorLibs.utils.handleBoolean(constraint,  'constraint', subWidget, widgetPath);
              if (subWidget.type === 'number')  output += authorLibs.utils.handleNumber(constraint,   'constraint', subWidget, widgetPath);
              if (subWidget.type === 'objlist') output += authorLibs.utils.handleTypeList('objects',   constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === 'grplist') output += authorLibs.utils.handleTypeList('groups',    constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === 'anmlist') output += authorLibs.utils.handleTypeList('anims',     constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === 'parlist') output += authorLibs.utils.handleTypeList('particles', constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === "filterlink") output += authorLibs.utils.handleSelectLink(constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === 'sndlist') output += authorLibs.utils.handleTypeList('sounds', constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === 'posxy')   output += authorLibs.utils.handlePosition(constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === 'select')  output += authorLibs.utils.handleSelect(constraint,   'constraint', subWidget, widgetPath);
              if (subWidget.type === "text")    output += authorLibs.utils.handleText(constraint,     'constraint', subWidget, widgetPath, 'w100');
            });
            output += '</div>';
          });
          output += '<br>';
        }
        output += authorLibs.utils.buildDiv('divbutton', 'Add Command', 'authorLibs.author.addConstraint', [constraint.id, widget.field]);
        output += '</div>';
      }
    });
    authorLibs.menus.update('constraint');
    return output + '</div>';
  },

  groups: function(group){
    var prop = '<div class="propbody">' ;
    prop += '<div class="entrylabel c_entrytitle_text w50">name</div>';
    prop += '<input class="auth_text w200" type="text" ';
    prop += 'value="'+ group.name + '" ';
    prop += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [group.id, 'group', 'name'], true);
    authorLibs.menus.update('groups');
    return prop + '</div>';
  },

  images: function(image){
    var output = '<div class="propbody">';
    var pathList = authorLibs.utils.objPartToArr(authorLibs.authorData.paths, "id");
    var list  = [];
    pathList.forEach(function(item){
      list.push({id:item, name:item});
    });
    var defaultId = authorLibs.utils.getSubProp(image, 'path');
    authorLibs.rules.image.imagedata.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += '<input class="auth_text w200" type="text" value="'+ image[widget.field] + '" ';
        output += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [image.id, 'image', widget.field], true);
        output += '><br>';
      }
      if (widget.type === "select"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += authorLibs.utils.buildSelect(
          {fn:'authorLibs.author.updateItem', object:image.id, type:'image', list:list, defaultId:defaultId, path:'path'}
        ) + '<br>';
      }
      if (widget.type === "number")       output += authorLibs.utils.handleNumber(image, 'image', widget, widget.field);
      if (widget.type === "bool")         output += authorLibs.utils.handleBoolean(image, 'image', widget, widget.field);
    });
    authorLibs.menus.update('images');
    return output + '</div>';
  },

  layers: function(idx){
    authorLibs.gui.currentLayer = idx;
    var layer = authorLibs.authorData.layers[idx];
    console.log(layer)
    var prop = '<div class="propbody">' ;
    prop += '<div class="entrylabel c_entrytitle_text w50">name</div>';
    prop += '<input class="auth_text w200" type="text" ';
    prop += 'value="'+ layer.name + '" ';
    prop += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [layer.id, 'layer', 'name'], true);
    prop += authorLibs.utils.handleBoolean(layer, 'layer', 'show', 'show');
    authorLibs.menus.update('layers');
    return prop + '</div>';
  },

  objects: function(object){
    var output = '<div class="propbody">' ;
    authorLibs.rules.object[object.type].widgets.forEach(function(widget, idx, source){
      if (widget.type === "actions")    output += authorLibs.utils.handleAction(object, 'objects', widget);
      if (widget.type === "bool")       output += authorLibs.utils.handleBoolean(object, 'object', widget, widget.field);
      if (widget.type === "color")      output += authorLibs.utils.handleColor(object, 'object', widget, widget.field);
      if (widget.type === "grplist")    output += authorLibs.utils.handleGroup(object, 'object', widget, widget.field);
      if (widget.type === "imagedata")  output += authorLibs.utils.handleImage(object, 'object', widget, widget.field);
      if (widget.type === "filterlink") output += authorLibs.utils.handleSelectLink(object, 'object', widget,  widget.field);
      if (widget.type === "number")     output += authorLibs.utils.handleNumber(object, 'object', widget, widget.field);
      if (widget.type === "objlist")    output += authorLibs.utils.handleTypeList('objects', object, 'object', widget, widget.field);
      if (widget.type === "posxy")      output += authorLibs.utils.handlePosition(object, 'object', widget, widget.field+'.current');
      if (widget.type === "shapelist")  output += authorLibs.utils.handleTypeList('shapes', object,  'object', widget, widget.field);
      if (widget.type === "scale")      output += authorLibs.utils.handleNumber(object, 'object', widget, widget.field+'.current');
      if (widget.type === "select")     output += authorLibs.utils.handleSelect(object, 'object', widget, widget.field);
      if (widget.type === "text")       output += authorLibs.utils.handleText(object, 'object', widget, widget.field, 'w100');
    });
    return output + '</div>';
  },

  particles: function(particle){
    var output = '<div class="propbody">' ;
    authorLibs.rules.particle.widgets.forEach(function(widget, idx, source){
      if (widget.type === "bool")       output += authorLibs.utils.handleBoolean(particle, 'particle', widget, widget.field);
      if (widget.type === "imagedata")  output += authorLibs.utils.handleImage(particle, 'particle', widget, widget.field);
      if (widget.type === "number")     output += authorLibs.utils.handleNumber(particle, 'particle', widget, widget.field);
      if (widget.type === "objlist")    output += authorLibs.utils.handleTypeList('objects', particle, 'particle', widget, widget.field);
      if (widget.type === "posxy")      output += authorLibs.utils.handlePosition(particle, 'particle', widget, widget.field+'.current');
      if (widget.type === "filterlink") output += authorLibs.utils.handleSelectLink(particle, 'particle', widget,  widget.field);
      if (widget.type === "select")     output += authorLibs.utils.handleSelect(particle, 'particle', widget, widget.field);
      if (widget.type === "shapelist")  output += authorLibs.utils.handleTypeList('shapes', particle,  'particle', widget, widget.field);
      if (widget.type === "text")       output += authorLibs.utils.handleText(particle, 'particle', widget, widget.field, 'w100');
    });
    output += " " + particle;
    return output + '</div>';
  },

  paths: function(path){
    var prop = '<div class="propbody">' ;
    prop += '<div class="entrylabel c_entrytitle_text w50">id</div>';
    prop += '<input class="auth_text w200" type="text" ';
    prop += 'value="'+ path.id + '" ';
    prop += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [path.id, 'path', 'id'], true);
    prop += '><br>';
    prop += '<div class="entrylabel c_entrytitle_text w50">url</div>';
    prop += '<input class="auth_text w200" type="text" ';
    prop += 'value="'+ path.url + '" ';
    prop += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [path.id, 'path', 'url'], true);
    prop += '><br>';
    return prop + '</div>';
  },

  settings: function(id){
    var output = '<div class="propbody">';
    var type   = authorLibs.rules.settings[id].type;
    if (type === "bool") output += authorLibs.utils.handleBooleanSetting({field:"usecache"}, id);
    else {
      output += '<div class="entrylabel c_entrytitle_text w200">'+id+'</div>';
      output += '<input class="auth_text w200" type="'+ type +'" ';
      output += 'value="'+ authorLibs.authorData.settings[id] + '" ';
      output += authorLibs.utils.buildFnString('authorLibs.author.updateSetting', [id], true);
      output += '><br>';
    }
    return output + '</div>';
  },


  shapes: function(shape){
    var pathList = authorLibs.utils.objPartToArr(authorLibs.authorData.paths, "id");
    var list  = [];
    pathList.forEach(function(item){
      list.push({id:item, name:item});
    });
    var prop = '<div class="propbody">' ;
    authorLibs.rules.shape.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text"){
        prop += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        prop += '<input class="auth_text w200" type="text" value="'+ shape[widget.field] + '" ';
        prop += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [shape.id, 'shape', widget.field], true);
        prop += '><br>';
      }
      if (widget.type === "select"){
        prop += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        prop += authorLibs.utils.buildSelect(
          {fn:'authorLibs.author.updateItem', object:shape.id, type:'shape', list:list, defaultId:defaultId, path:'path'}
        ) + '<br>';
      }

      if (widget.type === "number")       prop += authorLibs.utils.handleNumber(shape, 'shape', widget, widget.field);
      if (widget.type === "bool")         prop += authorLibs.utils.handleBoolean(shape, 'shape', widget, widget.field);
    });

    var drawList = [];
    authorLibs.rules.drawcode.forEach(function(template){drawList.push(template.type)});
    var thisProp = authorLibs.authorData.shapes.filter(function(check){return check.id === shape.id;})[0];
    if (thisProp === undefined) return;

    document.getElementById("propertiestitle").innerHTML ='<div class="proptitle">Shape: ' + shape.id + '</div>';

    if (thisProp.drawcode === undefined) thisProp.drawcode = [];
    thisProp.drawcode.forEach(function(widget, idx, source){
      prop += '<div class="propbox">'
      prop += '<div class="rightfloater">';
      prop += '<div class="deleter" onclick="authorLibs.author.deleteprop(\'shapes\', \''+thisProp.id+'\', \'drawcode.'+idx+'\')">';
      prop += '<img id="removeshape" src="image/icon_x.png"/></div>';
      if (idx > 0){
        prop += '<div onclick="authorLibs.author.moveprop(\'shapes\', \''+thisProp.id+'\', \'drawcode.'+idx+'\',\''+(idx-1)+'\')">';
        prop += '<img id="removeshape" src="image/icon_move_up.png"/></div>';
      }
      if (idx < thisProp.drawcode.length-1){
        prop += '<div onclick="authorLibs.author.moveprop(\'shapes\', \''+thisProp.id+'\',\'drawcode.'+idx+'\',\''+(idx+1)+'\')">';
        prop += '<img id="removeshape" src="image/icon_move_down.png"/></div>';
      }
      prop += '</div>';
      prop += '<div class="entrylabel c_entrytitle_text w25">'+idx+'</div>';
      var tmpObj = {id:widget.type, field:'type'}
      prop += authorLibs.utils.handleSelect(thisProp, 'shape', tmpObj, 'drawcode.' + idx + '.type', drawList);
      var currentDraw = authorLibs.rules.drawcode.filter(function(draw){return draw.type === widget.type})[0];
      currentDraw.widgets.forEach(function(subWidget){
      var widgetPath =  'drawcode' + '.' +  idx + '.' +  subWidget.field ;
      prop += '<div class="propitem">'
      if (subWidget.type === "bool")       prop += authorLibs.utils.handleBoolean(thisProp,  'shape', subWidget, widgetPath);
      if (subWidget.type === 'number')     prop += authorLibs.utils.handleNumber(thisProp,   'shape', subWidget, widgetPath);
      if (subWidget.type === 'posxy')      prop += authorLibs.utils.handlePosition(thisProp, 'shape', subWidget, widgetPath);
      if (subWidget.type === "select")     prop += authorLibs.utils.handleSelect(thisProp,   'shape', subWidget, widgetPath);
      if (subWidget.type === "selecttext") prop += authorLibs.utils.handleSelectText(thisProp, 'shape', subWidget, widgetPath);
      if (subWidget.type === "text")       prop += authorLibs.utils.handleText(thisProp,     'shape', subWidget, widgetPath, 'w100');
      prop += '</div>';
      });
      prop += '</div>';
    });
    authorLibs.menus.update('shapes');
    prop += authorLibs.utils.buildDiv('divbutton', 'Add drawcode', 'authorLibs.author.adddrawcode', [shape.id]);
    return prop + '</div>';
  },

  sounds: function(sound){
    var output = '<div class="propbody">';
    var pathList = authorLibs.utils.objPartToArr(authorLibs.authorData.paths, "id");
    var list  = [];
    pathList.forEach(function(item){
      list.push({id:item, name:item});
    });
    var defaultId = authorLibs.utils.getSubProp(sound, 'path');
    authorLibs.rules.sound.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += '<input class="auth_text w200" type="text" value="'+ sound[widget.field] + '" ';
        output += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [sound.id, 'sound', widget.field], true);
        output += '><br>';
      }
      if (widget.type === "select"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += authorLibs.utils.buildSelect(
          {fn:'authorLibs.author.updateItem', object:sound.id, type:'sound', list:list, defailtId:defaultId, path:'path'}
        ) + '<br>';
      }
      if (widget.type === "number")       output += authorLibs.utils.handleNumber(sound, 'sound', widget, widget.field);
      if (widget.type === "bool")         output += authorLibs.utils.handleBoolean(sound, 'sound', widget, widget.field);
    });
    authorLibs.menus.update('sounds');
    return output + '</div>';
  },

  tests: function(test){
    var output = '<div class="propbody">' ;
    authorLibs.rules.tests.forEach(function(widget, idx, source){
      if (widget.type === "text")    output += authorLibs.utils.handleText(   test, 'test',  widget, widget.field, 'w100');
      if (widget.type === 'bool')    output += authorLibs.utils.handleBoolean(test, 'test',  widget, widget.field);
      if (widget.type === "actions") output += authorLibs.utils.handleAction( test, 'tests', widget);
      if (widget.type === "tests")   output += authorLibs.utils.handleTest(   test, 'tests', widget);
    });
    return output + '</div>';
  },

  vars: function(thisVar){
    var prop = '<div class="propbody">' ;
    prop += '<div class="entrylabel c_entrytitle_text w50">id</div>';
    prop += '<input class="auth_text w200" type="text" ';
    prop += 'value="'+ thisVar.name + '" ';
    prop += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [thisVar.id, 'var', 'name'], true);
    prop += '><br>';
    prop += '<div class="entrylabel c_entrytitle_text w50">value</div>';
    prop += '<input class="auth_text w200" type="number" ';
    prop += 'value="'+ thisVar.value + '" ';
    prop += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [thisVar.id, 'var', 'value'], true);
    prop += '><br>';
    return prop + '</div>';
  }

}
