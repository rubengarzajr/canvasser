authorLibs.utils = {
  prePath: function(item){
    var url = item.url;
    if (!item.path) return url;
    preUrl  = authorData.paths.filter(function(selected){return selected.id === item.path;})[0];
    if (!preUrl) return url;
    return preUrl.url + '/' + item.url;
  },

  setSubProp: function(obj, desc, val){
    var arr = desc.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj[arr[0]] = (typeof(val) === "boolean" ? val : (isNaN(val) ? val : (val.indexOf(".")==-1)? parseInt(val) : parseFloat(val)));
  },

  getSubProp: function(obj, desc){
    var arr = desc.split(".");
    while(arr.length > 1){
      var isnum = /^\d+$/.test(arr[0]);
      if (isnum) arr[0] = parseInt(arr[0]);
      obj = obj[arr[0]];
      if (obj === undefined) return undefined;
      arr.shift();
    }
    return obj[arr[0]];
  },

  copyObj: function(object, newObj){
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        if (typeof(object[key]) === 'object') {
          if (Array.isArray(object[key])){
            newObj[key] = authorLibs.utils.appendToArray(object[key])
          } else newObj[key] = authorLibs.utils.copyObj(object[key], {});
        } else newObj[key] = object[key] ;
      }
    }
    return newObj
  },

  appendToArray: function(inArray){
    var newArr = []
    inArray.forEach(function(element){
      if (typeof(element) === 'object') {
          if (Array.isArray(element)){
            newArr.push(authorLibs.utils.appendToArray(element))
          } else newArr.push(authorLibs.utils.copyObj(element, {}));
        } else newArr.push(element)
    });
    return newArr;
  },

  buildDiv: function (classes, content, clicker, params){
    var click = ''
    if (clicker !== undefined) {
      click = ' onclick="' + clicker + '(';
      params.forEach(function(param, index){
        click += "'" +  param + "'";
        if (index < params.length-1) click +=',';
      });
      click += ') ";'
    }
    return '<div class="' + classes + '"' + click + '>' + content + '</div>';
  },

  buildFnString: function(fn, params, change){
    var str = (change ? 'onchange=' : '') + '"' + fn + '(this';
    params.forEach(function(pName){
      str += ", '" + pName + "'";
    });
    return str + ')" ';
  },

  buildSelect: function(fn, object, type, list, defaultId, path){
    var out = '<select id="prop_'+path+'" class="sellist"';
    out += authorLibs.utils.buildFnString(fn, [object, type, path], true) + '>';
    var newList = list.slice();
    newList.unshift("---NONE---");
    newList.forEach(function(listObject){
      out += '<option value="'+ listObject + '"'+ (listObject === defaultId ? " selected" : "" )+ '>' + listObject + '</option>';
    });
    out += "</select>";
    return out;
  },

  handleAction: function(item, types, widget){
    var go = true;
    if (widget.dependson != undefined) go = item[widget.dependson];
    if (go === undefined || go === false) return '<div><div class="pos_holder w95p"><div class="pos_title">' + widget.display + '</div></div>';
    var str = '';
    var type = types.slice(0, -1);
    var actionsList = [];
      authorLibs.rules.actions.forEach(function(template){actionsList.push(template.type)});
      str += '<div><div class="pos_holder w95p"><div class="pos_title">' + widget.display + '</div>';
      if (item[widget.field] !== undefined){
        item[widget.field].forEach(function(itemAct, idx){
          var actionWidgets = authorLibs.rules.actions.filter(function(rType){ return rType.type === itemAct.type});
          if (actionWidgets.length === 0) return;
          actionWidgets = actionWidgets[0].widgets;
          str += '<div class="actionblock">';
          str += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
          str += authorLibs.utils.buildSelect('window.author.updateActionList',  item.id, types, actionsList, itemAct.type, widget.field+'.'+idx+'.type');
          str += '<div class="rightx" onclick="window.author.deleteitem('+"'objects'"+','+"'"+item.id+"'"+','+"'"+widget.field+"',"+idx+')">X</div>' + '<br>';
          actionWidgets.forEach(function(subWidget, idxPart){
            var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
            if (subWidget.type === 'anmlist') str += authorLibs.utils.handleTypeList('anims', item, type, subWidget, widgetPath);
            if (subWidget.type === 'bool')    str += authorLibs.utils.handleBoolean(item,  type, subWidget, widgetPath);
            if (subWidget.type === "linkedcontent") {
              var filterPath = widgetPath.substr(0, widgetPath.lastIndexOf(".")) + '.' + subWidget['link'] ;
              var defaultId = authorLibs.utils.getSubProp(item, filterPath);
              if (defaultId){
                authorLibs.rules[subWidget.sourcelist][defaultId].widgets.forEach(function(subsub, idxSub){
                  var subWidgetPath =  widget.field + '.' +  idx + '.' + subsub.field;
                  if (subsub.type === 'objlist') str += authorLibs.utils.handleTypeList('objects',  item, type, subsub, subWidgetPath);
                  if (subsub.type === 'varlist') str += authorLibs.utils.handleTypeList('vars', item, type, subsub, subWidgetPath);
                  if (subsub.type === 'number')  str += authorLibs.utils.handleNumber(item, type, subsub, subWidgetPath);
                  if (subsub.type === "filterlink") str += authorLibs.utils.handleSelectLink(item, type, subsub, subWidgetPath);
                  if (subsub.type === 'select')  str += authorLibs.utils.handleSelect(item, type, subsub, subWidgetPath);
                });
              }
            }
            if (subWidget.type === 'number')  str += authorLibs.utils.handleNumber(item, type, subWidget, widgetPath);
            if (subWidget.type === 'objlist') str += authorLibs.utils.handleTypeList('objects', item,   type,  subWidget, widgetPath);
            if (subWidget.type === 'varlist') str += authorLibs.utils.handleTypeList('vars', item,   type,  subWidget, widgetPath);
            if (subWidget.type === 'parlist') str += authorLibs.utils.handleTypeList('particles', item,   type,  subWidget, widgetPath);
            if (subWidget.type === 'posxy')   str += authorLibs.utils.handlePosition(item, type, subWidget, widgetPath);
            if (subWidget.type === "filterlink") str += authorLibs.utils.handleSelectLink(item, type, subWidget, widgetPath);
            if (subWidget.type === 'select')  str += authorLibs.utils.handleSelect(item, type, subWidget, widgetPath);
            if (subWidget.type === 'sndlist') str += authorLibs.utils.handleTypeList('sounds', item,   type,  subWidget, widgetPath);
            if (subWidget.type === "text")    str += authorLibs.utils.handleText(item, type, subWidget, widgetPath, 'w100');
          });
          str += '</div>';
        });
        str += '<br>';
      }
      str += authorLibs.utils.buildDiv('divbutton', 'Add Action', 'window.author.addaction', [item.id, types, widget.field]);
      str += '</div>';
      return str;
  },

  handleBoolean: function(object, type, widget, path){
    var display = widget.display === undefined ? widget.field : widget.display;
    var str = '';
    var defaultId = authorLibs.utils.getSubProp(object, path);
    str += '<div class="entrylabel c_entrytitle_text w100">' + display;
    str += '</div><input class="checkbox" type="checkbox" ' + (defaultId ? "checked " : "");
    str += authorLibs.utils.buildFnString('window.author.updateItem', [object.id, type, path], true) + '><br>';
    return str;
  },

  handleGroup: function(object, type, widget, path){
    var groupList = authorLibs.utils.objPartToArr(authorData.groups, "id");
    if (object.groups === undefined) object.groups = [];
    var display = widget.display === undefined ? widget.field : widget.display;
    var str = '<div class="grouper"> <div class="grouptitle">Groups:</div>';
    groupList.forEach(function(grp, idx){
      var defaultId = authorLibs.utils.findInGroup(object, grp);
      str += '<div class="nosplit"><div class="entrylabel c_entrytitle_text w100">' + grp;
      str += '</div><input class="checkbox" type="checkbox" ' + (defaultId > -1 ? "checked " : "");
      str += authorLibs.utils.buildFnString('window.author.togglegroup', [object.id, type, path, grp], true) + '></div>';
    });
    return str+'</div>';
  },

  findInGroup: function(item, groupName){
    var index = -1;
    if (item.groups === undefined) return index;
    item.groups.forEach(function(subObj, idx){
      if (subObj.id === groupName) {
        index = idx;
      }
    });
    return index;
  },

  handleImage: function(item, type, widget, path){
    str = '';
    var imageList = authorLibs.utils.objPartToArr(authorData.images, "id");
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += authorLibs.utils.buildSelect('window.author.updateItem',  item.id, type, imageList, item[widget.field], widget.field) + '<br>';
    var flipTest = authorData.images.filter(function(img){ return img.id === item.image})[0];
    if (flipTest){
      if(flipTest.atlas){
        str += authorLibs.utils.handleNumber(item, type, {field:'atlascell.x'}, 'atlascell.x');
        str += authorLibs.utils.handleNumber(item, type, {field:'atlascell.y'}, 'atlascell.y');
      }
    }
    return str;
  },

  handleNumber: function(object, type, widget, path){
    var str = '';
    var num = authorLibs.utils.getSubProp(object, path);
    if (num === undefined) num = 0;
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text w100', (widget.display ? widget.display : widget.field) );
    str += '<input class="auth_xy" type="number" value="'+ num + '" ';
    str += authorLibs.utils.buildFnString('window.author.updateItem', [object.id, type, path], true);
    str +=   '>'  + "<br>";
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
    str += authorLibs.utils.buildFnString('window.author.updateItem', [object.id, type, path+'.x'], true);
    str +=   '>';
    str += '<span class="entrytitle c_entrylabel_pos">Y</span>'
    str += '<input class="auth_xy" type="number" value="'+ pos.y + '" ';
    str += authorLibs.utils.buildFnString('window.author.updateItem', [object.id, type, path+'.y'], true);
    str +=   '>'  + "</span><br>";
    return str;
  },

  handleSelectLink: function(object, type, widget, path){
    var str = '';
    var filterPath = path.substr(0, path.lastIndexOf(".")) + '.' + widget['link'] ;
    var defaultId = authorLibs.utils.getSubProp(object, filterPath);
    if (defaultId === "object")   str += authorLibs.utils.handleTypeList('objects',   object,  type, widget, path);
    if (defaultId === "group")    str += authorLibs.utils.handleTypeList('groups',    object,  type, widget, path);
    if (defaultId === "particle") str += authorLibs.utils.handleTypeList('particles', object,  type, widget, path);
    return str;
  },

  handleSelect: function(object, type, widget, path, list){
    var str = '';
    var selOp = (list === undefined ? authorLibs.rules.select[widget.id].list : list);
    var defaultId = authorLibs.utils.getSubProp(object, path);
    var display = widget.display ? widget.display : widget.field;
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text w100',  display);
    str += authorLibs.utils.buildSelect('window.author.updateItem',  object.id, type, selOp, defaultId, path) + '<br>';
    return str;
  },

  handleTest: function(test, types, widget){
    var str = '';
    var testsList = Object.keys(authorLibs.rules.conditionals);
    str += '<div><div class="pos_holder w95p"><div class="pos_title">' + widget.display + '</div>';
    if (test[widget.field] !== undefined){
      test[widget.field].forEach(function(actobject, idx){
        var actionWidgets = authorLibs.rules.conditionals[actobject.type].widgets;
        if (actionWidgets.length === 0) return;
        str += '<div class="actionblock">';
        str += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
        str += authorLibs.utils.buildSelect('window.author.updateActionList',  test.id, "tests", testsList, actobject.type, widget.field+'.'+idx+'.type');
        str += '<div class="rightx" onclick="window.author.deleteitem('+"'tests'," +"'"+test.id+"'"+','+"'"+widget.field+"',"+idx+')">X</div>' + '<br>';
        actionWidgets.forEach(function(subWidget, idxPart){
          var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
          if (subWidget.type === 'anmlist') str += authorLibs.utils.handleTypeList('anims', test,       'test', subWidget, widgetPath);
          if (subWidget.type === 'bool')    str += authorLibs.utils.handleBoolean(test,  'test', subWidget, widgetPath);
          if (subWidget.type === "linkedcontent") {
            var filterPath = widgetPath.substr(0, widgetPath.lastIndexOf(".")) + '.' + subWidget['link'] ;
            var defaultId = authorLibs.utils.getSubProp(test, filterPath);
            if (defaultId){
              authorLibs.rules[subWidget.sourcelist][defaultId].widgets.forEach(function(subsub, idxSub){
                var subWidgetPath =  widget.field + '.' +  idx + '.' + subsub.field;
                if (subsub.type === 'objlist') str += authorLibs.utils.handleTypeList('tests', test, 'test',  subsub, subWidgetPath);
                if (subsub.type === 'varlist') str += authorLibs.utils.handleTypeList('vars',  test, 'test',  subsub, subWidgetPath);
                if (subsub.type === 'number')  str += authorLibs.utils.handleNumber(  test,   'test', subsub, subWidgetPath);
                if (subsub.type === 'select')  str += authorLibs.utils.handleSelect(  test,   'test', subsub, subWidgetPath);
              });
            }
          }
          if (subWidget.type === 'number')  str += authorLibs.utils.handleNumber(test,   'test', subWidget, widgetPath);
          if (subWidget.type === 'objlist') str += authorLibs.utils.handleTypeList('tests',    test,   'test',  subWidget, widgetPath);
          if (subWidget.type === 'varlist') str += authorLibs.utils.handleTypeList('vars',    test,   'test',  subWidget, widgetPath);
          if (subWidget.type === 'parlist') str += authorLibs.utils.handleTypeList('particles',  test,   'test',  subWidget, widgetPath);
          if (subWidget.type === 'posxy')   str += authorLibs.utils.handlePosition(test, 'test', subWidget, widgetPath);
          if (subWidget.type === 'select')  str += authorLibs.utils.handleSelect(test,   'test', subWidget, widgetPath);
          if (subWidget.type === 'sndlist') str += authorLibs.utils.handleTypeList('sounds',     test,   'test',  subWidget, widgetPath);
          if (subWidget.type === "text")    str += authorLibs.utils.handleText(test,           'test', subWidget, widgetPath, 'w100');
        });
        str += '</div>';
      });
      str += '<br>';
    }
    str += authorLibs.utils.buildDiv('divbutton', 'Add Test', 'window.author.addtest', [test.id, 'tests', widget.field]);
    str += '</div>';
    return str;
  },

  handleText: function(object, type, widget, path, widthClass){
    var str = '';
    var defaultId = authorLibs.utils.getSubProp(object, path);
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text ' + widthClass, widget.field );
    str += '<input class="auth_text" type="text" value="'+ defaultId + '" ';
    str += authorLibs.utils.buildFnString('window.author.updateItem', [object.id, type, path], true);
    str +=   '>'  + "<br>";
    return str;
  },

  handleTypeList: function(filter, object, type, widget, path){
    var str = '';
    var objectList = authorLibs.utils.objPartToArr(authorData[filter], "id");
    var defaultId = authorLibs.utils.getSubProp(object, path);
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += authorLibs.utils.buildSelect('window.author.updateItem',  object.id, type, objectList, defaultId, path) + '<br>';
    return str;
  },

  objPartToArr: function(obj, part){
    var out = [];
    for(var prop in obj){
      out.push(obj[prop][part]);
    }
    return out;
  },

  requestJSON: function(fileNamePath, returnFunction){
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          returnFunction(JSON.parse(xhr.responseText));
        }
        if (xhr.status == 404) console.error("JSON File Load Error: " + xhr.statusText + " " + xhr.readyState);
      }
      xhr.overrideMimeType('application/json');
      xhr.open('GET', fileNamePath, true);
    xhr.send(null);
  },

  requestFile: function(fileNamePath, returnFunction){
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          returnFunction(xhr.responseText);
        }
        if (xhr.status == 404) console.error("File Load Error: " + xhr.statusText + " " + xhr.readyState);
      }
      xhr.open('GET', fileNamePath, true);
    xhr.send(null);
  },

  getVisibleArea: function(){
    return {
      x:window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0,
      y:window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0
    }
  }

}
