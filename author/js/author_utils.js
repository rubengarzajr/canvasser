authorLibs.utils = {
  prePath: function(item){
    var url = item.url;
    if (!item.path) return url;
    preUrl  = authorLibs.authorData.paths.filter(function(selected){return selected.id === item.path;})[0];
    if (!preUrl) return url;
    return preUrl.url + '/' + item.url;
  },

  saveJson:function(){
    var projectElement = document.getElementById('project');
    var fileElement    = document.getElementById('file');
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
        authorLibs.saved.report += xhr.responseText + '<br>';
        authorLibs.saved.count --;
        if (authorLibs.saved.count === 0) authorLibs.utils.saveReport();
      }
    }
    xhr.send(formData);

  },

  saveReport:function(){
    document.getElementById('notice_box').style.display = 'block';
    document.getElementById('notice_title').innerHTML = "Save Status"
    document.getElementById('notice_content').innerHTML = authorLibs.saved.report;
  },

  loadFromPhp:function(funct, all){
    var xhr = new XMLHttpRequest();
    var url = authorLibs.endpoints.projects;
    if (all) url = authorLibs.endpoints.files;
    if (funct === 'loadFile') url = authorLibs.endpoints.files + '?type=json';
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
        authorLibs.utils[funct](JSON.parse(xhr.responseText));
      }
    }
    xhr.send();
  },

  loadFile: function(files){
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
    var filebox = document.getElementById('loaddata');
    filebox.innerHTML = '';
    fileList.forEach(function(item){
      authorLibs.windows.makeDiv({parent:filebox, html:item.project, classes:'load_project'});
      item.files.forEach(function(file){
        authorLibs.windows.makeDiv({parent:filebox, html:file.id, classes:'load_file', click:function(){authorLibs.utils.loadJson(file.url)}});
      });
    });
  },

  fileFromUrl: function(url){
    return url.replace(/^.*[\\\/]/, '');
  },

  refreshfiles: function(files){
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
    fileList.forEach(function(item){
      authorLibs.windows.makeDiv({parent:filebox, html:item.project, classes:'load_project'});
      var subs = ['json','image','sound','html'];
      subs.forEach(function(sub){
        if (item[sub] === undefined) return;
        if (item[sub].length === 0) return;
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

  fileDelete: function(list){
    list.forEach(function(item){
      console.log(item.project+'/'+item.dir+'/'+item.id);
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
    });
  },

  selectProject: function(){
    document.getElementById('uploadbox').style.display = 'block';
  },

  fileUploadPre: function(){
    document.getElementById('uploadbox').style.display = 'none';
    document.getElementById("fileUpload").click();
  },

  fileUpload: function(list){
    console.log(list.srcElement.files);
    document.getElementById('notice_box').style.display = 'block';
    document.getElementById('notice_title').innerHTML   = 'Upload Status';
    document.getElementById('notice_content').innerHTML = '';
    Array.from(list.srcElement.files).forEach(function(file){
      authorLibs.utils.postFile(file);
    });
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

  // postFile: function(file){
  //   var reader = new FileReader();
  //   if (file.type.indexOf('image') !== -1 || file.type.indexOf('audio') !== -1)  reader.readAsDataURL(file);
  //   else reader.readAsText(file, "UTF-8");
  //
  //   reader.onload = function (evt) {
  //
  //     var projectName = document.getElementById('uploadproject').value;
  //     if (projectName === '') return;
  //
  //     var url = authorLibs.endpoints.projects + '/' + projectName + '/files/' + file.name;
  //
  //     var xhr = new XMLHttpRequest();
  //     xhr.open("POST", url, true);
  //     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //     xhr.onreadystatechange = function() {
  //     if(xhr.readyState == 4 && xhr.status == 200) {
  //         var res = JSON.parse(xhr.responseText);
  //         res.forEach(function(item){
  //           document.getElementById('notice_content').innerHTML += item.project + ': ' + item.url + '<br>';
  //         });
  //         authorLibs.utils.loadFromPhp('refreshfiles', true);
  //       }
  //     }
  //
  //     if (evt.target.result !== undefined){
  //       var data =  evt.target.result;
  //       if (file.type.indexOf("image") !== -1 || file.type.indexOf("sound") !== -1); data = data.substring(data.indexOf(",") + 1);
  //       xhr.send("data="+encodeURIComponent(data));
  //     } else xhr.send();
  //   }
  //   reader.onerror = function (evt) {
  //     console.log('error', evt);
  //   }
  //
  // },

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

  loadJson: function(url){
    document.getElementById('loadbox').style.display = 'none';
    authorLibs.utils.requestFile(
      url + '?v="' + Date.now() + '"',
      function(data){
        json = JSON.parse(decodeURIComponent(data));
        restartCanvasser("sample", json, 'string');
      }
    );
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
          str += authorLibs.utils.buildSelect('authorLibs.author.updateActionList',  item.id, types, actionsList, itemAct.type, widget.field+'.'+idx+'.type');
          str += '<div class="rightx" onclick="authorLibs.author.deleteitem('+"'objects'"+','+"'"+item.id+"'"+','+"'"+widget.field+"',"+idx+')">X</div>' + '<br>';
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
      str += authorLibs.utils.buildDiv('divbutton', 'Add Action', 'authorLibs.author.addaction', [item.id, types, widget.field]);
      str += '</div>';
      return str;
  },

  handleBoolean: function(object, type, widget, path){
    var display = widget.display === undefined ? widget.field : widget.display;
    var str = '';
    var defaultId = authorLibs.utils.getSubProp(object, path);
    str += '<div class="entrylabel c_entrytitle_text w100">' + display;
    str += '</div><input class="checkbox" type="checkbox" ' + (defaultId ? "checked " : "");
    str += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [object.id, type, path], true) + '><br>';
    return str;
  },

  handleColor: function(object, type, widget, path){
    console.log("HANDLECOLOR")
    //var display = widget.display === undefined ? widget.field : widget.display;
    var str = '';
    //var defaultId = authorLibs.utils.getSubProp(object, path);

    console.log(object[widget.field])
    if (object[widget.field] === undefined || object[widget.field] === {})object[widget.field] = {current:["rgba[0,0,0,1]"]};
    str += '<div class="pos_holder"><div class="pos_title">' + widget.field + '</div>';
    Object.keys(object[widget.field]).forEach(function(colorList){
        str += '<div class="entrylabel c_entrylabel_pos w100">' + colorList + '</div>';
        object.color[colorList].forEach(function(color,idx){
        str += authorLibs.utils.handleText(object, 'object', {field:idx}, widget.field+'.'+colorList+'.'+idx, 'w20');
      })
    });
    str += '</div><br>';
    return str;
  },

  handleGroup: function(object, type, widget, path){
    var groupList = authorLibs.utils.objPartToArr(authorLibs.authorData.groups, "id");
    if (object.groups === undefined) object.groups = [];
    var display = widget.display === undefined ? widget.field : widget.display;
    var str = '<div class="grouper"> <div class="grouptitle">Groups:</div>';
    groupList.forEach(function(grp, idx){
      var defaultId = authorLibs.utils.findInGroup(object, grp);
      str += '<div class="nosplit"><div class="entrylabel c_entrytitle_text w100">' + grp;
      str += '</div><input class="checkbox" type="checkbox" ' + (defaultId > -1 ? "checked " : "");
      str += authorLibs.utils.buildFnString('authorLibs.author.togglegroup', [object.id, type, path, grp], true) + '></div>';
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
    var imageList = authorLibs.utils.objPartToArr(authorLibs.authorData.images, "id");
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += authorLibs.utils.buildSelect('authorLibs.author.updateItem',  item.id, type, imageList, item[widget.field], widget.field) + '<br>';
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
    str += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [object.id, type, path], true);
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
    str += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [object.id, type, path+'.x'], true);
    str +=   '>';
    str += '<span class="entrytitle c_entrylabel_pos">Y</span>'
    str += '<input class="auth_xy" type="number" value="'+ pos.y + '" ';
    str += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [object.id, type, path+'.y'], true);
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
    str += authorLibs.utils.buildSelect('authorLibs.author.updateItem',  object.id, type, selOp, defaultId, path) + '<br>';
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
        str += authorLibs.utils.buildSelect('authorLibs.author.updateActionList',  test.id, "tests", testsList, actobject.type, widget.field+'.'+idx+'.type');
        str += '<div class="rightx" onclick="authorLibs.author.deleteitem('+"'tests'," +"'"+test.id+"'"+','+"'"+widget.field+"',"+idx+')">X</div>' + '<br>';
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
    str += authorLibs.utils.buildDiv('divbutton', 'Add Test', 'authorLibs.author.addtest', [test.id, 'tests', widget.field]);
    str += '</div>';
    return str;
  },

  handleText: function(object, type, widget, path, widthClass){
    var str = '';
    var defaultId = authorLibs.utils.getSubProp(object, path);
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text ' + widthClass, widget.field );
    str += '<input class="auth_text" type="text" value="'+ defaultId + '" ';
    str += authorLibs.utils.buildFnString('authorLibs.author.updateItem', [object.id, type, path], true);
    str +=   '>'  + "<br>";
    return str;
  },

  handleTypeList: function(filter, object, type, widget, path){
    var str = '';
    var objectList = authorLibs.utils.objPartToArr(authorLibs.authorData[filter], "id");
    var defaultId = authorLibs.utils.getSubProp(object, path);
    str += authorLibs.utils.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += authorLibs.utils.buildSelect('authorLibs.author.updateItem',  object.id, type, objectList, defaultId, path) + '<br>';
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
