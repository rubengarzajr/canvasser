function BuildProp(){
  var utils = new CanvasserUtils();
  var menus = new Menus();


  // TODO: Maybe make all builders into this on build
  function build(type, id){
    var output   = '<div class="propbody">';
    var pathList = utils.objPartToArr(authorData.paths, "id");
    var defaultId = utils.getSubProp(group, 'path');
    window.rules.groups.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += '<input class="auth_text w200" type="text" value="'+ group[widget.field] + '" ';
        output += utils.buildFnString('window.author.updateItem', [group.id, 'group', widget.field], true);
        output += '><br>';
      }
      if (widget.type === "select"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += utils.buildSelect('window.author.updateItem',  group.id, 'group', pathList, defaultId, 'path') + '<br>';
      }
      if (widget.type === "number")       output += utils.handleNumber(group, 'group', widget, widget.field);
      if (widget.type === "bool")         output += utils.handleBoolean(group, 'group', widget, widget.field);
    });
    menus.update('groups');
    return output + '</div>';
  }

  this.anims = function(animation){
    var output = '<div class="propbody">';

    window.rules.anim.animdata.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += '<input class="auth_text '+widget.css+'" type="text" value="'+ animation[widget.field] + '" ';
        output += utils.buildFnString('window.author.updateItem', [animation.id, 'anim',  widget.field], true);
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
              if (subWidget.type === 'objlist')    output += utils.handleTypeList('objects',   animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'grplist')    output += utils.handleTypeList('groups',    animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'anmlist')    output += utils.handleTypeList('anims',     animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'parlist')    output += utils.handleTypeList('particles', animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === "filterlink") output += utils.handleSelectLink(animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'sndlist')    output += utils.handleTypeList('sounds', animation,      'anim', subWidget, widgetPath);
              if (subWidget.type === 'posxy')      output += utils.handlePosition(animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'select')     output += utils.handleSelect(animation,   'anim', subWidget, widgetPath);
              if (subWidget.type === "text")       output += utils.handleText(animation,     'anim', subWidget, widgetPath, 'w100');
            });
            output += '</div>';
          });
          output += '<br>';
        }
        output += utils.buildDiv('divbutton', 'Add Command', 'window.author.addAnimCommand', [animation.id, widget.field]);
        output += '</div>';
      }
    });
    menus.update('anims');
    return output + '</div>';
  }

  this.constraints = function(constraint){
    var output = '<div class="propbody">';
    //var animList = utils.objPartToArr(authorData.anims, "id");

    window.rules.constraint.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += '<input class="auth_text '+widget.css+'" type="text" value="'+ constraint[widget.field] + '" ';
        output += utils.buildFnString('window.author.updateItem', [constraint.id, 'constraint',  widget.field], true);
        output += '><br>';
      }
      if (widget.type === "number")   output += utils.handleNumber(constraint, 'constraint', widget, widget.field);
      if (widget.type === "bool")     output += utils.handleBoolean(constraint, 'constraint', widget, widget.field);
      if (widget.type === "driverlist"){
        var timeList = [];
        window.rules.constraint.drivers.forEach(function(template){timeList.push(template.type)});
        output += '<div><div class="pos_holder mw400"><div class="pos_title">' + widget.display + '</div>';
        if (constraint[widget.field] !== undefined){
          constraint[widget.field].forEach(function(actobject, idx){
            var actionWidgets = window.rules.constraint.drivers.filter(function(type){ return type.type === actobject.type});
            if (actionWidgets.length === 0) return;
            actionWidgets = actionWidgets[0].widgets;
            output += '<div class="actionblock">';
            output += '<div class="rightx" onclick="window.author.deletedriver('+"'"+constraint.id+"'"+','+idx+')">X</div>' + '<br>';
            output += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
            output += utils.buildSelect('window.author.updateItem',  constraint.id, "constraint", timeList, actobject.type, widget.field+'.'+idx+'.type') + '<br>';

            actionWidgets.forEach(function(subWidget, idxPart){
              var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
              if (subWidget.type === 'bool')    output += utils.handleBoolean(constraint,  'constraint', subWidget, widgetPath);
              if (subWidget.type === 'number')  output += utils.handleNumber(constraint,   'constraint', subWidget, widgetPath);
              if (subWidget.type === 'objlist') output += utils.handleTypeList('objects',   constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === 'grplist') output += utils.handleTypeList('groups',    constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === 'anmlist') output += utils.handleTypeList('anims',     constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === 'parlist') output += utils.handleTypeList('particles', constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === "filterlink") output += utils.handleSelectLink(constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === 'sndlist') output += utils.handleTypeList('sounds', constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === 'posxy')   output += utils.handlePosition(constraint, 'constraint', subWidget, widgetPath);
              if (subWidget.type === 'select')  output += utils.handleSelect(constraint,   'constraint', subWidget, widgetPath);
              if (subWidget.type === "text")    output += utils.handleText(constraint,     'constraint', subWidget, widgetPath, 'w100');
            });
            output += '</div>';
          });
          output += '<br>';
        }
        output += utils.buildDiv('divbutton', 'Add Command', 'window.author.addConstraint', [constraint.id, widget.field]);
        output += '</div>';
      }
    });
    menus.update('constraint');
    return output + '</div>';
  }

  this.groups = function(group){
    var prop = '<div class="propbody">' ;
    prop += '<div class="entrylabel c_entrytitle_text w50">id</div>';
    prop += '<input class="auth_text w200" type="text" ';
    prop += 'value="'+ group.id + '" ';
    prop += utils.buildFnString('window.author.updateItem', [group.id, 'group', 'id'], true);
    menus.update('groups');
    return prop + '</div>';
  }

  this.images = function(image){
    var output = '<div class="propbody">';
    var pathList = utils.objPartToArr(authorData.paths, "id");
    var defaultId = utils.getSubProp(image, 'path');
    window.rules.image.imagedata.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += '<input class="auth_text w200" type="text" value="'+ image[widget.field] + '" ';
        output += utils.buildFnString('window.author.updateItem', [image.id, 'image', widget.field], true);
        output += '><br>';
      }
      if (widget.type === "select"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += utils.buildSelect('window.author.updateItem',  image.id, 'image', pathList, defaultId, 'path') + '<br>';
      }
      if (widget.type === "number")       output += utils.handleNumber(image, 'image', widget, widget.field);
      if (widget.type === "bool")         output += utils.handleBoolean(image, 'image', widget, widget.field);
    });
    menus.update('images');
    return output + '</div>';
  }

  this.objects = function(object){
    var output = '<div class="propbody">' ;
    window.rules.object[object.type].widgets.forEach(function(widget, idx, source){
      if (widget.type === "actions") output += utils.handleAction(object, 'objects', widget);
      if (widget.type === "bool") output += utils.handleBoolean(object, 'object', widget, widget.field);
      if (widget.type === "color"){
        if (object[widget.field] === undefined)object[widget.field] = {};
        output += '<div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
        Object.keys(object[widget.field]).forEach(function(colorList){
            output += '<div class="entrylabel c_entrylabel_pos w100">' + colorList + '</div>';
            object.color[colorList].forEach(function(color,idx){
            output += utils.handleText(object, 'object', {field:idx}, widget.field+'.'+colorList+'.'+idx, 'w20');
          })
        });
        output += '</div><br>';
      }
      if (widget.type === "grplist")    output += utils.handleGroup(object, 'object', widget, widget.field);
      if (widget.type === "imagedata")  output += utils.handleImage(object, 'object', widget, widget.field);
      if (widget.type === "filterlink") output += utils.handleSelectLink(object, 'object', widget,  widget.field);
      if (widget.type === "number")     output += utils.handleNumber(object, 'object', widget, widget.field);
      if (widget.type === "objlist")    output += utils.handleTypeList('objects', object, 'object', widget, widget.field);
      if (widget.type === "posxy")      output += utils.handlePosition(object, 'object', widget, widget.field+'.current');
      if (widget.type === "shapelist")  output += utils.handleTypeList('shapes', object,  'object', widget, widget.field);
      if (widget.type === "scale")      output += utils.handleNumber(object, 'object', widget, widget.field+'.current');
      if (widget.type === "select")     output += utils.handleSelect(object, 'object', widget, widget.field);
      if (widget.type === "text")       output += utils.handleText(object, 'object', widget, widget.field, 'w100');

    });
    return output + '</div>';
  }

  this.particles = function(particle){
    var output = '<div class="propbody">' ;
    window.rules.particle.widgets.forEach(function(widget, idx, source){

      if (widget.type === "bool")       output += utils.handleBoolean(particle, 'particle', widget, widget.field);
      if (widget.type === "imagedata")  output += utils.handleImage(particle, 'particle', widget, widget.field);
      if (widget.type === "number")     output += utils.handleNumber(particle, 'particle', widget, widget.field);
      if (widget.type === "objlist")    output += utils.handleTypeList('objects', particle, 'particle', widget, widget.field);
      if (widget.type === "posxy")      output += utils.handlePosition(particle, 'particle', widget, widget.field+'.current');
      if (widget.type === "filterlink") output += utils.handleSelectLink(particle, 'particle', widget,  widget.field);
      if (widget.type === "select")     output += utils.handleSelect(particle, 'particle', widget, widget.field);
      if (widget.type === "shapelist")  output += utils.handleTypeList('shapes', particle,  'particle', widget, widget.field);
      if (widget.type === "text")       output += utils.handleText(particle, 'particle', widget, widget.field, 'w100');
    });
    output += " " + particle;
    return output + '</div>';
  }

  this.paths = function(path){
    var prop = '<div class="propbody">' ;
    prop += '<div class="entrylabel c_entrytitle_text w50">id</div>';
    prop += '<input class="auth_text w200" type="text" ';
    prop += 'value="'+ path.id + '" ';
    prop += utils.buildFnString('window.author.updateItem', [path.id, 'path', 'id'], true);
    prop += '><br>';
    prop += '<div class="entrylabel c_entrytitle_text w50">url</div>';
    prop += '<input class="auth_text w200" type="text" ';
    prop += 'value="'+ path.url + '" ';
    prop += utils.buildFnString('window.author.updateItem', [path.id, 'path', 'url'], true);
    prop += '><br>';
    return prop + '</div>';
  }

  this.settings = function(id){
    var output = '<div class="propbody">';
    var type   = window.rules.settings[id].type;
    if (type === "bool") output += utils.handleBoolean(authorData.settings, 'setting', {field:"usecache"}, id);
    else {
      output += '<div class="entrylabel c_entrytitle_text w200">'+id+'</div>';
      output += '<input class="auth_text w200" type="'+ type +'" ';
      output += 'value="'+ authorData.settings[id] + '" ';
      output += utils.buildFnString('window.author.updateSetting', [id], true);
      output += '><br>';
    }
    return output + '</div>';
  }


  this.sounds = function(sound){
    var output = '<div class="propbody">';
    var pathList = utils.objPartToArr(authorData.paths, "id");
    var defaultId = utils.getSubProp(sound, 'path');
    window.rules.sound.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += '<input class="auth_text w200" type="text" value="'+ sound[widget.field] + '" ';
        output += utils.buildFnString('window.author.updateItem', [sound.id, 'sound', widget.field], true);
        output += '><br>';
      }
      if (widget.type === "select"){
        output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
        output += utils.buildSelect('window.author.updateItem',  sound.id, 'sound', pathList, defaultId, 'path') + '<br>';
      }
      if (widget.type === "number")       output += utils.handleNumber(sound, 'sound', widget, widget.field);
      if (widget.type === "bool")         output += utils.handleBoolean(sound, 'sound', widget, widget.field);
    });
    menus.update('sounds');
    return output + '</div>';
  }

  this.shapes = function(shape){
    var drawList = [];
    window.rules.drawcode.forEach(function(template){drawList.push(template.type)});
    var thisProp = authorData.shapes.filter(function(check){return check.id === shape.id;})[0];
    if (thisProp === undefined) return;

    document.getElementById("propertiestitle").innerHTML ='<div class="proptitle">Shape: ' + shape.id + '</div>';
    var prop = '<div class="propbody">' ;
    if (thisProp.drawcode === undefined) thisProp.drawcode = [];
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
      if (subWidget.type === "text")      prop += utils.handleText(thisProp,     'shape', subWidget, widgetPath, 'w100');
      prop += '</div>';
      });
      prop += '</div>';
    });
    menus.update('shapes');
    prop += utils.buildDiv('divbutton', 'Add drawcode', 'window.author.adddrawcode', [shape.id]);
    return prop + '</div>';
  }

  this.tests = function(test){
    var output = '<div class="propbody">' ;
    window.rules.tests.forEach(function(widget, idx, source){
      if (widget.type === "text")    output += utils.handleText(   test, 'test',  widget, widget.field, 'w100');
      if (widget.type === 'bool')    output += utils.handleBoolean(test, 'test',  widget, widget.field);
      if (widget.type === "actions") output += utils.handleAction( test, 'tests', widget);
      if (widget.type === "tests")   output += utils.handleTest(   test, 'tests', widget);
    });
    return output + '</div>';
  }

  this.vars = function(thisVar){
    var prop = '<div class="propbody">' ;
    prop += '<div class="entrylabel c_entrytitle_text w50">id</div>';
    prop += '<input class="auth_text w200" type="text" ';
    prop += 'value="'+ thisVar.id + '" ';
    prop += utils.buildFnString('window.author.updateItem', [thisVar.id, 'var', 'id'], true);
    prop += '><br>';
    prop += '<div class="entrylabel c_entrytitle_text w50">value</div>';
    prop += '<input class="auth_text w200" type="number" ';
    prop += 'value="'+ thisVar.value + '" ';
    prop += utils.buildFnString('window.author.updateItem', [thisVar.id, 'var', 'value'], true);
    prop += '><br>';
    return prop + '</div>';
  }
}
