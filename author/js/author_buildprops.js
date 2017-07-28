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
    var animList = utils.objPartToArr(authorData.anims, "id");

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
              if (subWidget.type === 'objlist') output += utils.handleTypeList('objects',   animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'anmlist') output += utils.handleTypeList('anims',     animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'parlist') output += utils.handleTypeList('particles', animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === "filterlink") {
                var filterPath = widgetPath.substr(0, widgetPath.lastIndexOf(".")) + '.' + subWidget['link'] ;
                var defaultId = utils.getSubProp(animation, filterPath);
                if (defaultId === "object")   output +=  utils.handleTypeList('objects', animation,  'anim', subWidget, widgetPath);
                if (defaultId === "group")    output +="group here"
                if (defaultId === "particle") output += utils.handleTypeList('particles', animation,   'anim', subWidget, widgetPath);
              }

              if (subWidget.type === 'sndlist') output += utils.handleTypeList('sounds', animation,      'anim', subWidget, widgetPath);
              if (subWidget.type === 'posxy')   output += utils.handlePosition(animation, 'anim', subWidget, widgetPath);
              if (subWidget.type === 'select')  output += utils.handleSelect(animation,   'anim', subWidget, widgetPath);
              if (subWidget.type === "text")    output += utils.handleText(animation,           'anim', subWidget, widgetPath, 'w100');
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

  this.groups = function(group){
    var output = '<div class="propbody">';
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
      if (widget.type === "arraystrings") output += '<div class="entrylabel c_entrytitle_text w100">' + widget.field + '</div><input class="auth_text" type="text" value="'+ object[widget.field]+'"><br>';
      if (widget.type === "bool") output += utils.handleBoolean(object, 'object', widget, widget.field);
      if (widget.type === "color"){
        console.log(object, widget.field)
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
      if (widget.type === "imagedata") output += utils.handleImage(object, 'object', widget, widget.field);
      if (widget.type === "number")    output += utils.handleNumber(object, 'object', widget, widget.field);
      if (widget.type === "objlist")   output += utils.handleTypeList('objects', object, 'object', widget, widget.field);
      if (widget.type === "posxy")     output += utils.handlePosition(object, 'object', widget, widget.field+'.current');
      if (widget.type === "shapelist") output += utils.handleTypeList('shapes', object,  'object', widget, widget.field);
      if (widget.type === "scale")     output += utils.handleNumber(object, 'object', widget, widget.field+'.current');
      if (widget.type === "select")    output += utils.handleSelect(object, 'object', widget, widget.field);
      if (widget.type === "text")      output += utils.handleText(object, 'object', widget, widget.field, 'w100');

    });
    return output + '</div>';
  }

  this.particles = function(particle){
    var output = '<div class="propbody">' ;
    window.rules.particle.widgets.forEach(function(widget, idx, source){
      if (widget.type === "text")         output += utils.handleText(particle, 'particle', widget, widget.field, 'w100');
      if (widget.type === "number")       output += utils.handleNumber(particle, 'particle', widget, widget.field);
      if (widget.type === "select")       output += utils.handleSelect(particle, 'particle', widget, widget.field);
      if (widget.type === "arraystrings") output += '<div class="entrylabel c_entrytitle_text w100">' + widget.field + '</div><input class="auth_text" type="text" value="'+ particle[widget.field]+'"><br>';
      if (widget.type === "bool")         output += utils.handleBoolean(particle, 'particle', widget, widget.field);
      if (widget.type === "imagedata")    output += utils.handleImage(particle, 'particle', widget, widget.field);
      if (widget.type === "shapelist")    output += utils.handleTypeList('shapes', particle,  'particle', widget, widget.field);
      if (widget.type === "objlist")      output += utils.handleTypeList('objects', particle, 'particle', widget, widget.field);
      if (widget.type === "posxy")        output += utils.handlePosition(particle, 'particle', widget, widget.field+'.current');
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
    var output = '<div class="propbody">' ;
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
      if (widget.type === "text")    output += utils.handleText(test, 'test', widget, widget.field, 'w100');
      if (widget.type === 'bool')    output += utils.handleBoolean(test,  'test', widget,  widget.field);
      if (widget.type === "actions") output += utils.handleAction(test, 'tests', widget);

      if (widget.type === "tests"){
          var testsList = Object.keys(window.rules.conditionals);
          console.log(testsList);
          output += '<div><div class="pos_holder mw400"><div class="pos_title">' + widget.display + '</div>';
          if (test[widget.field] !== undefined){
            test[widget.field].forEach(function(actobject, idx){
              var actionWidgets = window.rules.actions.filter(function(type){ return type.type === actobject.type});
              if (actionWidgets.length === 0) return;
              actionWidgets = actionWidgets[0].widgets;
              output += '<div class="actionblock">';
              output += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
              output += utils.buildSelect('window.author.updateActionList',  test.id, "tests", actionsList, actobject.type, widget.field+'.'+idx+'.type');
              output += '<div class="rightx" onclick="window.author.deleteaction('+"'"+object.id+"'"+','+"'"+widget.field+"',"+idx+')">X</div>' + '<br>';
              actionWidgets.forEach(function(subWidget, idxPart){
                var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
                if (subWidget.type === 'anmlist') output += utils.handleTypeList('anims', test,       'test', subWidget, widgetPath);
                if (subWidget.type === 'bool')    output += utils.handleBoolean(test,  'test', subWidget, widgetPath);
                if (subWidget.type === "linkedcontent") {
                  var filterPath = widgetPath.substr(0, widgetPath.lastIndexOf(".")) + '.' + subWidget['link'] ;
                  var defaultId = utils.getSubProp(test, filterPath);
                  if (defaultId){
                    window.rules[subWidget.sourcelist][defaultId].widgets.forEach(function(subsub, idxSub){
                      var subWidgetPath =  widget.field + '.' +  idx + '.' + subsub.field;
                      if (subsub.type === 'objlist') output += utils.handleTypeList('tests', test, 'test', subsub, subWidgetPath);
                      if (subsub.type === 'varlist') output += utils.handleTypeList('vars',    test, 'test', subsub, subWidgetPath);
                      if (subsub.type === 'number')  output += utils.handleNumber(test,   'test', subsub, subWidgetPath);
                      if (subsub.type === 'select')  output += utils.handleSelect(test,   'test', subsub, subWidgetPath);
                    });
                  }
                }
                if (subWidget.type === 'number')  output += utils.handleNumber(test,   'test', subWidget, widgetPath);
                if (subWidget.type === 'objlist') output += utils.handleTypeList('tests',    test,   'test',  subWidget, widgetPath);
                if (subWidget.type === 'varlist') output += utils.handleTypeList('vars',    test,   'test',  subWidget, widgetPath);
                if (subWidget.type === 'parlist') output += utils.handleTypeList('particles',  test,   'test',  subWidget, widgetPath);
                if (subWidget.type === 'posxy')   output += utils.handlePosition(test, 'test', subWidget, widgetPath);
                if (subWidget.type === 'select')  output += utils.handleSelect(test,   'test', subWidget, widgetPath);
                if (subWidget.type === 'sndlist') output += utils.handleTypeList('sounds',     test,   'test',  subWidget, widgetPath);
                if (subWidget.type === "text")    output += utils.handleText(test,           'test', subWidget, widgetPath, 'w100');
              });
              output += '</div>';
            });
            output += '<br>';
          }
          output += utils.buildDiv('divbutton', 'Add Test', 'window.author.addtest', [test.id, widget.field]);
          output += '</div>';
      }
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
