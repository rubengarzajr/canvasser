authorLibs.utils = {

  addaction: function(id, type, listType){
    var objGet = authorLibs.authorData[type].filter(function(finder){return (finder.id === id);});
    if (objGet.length === 0) return;
    if( objGet[0][listType] === undefined)  objGet[0][listType] = [];
    objGet[0][listType].push({"type":"cleardown"});
    authorLibs.buildProp.getProps(type,objGet[0].id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  addAnimCommand: function(animName, timelist){
    var animGet = authorLibs.authorData.anims.filter(function(finder){return (finder.id === animName);});
    if (animGet.length === 0) return;
    animGet[0][timelist].push({"type":"console"});
    authorLibs.buildProp.getProps("anims",animName);
  },

  addColor: function(id, widget){
    var obj = authorLibs.authorData.objects.filter(function(object){ return object.id === id})[0];
    if (obj.color === undefined) obj.color = {current:["rgba(0,0,0,1)"]};
    obj.color.current.push("rgba(0,0,0,1)");
    authorLibs.author.getProps('objects',id);
  },

  addConstraint: function(constraintName, driverlist){
    var driver = authorLibs.authorData.constraints.filter(function(finder){return (finder.id === constraintName);});
    if (driver.length === 0) return;
    driver[0][driverlist].push({"type":"position"});
    authorLibs.buildProp.getProps("constraints", constraintName);
  },

  addDrawcode: function(id){
    var shape = authorLibs.authorData.shapes.filter(function(shape){ return shape.id === id;})[0];
    shape.drawcode.push({type:'fill'});
    authorLibs.buildProp.getProps('shapes', id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  addtest: function(id, type, listType){
    var objGet = authorLibs.authorData[type].filter(function(finder){return (finder.id === id);});
    if (objGet.length === 0) return;
    if( objGet[0][listType] === undefined)  objGet[0][listType] = [];
    objGet[0][listType].push({"type":"var"});
    authorLibs.buildProp.getProps(type,objGet[0].id);
    restartCanvasser("sample", authorLibs.authorData, "string");
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

  buildSelect: function(obj){
    var out = '';
    if (obj.text){
      out = '<input type:"text" id="prop_'+obj.path+'" class="sellist" value="'+obj.defaultId+'" list="datalist_'+obj.path+'"';
      out += authorLibs.utils.buildFnString(obj.fn, [obj.object, obj.type, obj.path], true) + '>';
      out += '<datalist id="datalist_'+obj.path+'">';
      var newList = obj.list.slice();
      newList.unshift("---NONE---");
      newList.forEach(function(listObject){
        out += '<option>' + listObject + '</option>';
      });
      out += "</datalist>";
      return out;
    } else {
      out = '<select id="prop_'+obj.path+'" class="sellist"';
      out += authorLibs.utils.buildFnString(obj.fn, [obj.object, obj.type, obj.path], true) + '>';
      var objList  = obj.list.slice();
      objList.unshift({id:"---NONE---", name:"---NONE---"} );
      objList.forEach(function(listObject){
        out += '<option value="'+ listObject.id + '"'+ (listObject.id === obj.defaultId ? " selected" : "" )+ '>' + listObject.name + '</option>';
      });
      out += "</select>";
      return out;
    }
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

  deleteitem: function(type, objName, listType, index){
    var objGet = authorLibs.authorData[type].filter(function(finder){return (finder.id === objName);});
    if (objGet.length === 0) return;
    objGet[0][listType].splice(index,1);
    authorLibs.buildProp.getProps(type,objGet[0].id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  deletetimeline: function(animName, index){
    var animGet = authorLibs.authorData.anims.filter(function(finder){return (finder.id === animName);});
    if (animGet.length === 0) return;
    animGet[0].timelist.splice(index,1);
    authorLibs.buildProp.getProps("anims",animName);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  dragMenuItem: function(event){
    event.dataTransfer.setData("mover", event.target.dataset.type + '_'+ event.target.dataset.layer +'_'+event.target.dataset.idx);
  },

  dropMenuItem: function(event){
    event.preventDefault();
    var mover = event.dataTransfer.getData("mover").split('_');
    var moveTo  = [event.target.dataset.type, event.target.dataset.layer, event.target.dataset.idx];
    if (mover[0] === 'layer' && moveTo[0] === 'layer'){
      if (mover[2] > -1){
        var moveData = authorLibs.authorData.layers[mover[1]].list.splice(mover[2], 1)[0];
        authorLibs.authorData.layers[moveTo[1]].list.splice(moveTo[2], 0, moveData);
        authorLibs.menus.update('layers');
      } else {
        var moveData = authorLibs.authorData.layers.splice(mover[1], 1)[0];
        authorLibs.authorData.layers.splice(moveTo[1], 0, moveData);
        authorLibs.menus.update('layers');
      }
    }
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  dropMenuItemAllow: function(event){
    event.preventDefault();
  },

  fileDelete: function(item){
    var url = authorLibs.endpoints.projects + '/' + item.project + '/files/' + item.id;
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
        authorLibs.utils.loadFromPhp('refreshfiles', true);
      }
    }
    xhr.send();
  },

  fileDeleteGo: function(listName){
    authorLibs.lists[listName].forEach(function(item){
      authorLibs.utils.fileDelete(item);
    });
    authorLibs.lists[listName] = [];
    document.getElementById('delete_box').style.display = "none";
  },

  fileDeleteWin: function(listName){
    document.getElementById('delete_box').style.display = "block";
    var content = document.getElementById('delete_content');

    var output = "Confirm delete:<br>";
    authorLibs.lists[listName].forEach(function(item){
      output += item.id + '<br>';
    });
    content.innerHTML = output;
  },

  fileFromUrl: function(url){
    return url.replace(/^.*[\\\/]/, '');
  },

  fileUploadPre: function(){
    document.getElementById('uploadbox').style.display = 'none';
    document.getElementById("fileUpload").click();
  },

  fileUpload: function(list){
    document.getElementById('notice_box').style.display = 'block';
    document.getElementById('notice_title').innerHTML   = 'Upload Status';
    document.getElementById('notice_content').innerHTML = '';
    Array.from(list.srcElement.files).forEach(function(file){
      authorLibs.utils.postFile(file);
    });
  },

  fillInSaveProject: function(data){
    var list = document.getElementById('datalist_saveproject');
    list.innerHTML = '';

    data.forEach(function(item){
      list.innerHTML += ('<option>' + item + '</option>');
    });
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

  getProjects: function(returnFunction){
    var url = authorLibs.endpoints.projects;
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        returnFunction(JSON.parse(xhr.responseText));
      }
    }
    xhr.send();
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

  getVisibleArea: function(){
    return {
      x:window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0,
      y:window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0
    }
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
          if (subWidget.type === 'anmlist') str += authorLibs.utils.handleTypeList('anims', item, type, subWidget, widgetPath);
          if (subWidget.type === 'bool')    str += authorLibs.utils.handleBoolean(item,  type, subWidget, widgetPath);
          if (subWidget.type === "linkedcontent") {
            var filterPath = widgetPath.substr(0, widgetPath.lastIndexOf(".")) + '.' + subWidget['link'] ;
            var defaultId = authorLibs.utils.getSubProp(item, filterPath);
            if (defaultId){
              authorLibs.rules[subWidget.sourcelist][defaultId].widgets.forEach(function(subsub, idxSub){
                var subWidgetPath =  widget.field + '.' +  idx + '.' + subsub.field;
                if (subsub.type === 'objlist')    str += authorLibs.utils.handleTypeList('objects',  item, type, subsub, subWidgetPath);
                if (subsub.type === 'varlist')    str += authorLibs.utils.handleTypeList('vars', item, type, subsub, subWidgetPath);
                if (subsub.type === 'number')     str += authorLibs.utils.handleNumber(item, type, subsub, subWidgetPath);
                if (subsub.type === "filterlink") str += authorLibs.utils.handleSelectLink(item, type, subsub, subWidgetPath);
                if (subsub.type === 'select')     str += authorLibs.utils.handleSelect(item, type, subsub, subWidgetPath);
              });
            }
          }
          if (subWidget.type === 'number')     str += authorLibs.utils.handleNumber(item, type, subWidget, widgetPath);
          if (subWidget.type === 'objlist')    str += authorLibs.utils.handleTypeList('objects', item,   type,  subWidget, widgetPath);
          if (subWidget.type === 'varlist')    str += authorLibs.utils.handleTypeList('vars', item,   type,  subWidget, widgetPath);
          if (subWidget.type === 'parlist')    str += authorLibs.utils.handleTypeList('particles', item,   type,  subWidget, widgetPath);
          if (subWidget.type === 'posxy')      str += authorLibs.utils.handlePosition(item, type, subWidget, widgetPath);
          if (subWidget.type === "filterlink") str += authorLibs.utils.handleSelectLink(item, type, subWidget, widgetPath);
          if (subWidget.type === 'select')     str += authorLibs.utils.handleSelect(item, type, subWidget, widgetPath);
          if (subWidget.type === 'sndlist')    str += authorLibs.utils.handleTypeList('sounds', item,   type,  subWidget, widgetPath);
          if (subWidget.type === "text")       str += authorLibs.utils.handleText(item, type, subWidget, widgetPath, 'w100');
        });
        str += '</div>';
      });
      str += '<br>';
    }
    str += authorLibs.utils.buildDiv('divbutton', 'Add Action', 'authorLibs.utils.addaction', [item.id, types, widget.field]);
    str += '</div>';
    return str;
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

  handleBooleanSetting: function( widget, path){
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
        str += authorLibs.utils.handleText(object, 'object', {field:idx}, widget.field+'.'+colorList+'.'+idx, 'w20');
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
    str += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [object.id, type, path], true);
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
    str += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [object.id, type, path+'.x'], true);
    str +=   '>';
    str += '<span class="entrytitle c_entrylabel_pos">Y</span>'
    str += '<input class="auth_xy" type="number" value="'+ pos.y + '" ';
    str += authorLibs.utils.buildFnString('authorLibs.utils.updateItem', [object.id, type, path+'.y'], true);
    str +=   '>'  + "</span><br>";
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

  handleSelectLink: function(object, type, widget, path){
    var str = '';
    var filterPath = path.substr(0, path.lastIndexOf(".")) + '.' + widget['link'] ;
    var defaultId = authorLibs.utils.getSubProp(object, filterPath);
    if (defaultId === "object")   str += authorLibs.utils.handleTypeList('objects',   object,  type, widget, path);
    if (defaultId === "group")    str += authorLibs.utils.handleTypeList('groups',    object,  type, widget, path);
    if (defaultId === "particle") str += authorLibs.utils.handleTypeList('particles', object,  type, widget, path);
    return str;
  },

  handleSelectText: function(object, type, widget, path, list){
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
    str += authorLibs.utils.buildDiv('divbutton', 'Add Test', 'authorLibs.utils.addtest', [test.id, 'tests', widget.field]);
    str += '</div>';
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

  layerToggle: function(id, type, prop){
    var item = authorLibs.authorData.layers[id];
    if (prop !== 'expanded'){
      item = authorLibs.authorData[type].filter(function(object){ return object.id === id})[0];
    }
    if (item[prop] !== undefined) item[prop] = !item[prop];
    authorLibs.menus.update('layers');
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  layerUpdate: function(domElement, idx, prop, type){
    var newVal = 0;
    if (type === 'boolean') newVal = domElement.checked;
    if (type === 'btoggle') newVal = !authorLibs.authorData.layers[idx][prop];
    if (type === 'value')   newVal = domElement.value.toString();
    authorLibs.authorData.layers[idx][prop] = newVal;
    authorLibs.menus.update('layers');
    authorLibs.buildProp.getProps('layers', idx);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  listIdsNames: function(filter){
    var idList    = authorLibs.utils.objPartToArr(authorLibs.authorData[filter], "id");
    var nameList  = authorLibs.utils.objPartToArr(authorLibs.authorData[filter], "name");
    var comboList = [];
    for (var i = 0; i < idList.length; i++ ) {
      if (nameList[i] === undefined) nameList[i] = idList[i];
      comboList.push( {id: idList[i], name:nameList[i]});
    }
    return comboList;
  },

  loadDataUpdate: function(){
    var filter = document.getElementById('loaddatafilter').value;
    var filebox = document.getElementById('loaddata');
    filebox.innerHTML = '';
    authorLibs.lists.fileList.forEach(function(item){
      if (item.project.indexOf(filter) < 0) return;
      authorLibs.windows.makeDiv({parent:filebox, html:item.project, classes:'load_project'});
      item.files.forEach(function(file){
        authorLibs.windows.makeDiv({parent:filebox, html:file.id, classes:'load_file', click:function(){authorLibs.utils.loadJson(file.url,item.project, file.id.substring(0, file.id.length - 5))}});
      });
    });
  },

  loadDefault: function(){
    if (!authorLibs.defaultJSONobj)  authorLibs.utils.requestJSON(authorLibs.defaultJSON, function(data){restartCanvasser("sample", data, 'string');});
  },

  loadFilePHP: function(files){
    var fileList = [];
    if (files.length === 0) return;
    document.getElementById('loadbox').style.display = 'block';

    files.forEach(function(file){
      var found = fileList.filter(function(test){return test.project === file.project;});
      var name = authorLibs.utils.fileFromUrl(file.url);
      if (found.length) {
        var foundIdx = fileList.indexOf(found[0]);
        fileList[foundIdx].files.push({id:name,url:file.url});
      } else {
        fileList.push({project:file.project, files:[{id:name,url:file.url}]});
      }
    });

    fileList.sort(function(a,b) {return (a.project > b.project) ? 1 : ((b.project > a.project) ? -1 : 0);} );
    authorLibs.lists.fileList = fileList;
    authorLibs.utils.loadDataUpdate();
  },

  loadFromPhp:function(funct, all){
    var xhr = new XMLHttpRequest();
    var url = authorLibs.endpoints.projects;
    if (all) url = authorLibs.endpoints.files;
    if (funct === 'loadFilePHP') url = authorLibs.endpoints.files + '?type=json';
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
        authorLibs.lists.fileListRaw = JSON.parse(xhr.responseText);
        authorLibs.utils[funct](JSON.parse(xhr.responseText));
      }
    }
    xhr.send();
  },

  loadJson: function(url, project, file){
    document.getElementById('saveproject').value     = project;
    document.getElementById('savefile').value        = file;
    document.getElementById('loadbox').style.display = 'none';
    authorLibs.utils.requestFile(
      url + '?v="' + Date.now() + '"',
      function(data){
        var json = authorLibs.utils.prepJson(JSON.parse(decodeURIComponent(data)));
        restartCanvasser("sample", json, 'string');
      }
    );
  },

  objPartToArr: function(obj, part){
    var out = [];
    for(var prop in obj){
      out.push(obj[prop][part]);
    }
    return out;
  },

  postFile: function(file){
    var projectName = document.getElementById('uploadproject').value;
    if (projectName === '') return;
    var projectName = projectName.toLowerCase().replace(/[^0-9a-z_-]/gi, '-');
    var url         = authorLibs.endpoints.projects + '/' + projectName + '/files';

    var formData    = new FormData();
    formData.append('fileToUpload', file, file.name);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var res = JSON.parse(xhr.responseText);
        res.forEach(function(item){
          document.getElementById('notice_content').innerHTML += item.project + ': ' + item.url + '<br>';
        });
        authorLibs.utils.loadFromPhp('refreshfiles', true);
      }
    }
    xhr.send(formData);
  },

  prePath: function(item){
    var url = item.url;
    if (!item.path) return url;
    preUrl  = authorLibs.authorData.paths.filter(function(selected){return selected.id === item.path;})[0];
    if (!preUrl) return url;
    return preUrl.url + '/' + item.url;
  },

  prepJson: function(json){
    var needNames = ['anims','constraints','groups','images','objects','particles','paths','shapes','sounds','tests','vars'];
    needNames.forEach(function(type){
      if (json[type] === undefined) return;
        json[type].forEach(function(item){
          if (item.name === undefined) item.name = item.id;
        });
    });

    if (json.layers === undefined){
      json.layers = [{name:'layer0', id:authorLibs.utils.uuid(), list:[], show:true, expanded:true}];
      var needOrder = ['objects','particles'];
      needOrder.forEach(function(type){
        if (json[type] === undefined) return;
        json[type].forEach(function(item){
          json.layers[0].list.push({id:item.id, type:type, name:item.name });
        });
      });
    }
    return json;
  },

  refreshfiles: function(){
    var files = authorLibs.lists.fileListRaw;
    if (files === undefined) {
      authorLibs.utils.loadFromPhp('refreshfiles', true);
      return;
    }
    authorLibs.lists.fileManager = [];
    var fileList = [];
    files.forEach(function(file){
      var found = fileList.filter(function(test){return test.project === file.project;});
      var filename = file.url.replace(/^.*[\\\/]/, '');
      if (found.length > 0) {
        var foundIdx = fileList.indexOf(found[0]);
        if (fileList[foundIdx][file.type] === undefined) fileList[foundIdx][file.type] = [];
        fileList[foundIdx][file.type].push({id:filename, url:file.url});
      } else {
        var newList = {project:file.project};
        if (newList[file.type] === undefined) newList[file.type] = [];
        newList[file.type].push({id:filename, url:file.url});
        fileList.push(newList);
      }
    });
    fileList.sort(function(a,b) {return (a.project > b.project) ? 1 : ((b.project > a.project) ? -1 : 0);} );
    document.getElementById('filelist').style.display = 'block';
    var filebox = document.getElementById('filelist');
    filebox.innerHTML = '';
    var fileFilter = document.getElementById('filefilter').value;
    fileList.forEach(function(item){
      if (fileFilter !== '') {
        if (item.project.indexOf(fileFilter) === -1) return;
      }
      authorLibs.windows.makeDiv({parent:filebox, html:item.project, classes:'load_project'});
      var subs = ['json','image','sound','html'];
      subs.forEach(function(sub){
        if (item[sub] === undefined) return;
        if (item[sub].length === 0) return;
        if (!document.getElementById('filemanager_check_'+sub).checked) return;
        console.log()
        authorLibs.windows.makeDiv({parent:filebox, html:sub, classes:'load_filefolder'});

        item[sub].forEach(function(file){
          authorLibs.windows.makeDiv({parent:filebox, html:file.id, classes:'load_file',
            mousedown:function(){
              authorLibs.utils.updateList(this, authorLibs.lists.fileManager, {id:file.id, project:item.project, type:sub, url:file.url})
            },
            mouseenter:function(){
              if (!authorLibs.gui.parentMouseDown) return;
              authorLibs.utils.updateList(this, authorLibs.lists.fileManager, {id:file.id, project:item.project, type:sub, url:file.url})
            }
          });
        });
      });
    });
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

  saveJson:function(){
    var projectElement = document.getElementById('saveproject');
    var fileElement    = document.getElementById('savefile');
    var alertBox       = document.getElementById('alert_box');
    var aData          = document.getElementById('alertdata');
    authorLibs.saved        = {};
    authorLibs.saved.count  = 1;
    authorLibs.saved.report = '';

    if (projectElement.value === '' || fileElement.value === ''){
      alertBox.style.display = 'block';
      aData.innerHTML = 'Please enter a project and file name.'
      return;
    }
    document.getElementById('savebox').style.display = 'none';

    var projectName  = projectElement.value.toLowerCase().replace(/[^0-9a-z_-]/gi, '-');
    var fileName     = fileElement.value.toLowerCase().replace(/[^0-9a-z_-]/gi, '-') + '.json';
    var data         = JSON.stringify(authorLibs.authorData);
    var url          = authorLibs.endpoints.projects + '/' + projectName + '/files';
    var file         = new File([data], fileName);
    var formData = new FormData();
    formData.append('fileToUpload', file, fileName);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onload = function() {
    if (xhr.status === 200) {
        authorLibs.saved.report += xhr.responseText;
        authorLibs.saved.count --;
        if (authorLibs.saved.count === 0) authorLibs.utils.saveReport();
      }
    }
    xhr.send(formData);
  },

  saveReport:function(){
    document.getElementById('notice_box').style.display = 'block';
    document.getElementById('notice_title').innerHTML = "Save Status"
    var report = JSON.parse(authorLibs.saved.report);
    var reportOut = '';
    report.forEach(function(subport){
      for (var key in subport) {
        var obj = subport[key];
          reportOut += key + ": " + obj + '<br>';
      }
      reportOut += '<br>';
    });
    document.getElementById('notice_content').innerHTML = reportOut;
  },

  selectProject: function(){
    document.getElementById('uploadbox').style.display = 'block';
  },

  setSubProp: function(obj, desc, val){
    var arr = desc.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj[arr[0]] = (typeof(val) === "boolean" ? val : (isNaN(val) ? val : (val.indexOf(".")==-1)? parseInt(val) : parseFloat(val)));
  },

  togglegroup: function(domElement, objectId, type, paramPath, groupName){
    var element = domElement.checked;
    var objGet  = authorLibs.authorData[type+'s'].filter(function(finder){return (finder.id === objectId);})[0];
    if (objGet.groups === undefined) objGet.groups = [];

    if (element){
      if (findInGroup(objGet, groupName) === -1) objGet.groups.push({id:groupName});
    } else {
      var splicer = findInGroup(objGet, groupName);
      if (splicer > -1) objGet.groups.splice(splicer, 1);
    }

    authorLibs.menus.update(type);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  updateActionList: function(domElement, objectId, type, paramPath){
    var item = authorLibs.authorData[type].filter(function(finder){return (finder.id === objectId);})[0];
    var prop = authorLibs.utils.getSubProp(item, paramPath);
    authorLibs.utils.updateItem(domElement, objectId, type.slice(0, -1), paramPath);
    var newRule = authorLibs.rules.actions.filter(function(ruleName){
      return ruleName.elementType === domElement.value}
    )[0];

    authorLibs.menus.update('objects');
    authorLibs.buildProp.getProps('objects', objectId);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  updateItem: function(domElement, objectId, type, paramPath){
    var newVal = domElement.value.toString();
    if (domElement.type === 'checkbox') newVal = domElement.checked;
    if (newVal === '---NONE---')        newVal = undefined;
    var objGet = authorLibs.authorData[type+'s'].filter(function(finder){return (finder.id === objectId);})[0];
    authorLibs.utils.setSubProp(objGet, paramPath, newVal);
    authorLibs.buildProp.getProps(type+'s', objGet.id);
    authorLibs.menus.update(type);
    authorLibs.menus.update('layers');
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  updateList:function(element, list, item){
    var finder = list.findIndex(function(check){return check.id === item.id && check.project === item.project && check.url === item.url;});
    if (finder === -1) {
      list.push(item);
      element.style.backgroundColor = 'rgb(97, 255, 55)';
    } else {
      list.splice(finder,1);
      element.style.backgroundColor = 'white';
    }
  },

  updateSetting: function(domElement, setting){
    authorLibs.authorData.settings[setting] = domElement.value;
    authorLibs.menus.update('settings');
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  updateSettingBool: function(domElement, setting){
    authorLibs.authorData.settings[setting] = domElement.checked;
    authorLibs.menus.update('settings');
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  updateTimeline: function(domElement, objectId, type, paramPath){
    var objGet = authorLibs.authorData.anims.filter(function(finder){return (finder.id === objectId);})[0];
    var prop = authorLibs.utils.getSubProp(objGet, paramPath);
    authorLibs.utils.updateItem(domElement, objectId, 'anim', paramPath);
    var newRule = authorLibs.rules.actions.filter(function(ruleName){
      return ruleName.elementType === domElement.value}
    )[0];

    authorLibs.menus.update('objects');
    authorLibs.buildProp.getProps('objects', objectId);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  uuid: function(){
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
     (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
   )
 },

  view: function(){
   document.getElementById("paste").value = JSON.stringify(authorLibs.authorData);
 },

  zPlus: function(){
    authorLibs.gui.zidx ++; return  authorLibs.gui.zidx;
  }

}
