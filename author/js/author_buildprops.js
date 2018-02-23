authorLibs.buildProp = {

  get: function(type, id){
    var thisProp = undefined;
    var propName = '';
    if (type === 'layers'){
      thisProp = id;
      propName = authorLibs.authorData.layers[id].name;
    }
    else{
      if (Array.isArray(authorLibs.authorData[type])) {
        thisProp = authorLibs.authorData[type].filter(function(selected){return selected.id === id;})[0];
        if (thisProp !== undefined) propName = thisProp.id;
      }
      else thisProp = id;
    }
    if (thisProp === undefined) return;
    if (thisProp.name === undefined) thisProp.name = thisProp.id;
    else propName = thisProp.name;

    var element = document.getElementById('propertiestitle');
    authorLibs.windows.makeDiv({clearparent:true, parent:element, classes:'proptitle', html:type.charAt(0).toUpperCase()+type.slice(1, -1)+' : '+propName});
    var propUI = document.getElementById("properties");
    //propUI.innerHTML = authorLibs.buildProp['set'+type](thisProp);


    if (type==='anims'){
      var animation = thisProp;
      var output = '<div class="propbody">';

      authorLibs.rules.anim.animdata.widgets.forEach(function(widget, idx, source){
        if (widget.type === "text"){
          output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
          output += '<input class="auth_text '+widget.css+'" type="text" value="'+ animation[widget.field] + '" ';
          output += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [animation.id, 'anim',  widget.field], true);
          output += '><br>';
        }
        if (widget.type === "number")   output += authorLibs.buildProp.handleNumber(animation, 'anim', widget, widget.field);
        if (widget.type === "bool")     output += authorLibs.buildProp.handleBoolean(animation, 'anim', widget, widget.field);
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
              output += '<div class="rightx" onclick="authorLibs.utils.deletetimeline('+"'"+animation.id+"'"+','+idx+')">X</div>' + '<br>';
              output += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
              output += authorLibs.utils.buildSelect(
                {fn:'authorLibs.utils.updateTimeline', object:animation.id, type:"anim", list:timeList, defaultId:actobject.type, path:widget.field+'.'+idx+'.type'}
              ) + '<br>';

              actionWidgets.forEach(function(subWidget, idxPart){
                var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
                if (subWidget.type === 'bool')    output += authorLibs.buildProp.handleBoolean(animation,        'anim', subWidget, widgetPath);
                if (subWidget.type === 'number')  {
                  output += authorLibs.buildProp.handleNumber(animation,   'anim', subWidget, widgetPath);
                }
                if (subWidget.type === 'animlist')   output += authorLibs.buildProp.handleTypeList('anims',     animation, 'anim', subWidget, widgetPath);
                if (subWidget.type === 'anmlist')    output += authorLibs.buildProp.handleTypeList('anims',     animation, 'anim', subWidget, widgetPath);
                if (subWidget.type === "filterlink") output += authorLibs.buildProp.handleLinkSelect(animation, 'anim',    subWidget, widgetPath);
                if (subWidget.type === 'grplist')    output += authorLibs.buildProp.handleTypeList('groups',    animation, 'anim', subWidget, widgetPath);
                if (subWidget.type === 'laylist')    output += authorLibs.buildProp.handleTypeList('layers',    animation, 'anim', subWidget, widgetPath);
                if (subWidget.type === 'objlist')    output += authorLibs.buildProp.handleTypeList('objects',   animation, 'anim', subWidget, widgetPath);
                if (subWidget.type === 'parlist')    output += authorLibs.buildProp.handleTypeList('particles', animation, 'anim', subWidget, widgetPath);
                if (subWidget.type === 'posxy')      output += authorLibs.buildProp.handlePosition(animation,   'anim',    subWidget, widgetPath);
                if (subWidget.type === 'select')     output += authorLibs.buildProp.handleSelect(animation,     'anim',    subWidget, widgetPath);
                if (subWidget.type === 'sndlist')    output += authorLibs.buildProp.handleTypeList('sounds',    animation, 'anim', subWidget, widgetPath);
                if (subWidget.type === "text")       output += authorLibs.buildProp.handleText(animation,      'anim',     subWidget, widgetPath, 'w100');
              });
              output += '</div>';
            });
            output += '<br>';
          }
          output += authorLibs.utils.buildDiv('divbutton', 'Add Command', 'authorLibs.utils.addAnimCommand', [animation.id, widget.field]);
          output += '</div>';
        }
      });
      authorLibs.menus.update('anims');
      propUI.innerHTML = output + '</div>';
    }

    if (type==='constraints'){
      var constraint = thisProp;
      var output = '<div class="propbody">';

      authorLibs.rules.constraint.widgets.forEach(function(widget, idx, source){
        if (widget.type === "text"){
          output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
          output += '<input class="auth_text '+widget.css+'" type="text" value="'+ constraint[widget.field] + '" ';
          output += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [constraint.id, 'constraint',  widget.field], true);
          output += '><br>';
        }
        if (widget.type === "number")   output += authorLibs.buildProp.handleNumber(constraint, 'constraint', widget, widget.field);
        if (widget.type === "bool")     output += authorLibs.buildProp.handleBoolean(constraint, 'constraint', widget, widget.field);
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
                {fn:'authorLibs.utils.updateItem',  object:constraint.id, type:"constraint", list:timeList, defaultId:actobject.type, path:widget.field+'.'+idx+'.type'}
              ) + '<br>';

              actionWidgets.forEach(function(subWidget, idxPart){
                var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
                if (subWidget.type === 'bool')    output += authorLibs.buildProp.handleBoolean(constraint,  'constraint', subWidget, widgetPath);
                if (subWidget.type === 'number')  output += authorLibs.buildProp.handleNumber(constraint,   'constraint', subWidget, widgetPath);
                if (subWidget.type === 'objlist') output += authorLibs.buildProp.handleTypeList('objects',   constraint, 'constraint', subWidget, widgetPath);
                if (subWidget.type === 'grplist') output += authorLibs.buildProp.handleTypeList('groups',    constraint, 'constraint', subWidget, widgetPath);
                if (subWidget.type === 'anmlist') output += authorLibs.buildProp.handleTypeList('anims',     constraint, 'constraint', subWidget, widgetPath);
                if (subWidget.type === 'parlist') output += authorLibs.buildProp.handleTypeList('particles', constraint, 'constraint', subWidget, widgetPath);
                if (subWidget.type === "filterlink") output += authorLibs.buildProp.handleLinkSelect(constraint, 'constraint', subWidget, widgetPath);
                if (subWidget.type === 'sndlist') output += authorLibs.buildProp.handleTypeList('sounds', constraint, 'constraint', subWidget, widgetPath);
                if (subWidget.type === 'posxy')   output += authorLibs.buildProp.handlePosition(constraint, 'constraint', subWidget, widgetPath);
                if (subWidget.type === 'select')  output += authorLibs.buildProp.handleSelect(constraint,   'constraint', subWidget, widgetPath);
                if (subWidget.type === "text")    output += authorLibs.buildProp.handleText(constraint,     'constraint', subWidget, widgetPath, 'w100');
              });
              output += '</div>';
            });
            output += '<br>';
          }
          output += authorLibs.utils.buildDiv('divbutton', 'Add Command', 'authorLibs.utils.addConstraint', [constraint.id, widget.field]);
          output += '</div>';
        }
      });
      authorLibs.menus.update('constraint');
      propUI.innerHTML = output + '</div>';
    }

    if (type==='groups'){
      var group = thisProp;
      var prop = '<div class="propbody">' ;
      prop += '<div class="entrylabel c_entrytitle_text w50">name</div>';
      prop += '<input class="auth_text w200" type="text" ';
      prop += 'value="'+ group.name + '" ';
      prop += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [group.id, 'group', 'name'], true);
      authorLibs.menus.update('groups');
      propUI.innerHTML = prop + '</div>';
    }

    if (type==='images'){
      var image = thisProp;
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
          output += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [image.id, 'image', widget.field], true);
          output += '><br>';
        }
        if (widget.type === "select"){
          output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
          output += authorLibs.utils.buildSelect(
            {fn:'authorLibs.utils.updateItem', object:image.id, type:'image', list:list, defaultId:defaultId, path:'path'}
          ) + '<br>';
        }
        if (widget.type === "number")       output += authorLibs.buildProp.handleNumber(image, 'image', widget, widget.field);
        if (widget.type === "bool")         output += authorLibs.buildProp.handleBoolean(image, 'image', widget, widget.field);
      });
      authorLibs.menus.update('images');
      propUI.innerHTML = output + '</div>';
    }

    if (type==='layers'){
      var idx = thisProp;
      authorLibs.gui.currentLayer = idx;
      var layer = authorLibs.authorData.layers[idx];
      var prop = '<div class="propbody">' ;
      prop += '<div class="entrylabel c_entrytitle_text w50">name</div>';
      prop += '<input class="auth_text w200" type="text" ';
      prop += 'value="'+ layer.name + '" ';
      prop += authorLibs.utils.buildFnString('authorLibs.utils.layerUpdate', [idx, 'name', "value"],  true);
      prop += '</div>';
      prop += '<div class="entrylabel c_entrytitle_text w100">Show';
      prop += '</div><input class="checkbox" type="checkbox" ' + (layer.show ? "checked " : "");
      prop += authorLibs.utils.buildFnString('authorLibs.utils.layerUpdate', [idx, 'show', "boolean"], true);
      authorLibs.menus.update('layers');
      propUI.innerHTML = prop + '</div>';
    }

    if (type==='objects'){
      var object = thisProp;
      var output = '<div class="propbody">' ;
      authorLibs.rules.object[object.type].widgets.forEach(function(widget, idx, source){
        if (widget.type === "actions")    output += authorLibs.buildProp.handleAction(object, 'objects', widget);
        if (widget.type === "bool")       output += authorLibs.buildProp.handleBoolean(object, 'object', widget, widget.field);
        if (widget.type === "color")      output += authorLibs.buildProp.handleColor(object, 'object', widget, widget.field);
        if (widget.type === "grplist")    output += authorLibs.buildProp.handleGroup(object, 'object', widget, widget.field);
        if (widget.type === "imagedata")  output += authorLibs.buildProp.handleImage(object, 'object', widget, widget.field);
        if (widget.type === "filterlink") output += authorLibs.buildProp.handleLinkSelect(object, 'object', widget,  widget.field);
        if (widget.type === "number")     output += authorLibs.buildProp.handleNumber(object, 'object', widget, widget.field);
        if (widget.type === "objlist")    output += authorLibs.buildProp.handleTypeList('objects', object, 'object', widget, widget.field);
        if (widget.type === "posxy")      output += authorLibs.buildProp.handlePosition(object, 'object', widget, widget.field+'.current');
        if (widget.type === "shapelist")  output += authorLibs.buildProp.handleTypeList('shapes', object,  'object', widget, widget.field);
        if (widget.type === "scale")      output += authorLibs.buildProp.handleNumber(object, 'object', widget, widget.field+'.current');
        if (widget.type === "select")     output += authorLibs.buildProp.handleSelect(object, 'object', widget, widget.field);
        if (widget.type === "text")       output += authorLibs.buildProp.handleText(object, 'object', widget, widget.field, 'w100');
      });
      propUI.innerHTML = output + '</div>';
    }

    if (type==='particles'){
      var particle = thisProp;
      var output = '<div class="propbody">' ;
      authorLibs.rules.particle.widgets.forEach(function(widget, idx, source){
        if (widget.type === "bool")       output += authorLibs.buildProp.handleBoolean(particle, 'particle', widget, widget.field);
        if (widget.type === "imagedata")  output += authorLibs.buildProp.handleImage(particle, 'particle', widget, widget.field);
        if (widget.type === "number")     output += authorLibs.buildProp.handleNumber(particle, 'particle', widget, widget.field);
        if (widget.type === "objlist")    output += authorLibs.buildProp.handleTypeList('objects', particle, 'particle', widget, widget.field);
        if (widget.type === "posxy")      output += authorLibs.buildProp.handlePosition(particle, 'particle', widget, widget.field+'.current');
        if (widget.type === "filterlink") output += authorLibs.buildProp.handleLinkSelect(particle, 'particle', widget,  widget.field);
        if (widget.type === "select")     output += authorLibs.buildProp.handleSelect(particle, 'particle', widget, widget.field);
        if (widget.type === "shapelist")  output += authorLibs.buildProp.handleTypeList('shapes', particle,  'particle', widget, widget.field);
        if (widget.type === "text")       output += authorLibs.buildProp.handleText(particle, 'particle', widget, widget.field, 'w100');
      });
      output += " " + particle;
      propUI.innerHTML = output + '</div>';
    }

    if (type==='paths'){
      var path = thisProp;
      var prop = '<div class="propbody">' ;
      prop += '<div class="entrylabel c_entrytitle_text w50">id</div>';
      prop += '<input class="auth_text w200" type="text" ';
      prop += 'value="'+ path.id + '" ';
      prop += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [path.id, 'path', 'id'], true);
      prop += '><br>';
      prop += '<div class="entrylabel c_entrytitle_text w50">url</div>';
      prop += '<input class="auth_text w200" type="text" ';
      prop += 'value="'+ path.url + '" ';
      prop += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [path.id, 'path', 'url'], true);
      prop += '><br>';
      propUI.innerHTML = prop + '</div>';
    }

    if (type==='settings'){
      var id = thisProp;
      var output = '<div class="propbody">';
      var type   = authorLibs.rules.settings[id].type;
      if (type === "bool") output += authorLibs.buildProp.handleBoolSetting({field:"usecache"}, id);
      else {
        output += '<div class="entrylabel c_entrytitle_text w200">'+id+'</div>';
        output += '<input class="auth_text w200" type="'+ type +'" ';
        output += 'value="'+ authorLibs.authorData.settings[id] + '" ';
        output += authorLibs.utils.buildFnString('authorLibs.utils.updateSetting', [id], true);
        output += '><br>';
      }
      propUI.innerHTML = output + '</div>';
    }

    if (type==='shapes'){
      var shape = thisProp;
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
          prop += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [shape.id, 'shape', widget.field], true);
          prop += '><br>';
        }
        if (widget.type === "select"){
          prop += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
          prop += authorLibs.utils.buildSelect(
            {fn:'authorLibs.utils.updateItem', object:shape.id, type:'shape', list:list, defaultId:defaultId, path:'path'}
          ) + '<br>';
        }

        if (widget.type === "number")       prop += authorLibs.buildProp.handleNumber(shape, 'shape', widget, widget.field);
        if (widget.type === "bool")         prop += authorLibs.buildProp.handleBoolean(shape, 'shape', widget, widget.field);
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
        prop += '<div class="deleter" onclick="authorLibs.windows.deleteprop(\'shapes\', \''+thisProp.id+'\', \'drawcode.'+idx+'\')">';
        prop += '<img id="removeshape" src="image/icon_x.png"/></div>';
        if (idx > 0){
          prop += '<div onclick="authorLibs.buildProp.moveprop(\'shapes\', \''+thisProp.id+'\', \'drawcode.'+idx+'\',\''+(idx-1)+'\')">';
          prop += '<img id="removeshape" src="image/icon_move_up.png"/></div>';
        }
        if (idx < thisProp.drawcode.length-1){
          prop += '<div onclick="authorLibs.buildProp.moveprop(\'shapes\', \''+thisProp.id+'\',\'drawcode.'+idx+'\',\''+(idx+1)+'\')">';
          prop += '<img id="removeshape" src="image/icon_move_down.png"/></div>';
        }
        prop += '</div>';
        prop += '<div class="entrylabel c_entrytitle_text w25">'+idx+'</div>';
        var tmpObj = {id:widget.type, field:'type'}
        prop += authorLibs.buildProp.handleSelect(thisProp, 'shape', tmpObj, 'drawcode.' + idx + '.type', drawList);
        var currentDraw = authorLibs.rules.drawcode.filter(function(draw){return draw.type === widget.type})[0];
        currentDraw.widgets.forEach(function(subWidget){
        var widgetPath =  'drawcode' + '.' +  idx + '.' +  subWidget.field ;
        prop += '<div class="propitem">'
        if (subWidget.type === "bool")       prop += authorLibs.buildProp.handleBoolean(thisProp,  'shape', subWidget, widgetPath);
        if (subWidget.type === 'number')     prop += authorLibs.buildProp.handleNumber(thisProp,   'shape', subWidget, widgetPath);
        if (subWidget.type === 'posxy')      prop += authorLibs.buildProp.handlePosition(thisProp, 'shape', subWidget, widgetPath);
        if (subWidget.type === "select")     prop += authorLibs.buildProp.handleSelect(thisProp,   'shape', subWidget, widgetPath);
        if (subWidget.type === "selecttext") prop += authorLibs.buildProp.handleTxtSelect(thisProp, 'shape', subWidget, widgetPath);
        if (subWidget.type === "text")       prop += authorLibs.buildProp.handleText(thisProp,     'shape', subWidget, widgetPath, 'w100');
        prop += '</div>';
        });
        prop += '</div>';
      });
      authorLibs.menus.update('shapes');
      prop += authorLibs.utils.buildDiv('divbutton', 'Add drawcode', 'authorLibs.utils.addDrawcode', [shape.id]);
      propUI.innerHTML = prop + '</div>';
    }

    if (type==='sounds'){
      var sound = thisProp;
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
          output += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [sound.id, 'sound', widget.field], true);
          output += '><br>';
        }
        if (widget.type === "select"){
          output += '<div class="entrylabel c_entrytitle_text w50">'+widget.field+'</div>';
          output += authorLibs.utils.buildSelect(
            {fn:'authorLibs.utils.updateItem', object:sound.id, type:'sound', list:list, defailtId:defaultId, path:'path'}
          ) + '<br>';
        }
        if (widget.type === "number")       output += authorLibs.buildProp.handleNumber(sound, 'sound', widget, widget.field);
        if (widget.type === "bool")         output += authorLibs.buildProp.handleBoolean(sound, 'sound', widget, widget.field);
      });
      authorLibs.menus.update('sounds');
      propUI.innerHTML = output + '</div>';
    }

    if (type==='tests'){
      var test = thisProp;
      var output = '<div class="propbody">' ;
      authorLibs.rules.tests.forEach(function(widget, idx, source){
        if (widget.type === "text")    output += authorLibs.buildProp.handleText(   test, 'test',  widget, widget.field, 'w100');
        if (widget.type === 'bool')    output += authorLibs.buildProp.handleBoolean(test, 'test',  widget, widget.field);
        if (widget.type === "actions") output += authorLibs.buildProp.handleAction( test, 'tests', widget);
        if (widget.type === "tests")   output += authorLibs.buildProp.handleTest(   test, 'tests', widget);
      });
      propUI.innerHTML = output + '</div>';
    }

    if (type==='vars'){
      var thisVar = thisProp;
      var prop = '<div class="propbody">' ;
      prop += '<div class="entrylabel c_entrytitle_text w50">id</div>';
      prop += '<input class="auth_text w200" type="text" ';
      prop += 'value="'+ thisVar.name + '" ';
      prop += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [thisVar.id, 'var', 'name'], true);
      prop += '><br>';
      prop += '<div class="entrylabel c_entrytitle_text w50">value</div>';
      prop += '<input class="auth_text w200" type="number" ';
      prop += 'value="'+ thisVar.value + '" ';
      prop += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [thisVar.id, 'var', 'value'], true);
      prop += '><br>';
      propUI.innerHTML = prop + '</div>';
    }

    authorLibs.menus.updateSelectionWindow(type,id);
  },

  deleteprop: function(type,id,path){
    var obj = authorLibs.authorData[type].filter(function(test){return test.id === id})[0];
    var arr = path.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj.splice(arr[0],1);
    authorLibs.buildProp.get(type, id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  handleAction: function(item, types, widget){
    var go = true;
    if (widget.dependson != undefined) go = item[widget.dependson];
    if (go === undefined || go === false) return '<div><div class="pos_holder w95p"><div class="pos_title">' + widget.display + '</div></div>';
    var str = '';
    var type = types.slice(0, -1);
    var actionsList = [];
    authorLibs.rules.actions.forEach(function(template){actionsList.push({id:template.type, name:template.type})});
    str += '<div><div class="pos_holder w95p"><div class="pos_title">' + widget.display + '</div>';
    if (item[widget.field] !== undefined){
      item[widget.field].forEach(function(itemAct, idx){
        var actionWidgets = authorLibs.rules.actions.filter(function(rType){ return rType.type === itemAct.type});
        if (actionWidgets.length === 0) return;
        actionWidgets = actionWidgets[0].widgets;
        str += '<div class="actionblock">';
        str += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
        str += authorLibs.utils.buildSelect(
          {fn:'authorLibs.utils.updateActionList', object:item.id, type:types, list:actionsList, defaultId:itemAct.type, path:widget.field+'.'+idx+'.type'}
        );
        str += '<div class="rightx" onclick="authorLibs.utils.deleteitem('+"'objects'"+','+"'"+item.id+"'"+','+"'"+widget.field+"',"+idx+')">X</div>' + '<br>';
        actionWidgets.forEach(function(subWidget, idxPart){
          var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
          if (subWidget.type === 'anmlist') str += authorLibs.buildProp.handleTypeList('anims', item, type, subWidget, widgetPath);
          if (subWidget.type === 'bool')    str += authorLibs.buildProp.handleBoolean(item,  type, subWidget, widgetPath);
          if (subWidget.type === "linkedcontent") {
            var filterPath = widgetPath.substr(0, widgetPath.lastIndexOf(".")) + '.' + subWidget['link'] ;
            var defaultId = authorLibs.utils.getSubProp(item, filterPath);
            if (defaultId){
              authorLibs.rules[subWidget.sourcelist][defaultId].widgets.forEach(function(subsub, idxSub){
                var subWidgetPath =  widget.field + '.' +  idx + '.' + subsub.field;
                if (subsub.type === 'objlist')    str += authorLibs.buildProp.handleTypeList('objects',  item, type, subsub, subWidgetPath);
                if (subsub.type === 'varlist')    str += authorLibs.buildProp.handleTypeList('vars', item, type, subsub, subWidgetPath);
                if (subsub.type === 'number')     str += authorLibs.buildProp.handleNumber(item, type, subsub, subWidgetPath);
                if (subsub.type === "filterlink") str += authorLibs.buildProp.handleLinkSelect(item, type, subsub, subWidgetPath);
                if (subsub.type === 'select')     str += authorLibs.buildProp.handleSelect(item, type, subsub, subWidgetPath);
              });
            }
          }
          if (subWidget.type === 'number')     str += authorLibs.buildProp.handleNumber(item, type, subWidget, widgetPath);
          if (subWidget.type === 'objlist')    str += authorLibs.buildProp.handleTypeList('objects', item,   type,  subWidget, widgetPath);
          if (subWidget.type === 'varlist')    str += authorLibs.buildProp.handleTypeList('vars', item,   type,  subWidget, widgetPath);
          if (subWidget.type === 'parlist')    str += authorLibs.buildProp.handleTypeList('particles', item,   type,  subWidget, widgetPath);
          if (subWidget.type === 'posxy')      str += authorLibs.buildProp.handlePosition(item, type, subWidget, widgetPath);
          if (subWidget.type === "filterlink") str += authorLibs.buildProp.handleLinkSelect(item, type, subWidget, widgetPath);
          if (subWidget.type === 'select')     str += authorLibs.buildProp.handleSelect(item, type, subWidget, widgetPath);
          if (subWidget.type === 'sndlist')    str += authorLibs.buildProp.handleTypeList('sounds', item,   type,  subWidget, widgetPath);
          if (subWidget.type === "text")       str += authorLibs.buildProp.handleText(item, type, subWidget, widgetPath, 'w100');
        });
        str += '</div>';
      });
      str += '<br>';
    }
    str += authorLibs.utils.buildDiv('divbutton', 'Add Action', 'authorLibs.utils.addaction', [item.id, types, widget.field]);
    str += '</div>';
    return str;
  },

  moveprop: function(type,id,path,moveto){
    var obj = authorLibs.authorData[type].filter(function(test){return test.id === id})[0];
    var arr = path.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj.splice(moveto, 0, obj.splice(arr[0], 1)[0]);
    authorLibs.buildProp.get(type, id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  handleBoolean: function(object, type, widget, path){
    var display = widget.display === undefined ? widget.field : widget.display;
    var str = '';
    var defaultId = authorLibs.utils.getSubProp(object, path);
    str += '<div class="entrylabel c_entrytitle_text w100">' + display;
    str += '</div><input class="checkbox" type="checkbox" ' + (defaultId ? "checked " : "");
    str += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [object.id, type, path], true) + '><br>';
    return str;
  },

  handleBoolSetting: function( widget, path){
    var display = widget.display === undefined ? widget.field : widget.display;
    var str = '';
    var defaultId = authorLibs.utils.getSubProp('authorLibs.authorData.settings', path);
    str += '<div class="entrylabel c_entrytitle_text w100">' + display;
    str += '</div><input class="checkbox" type="checkbox" ' + (defaultId ? "checked " : "");
    str += authorLibs.utils.buildFnString('authorLibs.utils.updateSettingBool', [path], true) + '><br>';
    return str;
  },

  handleColor: function(object, type, widget, path){
    var str = '';
    if (object[widget.field] === undefined || object[widget.field] === {})object[widget.field] = {current:["rgba(0,0,0,1)"]};
    str += '<div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
    Object.keys(object[widget.field]).forEach(function(colorList){
        object.color[colorList].forEach(function(color,idx){
        str += authorLibs.buildProp.handleText(object, 'object', {field:idx}, widget.field+'.'+colorList+'.'+idx, 'w20');
      })
    });
    str += '</div><br>';
    str += authorLibs.utils.buildDiv('divbutton', 'Add Color', 'authorLibs.utils.addColor', [object.id, widget.field]);
    str += '<br>';
    return str;
  },

  handleGroup: function(object, type, widget, path){
    var groupList = authorLibs.utils.listIdsNames('groups');
    if (object.groups === undefined) object.groups = [];
    var display = widget.display === undefined ? widget.field : widget.display;
    var str = '<div class="grouper"> <div class="grouptitle">Groups:</div>';
    groupList.forEach(function(grp, idx){
      var defaultId = authorLibs.utils.findInGroup(object, grp.id);
      str += '<div class="nosplit"><div class="entrylabel c_entrytitle_text w100">' + grp.name;
      str += '</div><input class="checkbox" type="checkbox" ' + (defaultId > -1 ? "checked " : "");
      str += authorLibs.utils.buildFnString('authorLibs.utils.togglegroup', [object.id, type, path, grp.id], true) + '></div>';
    });
    return str+'</div>';
  },

  handleImage: function(item, type, widget, path){
    str = '';
    var imageList = authorLibs.utils.listIdsNames('images');
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += authorLibs.utils.buildSelect(
      {fn:'authorLibs.utils.updateItem', object:item.id, type:type, list:imageList, defaultId:item[widget.field], path:widget.field}
    ) + '<br>';
    var flipTest = authorLibs.authorData.images.filter(function(img){ return img.id === item.image})[0];
    if (flipTest){
      if(flipTest.atlas){
        str += authorLibs.buildProp.handleNumber(item, type, {field:'atlascell.x'}, 'atlascell.x');
        str += authorLibs.buildProp.handleNumber(item, type, {field:'atlascell.y'}, 'atlascell.y');
      }
    }
    return str;
  },

  handlePosition: function(object, type, widget, path){
    var str = '';
    var pos = {x:authorLibs.utils.getSubProp(object, path+'.x'), y:authorLibs.utils.getSubProp(object, path+'.y')};
    if (pos.x === undefined) pos.x = 0;
    if (pos.y === undefined) pos.y = 0;
    var display = widget.display ? widget.display : widget.field;
    str += authorLibs.utils.buildDiv('entrylabel c_entrylabel_pos w100', display);
    str += '<span>';
    str += '<span class="entrytitle c_entrylabel_pos">X</span>'
    str += '<input class="auth_xy" type="number" value="'+ pos.x + '" ';
    str += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [object.id, type, path+'.x'], true);
    str +=   '>';
    str += '<span class="entrytitle c_entrylabel_pos">Y</span>'
    str += '<input class="auth_xy" type="number" value="'+ pos.y + '" ';
    str += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [object.id, type, path+'.y'], true);
    str +=   '>'  + "</span><br>";
    return str;
  },

  handleTest: function(test, types, widget){
    var str = '';
    var testsList = Object.keys(authorLibs.rules.conditionals);
    var list  = [];
    testsList.forEach(function(item){
      list.push({id:item, name:item});
    });
    str += '<div><div class="pos_holder w95p"><div class="pos_title">' + widget.display + '</div>';
    if (test[widget.field] !== undefined){
      test[widget.field].forEach(function(actobject, idx){
        var actionWidgets = authorLibs.rules.conditionals[actobject.type].widgets;
        if (actionWidgets.length === 0) return;
        str += '<div class="actionblock">';
        str += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
        str += authorLibs.utils.buildSelect(
          {fn:'authorLibs.utils.updateActionList', object:test.id, type:"tests", list:list, defaultId:actobject.type, path:widget.field+'.'+idx+'.type'}
        );
        str += '<div class="rightx" onclick="authorLibs.utils.deleteitem('+"'tests'," +"'"+test.id+"'"+','+"'"+widget.field+"',"+idx+')">X</div>' + '<br>';
        actionWidgets.forEach(function(subWidget, idxPart){
          var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
          if (subWidget.type === 'anmlist') str += authorLibs.buildProp.handleTypeList('anims', test,       'test', subWidget, widgetPath);
          if (subWidget.type === 'bool')    str += authorLibs.utils.handleBoolean(test,  'test', subWidget, widgetPath);
          if (subWidget.type === "linkedcontent") {
            var filterPath = widgetPath.substr(0, widgetPath.lastIndexOf(".")) + '.' + subWidget['link'] ;
            var defaultId = authorLibs.utils.getSubProp(test, filterPath);
            if (defaultId){
              authorLibs.rules[subWidget.sourcelist][defaultId].widgets.forEach(function(subsub, idxSub){
                var subWidgetPath =  widget.field + '.' +  idx + '.' + subsub.field;
                if (subsub.type === 'objlist') str += authorLibs.buildProp.handleTypeList('tests', test, 'test',  subsub, subWidgetPath);
                if (subsub.type === 'varlist') str += authorLibs.buildProp.handleTypeList('vars',  test, 'test',  subsub, subWidgetPath);
                if (subsub.type === 'number')  str += authorLibs.buildProp.handleNumber(  test,   'test', subsub, subWidgetPath);
                if (subsub.type === 'select')  str += authorLibs.buildProp.handleSelect(  test,   'test', subsub, subWidgetPath);
              });
            }
          }
          if (subWidget.type === 'number')  str += authorLibs.buildProp.handleNumber(test,   'test', subWidget, widgetPath);
          if (subWidget.type === 'objlist') str += authorLibs.buildProp.handleTypeList('tests',    test,   'test',  subWidget, widgetPath);
          if (subWidget.type === 'varlist') str += authorLibs.buildProp.handleTypeList('vars',    test,   'test',  subWidget, widgetPath);
          if (subWidget.type === 'parlist') str += authorLibs.buildProp.handleTypeList('particles',  test,   'test',  subWidget, widgetPath);
          if (subWidget.type === 'posxy')   str += authorLibs.buildProp.handlePosition(test, 'test', subWidget, widgetPath);
          if (subWidget.type === 'select')  str += authorLibs.buildProp.handleSelect(test,   'test', subWidget, widgetPath);
          if (subWidget.type === 'sndlist') str += authorLibs.buildProp.handleTypeList('sounds',     test,   'test',  subWidget, widgetPath);
          if (subWidget.type === "text")    str += authorLibs.buildProp.handleText(test,           'test', subWidget, widgetPath, 'w100');
        });
        str += '</div>';
      });
      str += '<br>';
    }
    str += authorLibs.utils.buildDiv('divbutton', 'Add Test', 'authorLibs.utils.addtest', [test.id, 'tests', widget.field]);
    str += '</div>';
    return str;
  },

  handleNumber: function(object, type, widget, path){
    var str = '';
    var num = authorLibs.utils.getSubProp(object, path);
    if (num === undefined) num = 0;
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text w100', (widget.display ? widget.display : widget.field) );
    str += '<input class="auth_xy" type="number" value="'+ num + '" ';
    str += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [object.id, type, path], true);
    str +=   '>'  + "<br>";
    return str;
  },

  handleTypeList: function(filter, object, type, widget, path){
    var str  = '';
    var list = [];
    var defaultId = authorLibs.utils.getSubProp(object, path);
    if (filter === 'layers'){
      authorLibs.authorData.layers.forEach(function(layer, idx){ list.push({name:layer.name, id:layer.id})});
    } else {
      list = authorLibs.utils.listIdsNames(filter);
    }
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += authorLibs.utils.buildSelect(
      {fn:'authorLibs.utils.updateItem', object:object.id, type:type, list:list,  defaultId:defaultId, path:path}
    ) + '<br>';
    return str;
  },

  handleText: function(object, type, widget, path, widthClass){
    var str = '';
    var defaultId = authorLibs.utils.getSubProp(object, path);
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text ' + widthClass, widget.field );
    str += '<input class="auth_text" type="text" value="'+ defaultId + '" ';
    str += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [object.id, type, path], true);
    str +=   '>'  + "<br>";
    return str;
  },

  handleLinkSelect: function(object, type, widget, path){
    var str = '';
    var filterPath = path.substr(0, path.lastIndexOf(".")) + '.' + widget['link'] ;
    var defaultId = authorLibs.utils.getSubProp(object, filterPath);
    if (defaultId === "object")   str += authorLibs.buildProp.handleTypeList('objects',   object,  type, widget, path);
    if (defaultId === "group")    str += authorLibs.buildProp.handleTypeList('groups',    object,  type, widget, path);
    if (defaultId === "particle") str += authorLibs.buildProp.handleTypeList('particles', object,  type, widget, path);
    return str;
  },

  handleSelect: function(object, type, widget, path, list,){
    var str   = '';
    var selOp = (list === undefined ? authorLibs.rules.select[widget.id].list : list);
    var list  = [];
    selOp.forEach(function(item){
      list.push({id:item, name:item});
    });
    var defaultId = authorLibs.utils.getSubProp(object, path);
    var display   = widget.display ? widget.display : widget.field;
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text w100',  display);
    str += authorLibs.utils.buildSelect(
      {fn:'authorLibs.utils.updateItem', object:object.id, type:type, list:list, defaultId:defaultId, path:path}
    ) + '<br>';
    return str;
  },

  handleTxtSelect: function(object, type, widget, path, list){
    var str = '';
    var selOp = (list === undefined ? authorLibs.rules.select[widget.id].list : list);
    var list  = [];
    selOp.forEach(function(item){
      list.push({id:item, name:item});
    });
    var defaultId = authorLibs.utils.getSubProp(object, path);
    var display = widget.display ? widget.display : widget.field;
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text w100',  display);
    str += authorLibs.utils.buildSelect(
      {fn:'authorLibs.utils.updateItem', object:object.id, type:type, list:list, defaultId:defaultId, path:path, text:true}
    ) + '<br>';
    return str;
  }

}
