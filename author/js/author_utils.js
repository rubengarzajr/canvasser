function CanvasserUtils(){

  this.prePath = function(item){
    var url = item.url;
    if (!item.path) return url;
    preUrl  = authorData.paths.filter(function(selected){return selected.id === item.path;})[0];
    if (!preUrl) return url;
    return preUrl.url + '/' + item.url;
  }

  this.setSubProp = function(obj, desc, val){
    var arr = desc.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj[arr[0]] = (typeof(val) === "boolean" ? val : (isNaN(val) ? val : (val.indexOf(".")==-1)? parseInt(val) : parseFloat(val)));
  }

  this.getSubProp = getSubProp;
  function getSubProp(obj, desc){
    var arr = desc.split(".");
    while(arr.length > 1){
      var isnum = /^\d+$/.test(arr[0]);
      if (isnum) arr[0] = parseInt(arr[0]);
      obj = obj[arr[0]];
      if (obj === undefined) return undefined;
      arr.shift();
    }
    return obj[arr[0]];
  }

  this.copyObj = copyObj;
  function copyObj(object, newObj){
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        if (typeof(object[key]) === 'object') {
          if (Array.isArray(object[key])){
            newObj[key] = appendToArray(object[key])
          } else newObj[key] = copyObj(object[key], {});
        } else newObj[key] = object[key] ;
      }
    }
    return newObj
  }

  this.appendToArray = appendToArray;
  function appendToArray(inArray){
    var newArr = []
    inArray.forEach(function(element){
      if (typeof(element) === 'object') {
          if (Array.isArray(element)){
            newArr.push(appendToArray(element))
          } else newArr.push(copyObj(element, {}));
        } else newArr.push(element)
    });
    return newArr;
  }

  this.buildDiv = buildDiv;
  function buildDiv(classes, content, clicker, params){
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
  }

  this.buildFnString = buildFnString;
  function buildFnString(fn, params, change){
    var str = (change ? 'onchange=' : '') + '"' + fn + '(this';
    params.forEach(function(pName){
      str += ", '" + pName + "'";
    });
    return str + ')" ';
  }

  this.buildSelect = buildSelect;
   function buildSelect(fn, object, type, list, defaultId, path){
    var out = '<select id="prop_'+path+'" class="sellist"';
    out += buildFnString(fn, [object, type, path], true) + '>';
    var newList = list.slice();
    newList.unshift("---NONE---");
    newList.forEach(function(listObject){
      out += '<option value="'+ listObject + '"'+ (listObject === defaultId ? " selected" : "" )+ '>' + listObject + '</option>';
    });
    out += "</select>";
    return out;
  }

  this.handleAction = function(item, types, widget){
    var go = true;
    if (widget.dependson != undefined) go = item[widget.dependson];
    if (go === undefined || go === false) return '<div><div class="pos_holder mw400"><div class="pos_title">' + widget.display + '</div></div>';
    var str = '';
    var type = types.slice(0, -1);
    var actionsList = [];
      window.rules.actions.forEach(function(template){actionsList.push(template.type)});
      str += '<div><div class="pos_holder mw400"><div class="pos_title">' + widget.display + '</div>';
      if (item[widget.field] !== undefined){
        item[widget.field].forEach(function(itemAct, idx){
          var actionWidgets = window.rules.actions.filter(function(rType){ return rType.type === itemAct.type});
          if (actionWidgets.length === 0) return;
          actionWidgets = actionWidgets[0].widgets;
          str += '<div class="actionblock">';
          str += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
          str += buildSelect('window.author.updateActionList',  item.id, types, actionsList, itemAct.type, widget.field+'.'+idx+'.type');
          str += '<div class="rightx" onclick="window.author.deleteitem('+"'objects'"+','+"'"+item.id+"'"+','+"'"+widget.field+"',"+idx+')">X</div>' + '<br>';
          actionWidgets.forEach(function(subWidget, idxPart){
            var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
            if (subWidget.type === 'anmlist') str += handleTypeList('anims', item, type, subWidget, widgetPath);
            if (subWidget.type === 'bool')    str += handleBoolean(item,  type, subWidget, widgetPath);
            if (subWidget.type === "linkedcontent") {
              var filterPath = widgetPath.substr(0, widgetPath.lastIndexOf(".")) + '.' + subWidget['link'] ;
              var defaultId = getSubProp(item, filterPath);
              if (defaultId){
                window.rules[subWidget.sourcelist][defaultId].widgets.forEach(function(subsub, idxSub){
                  var subWidgetPath =  widget.field + '.' +  idx + '.' + subsub.field;
                  if (subsub.type === 'objlist') str += handleTypeList('objects',  item, type, subsub, subWidgetPath);
                  if (subsub.type === 'varlist') str += handleTypeList('vars', item, type, subsub, subWidgetPath);
                  if (subsub.type === 'number')  str += handleNumber(item, type, subsub, subWidgetPath);
                  if (subsub.type === "filterlink") str += handleSelectLink(item, type, subsub, subWidgetPath);
                  if (subsub.type === 'select')  str += handleSelect(item, type, subsub, subWidgetPath);
                });
              }
            }
            if (subWidget.type === 'number')  str += handleNumber(item, type, subWidget, widgetPath);
            if (subWidget.type === 'objlist') str += handleTypeList('objects', item,   type,  subWidget, widgetPath);
            if (subWidget.type === 'varlist') str += handleTypeList('vars', item,   type,  subWidget, widgetPath);
            if (subWidget.type === 'parlist') str += handleTypeList('particles', item,   type,  subWidget, widgetPath);
            if (subWidget.type === 'posxy')   str += handlePosition(item, type, subWidget, widgetPath);
            if (subWidget.type === "filterlink") str += handleSelectLink(item, type, subWidget, widgetPath);
            if (subWidget.type === 'select')  str += handleSelect(item, type, subWidget, widgetPath);
            if (subWidget.type === 'sndlist') str += handleTypeList('sounds', item,   type,  subWidget, widgetPath);
            if (subWidget.type === "text")    str += handleText(item, type, subWidget, widgetPath, 'w100');
          });
          str += '</div>';
        });
        str += '<br>';
      }
      str += buildDiv('divbutton', 'Add Action', 'window.author.addaction', [item.id, types, widget.field]);
      str += '</div>';
      return str;
  }

  this.handleBoolean = handleBoolean;
  function handleBoolean(object, type, widget, path){
    var display = widget.display === undefined ? widget.field : widget.display;
    var str = '';
    var defaultId = getSubProp(object, path);
    str += '<div class="entrylabel c_entrytitle_text w100">' + display;
    str += '</div><input class="checkbox" type="checkbox" ' + (defaultId ? "checked " : "");
    str += buildFnString('window.author.updateItem', [object.id, type, path], true) + '><br>';
    return str;
  }

  this.handleGroup = handleGroup;
  function handleGroup(object, type, widget, path){
    var groupList = objPartToArr(authorData.groups, "id");
    if (object.groups === undefined) object.groups = [];
    var display = widget.display === undefined ? widget.field : widget.display;
    var str = '<div class="grouper"> <div class="grouptitle">Groups:</div>';
    groupList.forEach(function(grp, idx){
      var defaultId = findInGroup(object, grp);
      str += '<div class="nosplit"><div class="entrylabel c_entrytitle_text w100">' + grp;
      str += '</div><input class="checkbox" type="checkbox" ' + (defaultId > -1 ? "checked " : "");
      str += buildFnString('window.author.togglegroup', [object.id, type, path, grp], true) + '></div>';
    });
    return str+'</div>';
  }

  //TODO: REDUNDANT ALSO IN author.js
  function findInGroup(item, groupName){
    var index = -1;
    if (item.groups === undefined) return index;
    item.groups.forEach(function(subObj, idx){
      if (subObj.id === groupName) {
        index = idx;
      }
    });
    return index;
  }

  this.handleImage = handleImage;
  function handleImage(item, type, widget, path){
    str = '';
    var imageList = objPartToArr(authorData.images, "id");
    str += buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += buildSelect('window.author.updateItem',  item.id, type, imageList, item[widget.field], widget.field) + '<br>';
    var flipTest = authorData.images.filter(function(img){ return img.id === item.image})[0];
    if (flipTest){
      if(flipTest.atlas){
        str += handleNumber(item, type, {field:'atlascell.x'}, 'atlascell.x');
        str += handleNumber(item, type, {field:'atlascell.y'}, 'atlascell.y');
      }
    }
    return str;
  }

  this.handleNumber = handleNumber;
  function handleNumber(object, type, widget, path){
    var str = '';
    var num = getSubProp(object, path);
    if (num === undefined) num = 0;
    str += buildDiv('entrylabel c_entrytitle_text w100', (widget.display ? widget.display : widget.field) );
    str += '<input class="auth_xy" type="number" value="'+ num + '" ';
    str += buildFnString('window.author.updateItem', [object.id, type, path], true);
    str +=   '>'  + "<br>";
    return str;
  }

  this.handlePosition = handlePosition;
  function handlePosition(object, type, widget, path){
    var str = '';
    var pos = {x:getSubProp(object, path+'.x'), y:getSubProp(object, path+'.y')};
    if (pos.x === undefined) pos.x = 0;
    if (pos.y === undefined) pos.y = 0;
    var display = widget.display ? widget.display : widget.field;
    str += buildDiv('entrylabel c_entrylabel_pos w100', display);
    str += '<span>';
    str += '<span class="entrytitle c_entrylabel_pos">X</span>'
    str += '<input class="auth_xy" type="number" value="'+ pos.x + '" ';
    str += buildFnString('window.author.updateItem', [object.id, type, path+'.x'], true);
    str +=   '>';
    str += '<span class="entrytitle c_entrylabel_pos">Y</span>'
    str += '<input class="auth_xy" type="number" value="'+ pos.y + '" ';
    str += buildFnString('window.author.updateItem', [object.id, type, path+'.y'], true);
    str +=   '>'  + "</span><br>";
    return str;
  }

  this.handleSelectLink = handleSelectLink;
  function handleSelectLink(object, type, widget, path){
    var str = '';
    var filterPath = path.substr(0, path.lastIndexOf(".")) + '.' + widget['link'] ;
    var defaultId = getSubProp(object, filterPath);
    if (defaultId === "object")   str += handleTypeList('objects',   object,  type, widget, path);
    if (defaultId === "group")    str += handleTypeList('groups',    object,  type, widget, path);
    if (defaultId === "particle") str += handleTypeList('particles', object,  type, widget, path);
    return str;
  }

  this.handleSelect = handleSelect;
  function handleSelect(object, type, widget, path, list){
    var str = '';
    var selOp = (list === undefined ? window.rules.select[widget.id].list : list);
    var defaultId = getSubProp(object, path);
    var display = widget.display ? widget.display : widget.field;
    str += buildDiv('entrylabel c_entrytitle_text w100',  display);
    str += buildSelect('window.author.updateItem',  object.id, type, selOp, defaultId, path) + '<br>';
    return str;
  }

  this.handleTest = function(test, types, widget){
    var str = '';
    var testsList = Object.keys(window.rules.conditionals);
    str += '<div><div class="pos_holder mw400"><div class="pos_title">' + widget.display + '</div>';
    if (test[widget.field] !== undefined){
      test[widget.field].forEach(function(actobject, idx){
        var actionWidgets = window.rules.conditionals[actobject.type].widgets;
        if (actionWidgets.length === 0) return;
        str += '<div class="actionblock">';
        str += '<div class="entrylabel c_entrytitle_text w100">' + idx + '</div>';
        str += buildSelect('window.author.updateActionList',  test.id, "tests", testsList, actobject.type, widget.field+'.'+idx+'.type');
        str += '<div class="rightx" onclick="window.author.deleteitem('+"'tests'," +"'"+test.id+"'"+','+"'"+widget.field+"',"+idx+')">X</div>' + '<br>';
        actionWidgets.forEach(function(subWidget, idxPart){
          var widgetPath =  widget.field + '.' +  idx + '.' + actionWidgets[idxPart].field;
          if (subWidget.type === 'anmlist') str += handleTypeList('anims', test,       'test', subWidget, widgetPath);
          if (subWidget.type === 'bool')    str += handleBoolean(test,  'test', subWidget, widgetPath);
          if (subWidget.type === "linkedcontent") {
            var filterPath = widgetPath.substr(0, widgetPath.lastIndexOf(".")) + '.' + subWidget['link'] ;
            var defaultId = utils.getSubProp(test, filterPath);
            if (defaultId){
              window.rules[subWidget.sourcelist][defaultId].widgets.forEach(function(subsub, idxSub){
                var subWidgetPath =  widget.field + '.' +  idx + '.' + subsub.field;
                if (subsub.type === 'objlist') str += handleTypeList('tests', test, 'test',  subsub, subWidgetPath);
                if (subsub.type === 'varlist') str += handleTypeList('vars',  test, 'test',  subsub, subWidgetPath);
                if (subsub.type === 'number')  str += handleNumber(  test,   'test', subsub, subWidgetPath);
                if (subsub.type === 'select')  str += handleSelect(  test,   'test', subsub, subWidgetPath);
              });
            }
          }
          if (subWidget.type === 'number')  str += handleNumber(test,   'test', subWidget, widgetPath);
          if (subWidget.type === 'objlist') str += handleTypeList('tests',    test,   'test',  subWidget, widgetPath);
          if (subWidget.type === 'varlist') str += handleTypeList('vars',    test,   'test',  subWidget, widgetPath);
          if (subWidget.type === 'parlist') str += handleTypeList('particles',  test,   'test',  subWidget, widgetPath);
          if (subWidget.type === 'posxy')   str += handlePosition(test, 'test', subWidget, widgetPath);
          if (subWidget.type === 'select')  str += handleSelect(test,   'test', subWidget, widgetPath);
          if (subWidget.type === 'sndlist') str += handleTypeList('sounds',     test,   'test',  subWidget, widgetPath);
          if (subWidget.type === "text")    str += handleText(test,           'test', subWidget, widgetPath, 'w100');
        });
        str += '</div>';
      });
      str += '<br>';
    }
    str += buildDiv('divbutton', 'Add Test', 'window.author.addtest', [test.id, 'tests', widget.field]);
    str += '</div>';
    return str;
  }

  this.handleText = handleText;
  function handleText(object, type, widget, path, widthClass){
    var str = '';
    var defaultId = getSubProp(object, path);
    str += buildDiv('entrylabel c_entrytitle_text ' + widthClass, widget.field );
    str += '<input class="auth_text" type="text" value="'+ defaultId + '" ';
    str += buildFnString('window.author.updateItem', [object.id, type, path], true);
    str +=   '>'  + "<br>";
    return str;
  }

  this.handleTypeList = handleTypeList;
  function handleTypeList(filter, object, type, widget, path){
    var str = '';
    var objectList = objPartToArr(authorData[filter], "id");
    var defaultId = getSubProp(object, path);
    str += buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += buildSelect('window.author.updateItem',  object.id, type, objectList, defaultId, path) + '<br>';
    return str;
  }

  this.objPartToArr = objPartToArr
  function objPartToArr(obj, part){
    var out = [];
    for(var prop in obj){
      out.push(obj[prop][part]);
    }
    return out;
  }

  this.requestJSON = function(fileNamePath, returnFunction){
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
  }

  this.requestFile = function(fileNamePath, returnFunction){
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          returnFunction(xhr.responseText);
        }
        if (xhr.status == 404) console.error("File Load Error: " + xhr.statusText + " " + xhr.readyState);
      }
      xhr.open('GET', fileNamePath, true);
    xhr.send(null);
  }
}
