authorLibs.utils = {

  addColor: function(id, widget){
    var obj = authorLibs.authorData.objects.filter(function(object){ return object.id === id})[0];
    if (obj.color === undefined) obj.color = {current:["rgba(0,0,0,1)"]};
    obj.color.current.push("rgba(0,0,0,1)");
    authorLibs.buildProp.get('objects',id);
  },

  addConstraint: function(constraintName, driverlist){
    var driver = authorLibs.authorData.constraints.filter(function(finder){return (finder.id === constraintName);});
    if (driver.length === 0) return;
    driver[0][driverlist].push({"type":"position"});
    authorLibs.buildProp.get("constraints", constraintName);
  },

  addDrawcode: function(id){
    var shape = authorLibs.authorData.shapes.filter(function(shape){ return shape.id === id;})[0];
    shape.drawcode.push({type:'fill'});
    authorLibs.buildProp.get('shapes', id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  addFont: function(id){
    authorLibs.authorData.settings.fontlist.list.push({id:authorLibs.utils.uuid(), type:'href'});
    authorLibs.buildProp.get("settings", 'fontlist');
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

  dateString: function(){
    var d = new Date();
    var ampm = 'AM';
    var hours = d.getHours();
    if (hours > 12){
      hours = hours - 12;
      ampm = 'PM';
    }
    return hours + ":" + d.getMinutes() + ":" + d.getSeconds() +  ampm + ' '
          + d.getFullYear() + '/' + (d.getMonth()+1)  + '/' + d.getDate();
  },

  deleteitem: function(type, objName, listType, index){
    var objGet = authorLibs.authorData[type].filter(function(finder){return (finder.id === objName);});
    if (objGet.length === 0) return;
    var subProp = authorLibs.utils.getSubProp(objGet[0], listType);
    subProp.splice(index,1);
    authorLibs.buildProp.get(type,objGet[0].id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  deletetimeline: function(animName, index){
    var animGet = authorLibs.authorData.anims.filter(function(finder){return (finder.id === animName);});
    if (animGet.length === 0) return;
    animGet[0].timelist.splice(index,1);
    authorLibs.buildProp.get("anims",animName);
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

  fadeElement(element, speed) {
      var op = 1;
      var timer = setInterval(function () {
          if (op <= 0.02){
              clearInterval(timer);
              element.style.display = 'none';
              element.style.opacity = 1;
          }
          element.style.opacity = op;
          element.style.filter = 'alpha(opacity=' + op * 100 + ")";
          op -= op * 0.1;
      }, speed);
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

  layersClean: function(){
    var idsInLayers = [];
    authorLibs.authorData.layers.forEach(function(layer){
      var inTooManyTimes = [];
      layer.list.forEach(function(item){
        if (idsInLayers.indexOf(item.id) < 0){
          idsInLayers.push(item.id);
        } else {
          inTooManyTimes.push(item.id);
        }
      });
      inTooManyTimes.forEach(function(tooMany){
        var idx = layer.list.findIndex(function(el){return el.id === tooMany;});
        layer.list.splice(idx, 1);
      });
    });
    var checklist = ['objects','particles'];
    var validIDs = [];
    checklist.forEach(function(testType){
      if (authorLibs.authorData[testType] === undefined) return;
      authorLibs.authorData[testType].forEach(function(item){
        validIDs.push(item.id);
        if (idsInLayers.indexOf(item.id) < 0){
          authorLibs.authorData.layers[authorLibs.gui.currentLayer].list.push({id:item.id, type:testType});
        }
      });
    });
    authorLibs.authorData.layers.forEach(function(layer, idxR){
      layer.list = layer.list.filter(function(e){return this.indexOf(e.id)!=-1;},validIDs);
      layer.list.forEach(function(item){delete item.name});
    });
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
    authorLibs.buildProp.get('layers', idx);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  loadAutobk:function(string){
    console.log(string);
      localStorage.getItem('canvasser_autoback_' +string, JSON.stringify(authorLibs.authorData));
  },

  loadDataUpdate: function(){
    var filter  = document.getElementById('loaddatafilter').value;
    var filebox = document.getElementById('loaddata');
    filebox.innerHTML = '';
    authorLibs.lists.fileList.forEach(function(item){
      if (item.project.indexOf(filter) < 0) return;
      authorLibs.windows.makeDiv({parent:filebox, html:item.project, classes:'load_project'});
      item.files.forEach(function(file){
        authorLibs.windows.makeDiv({parent:filebox, html:file.id, classes:'load_file', click:function(){
            document.getElementById('saveproject').value     = item.project;
            document.getElementById('savefile').value        = file.id.substring(0, file.id.length - 5);
            document.getElementById('loadbox').style.display = 'none';
            authorLibs.utils.requestJson(file.url, function(data){restartCanvasser("sample", data, 'string');});
          }
        });
      });
    });
  },

  loadDefault: function(){
    if (!authorLibs.defaultJSONobj)  authorLibs.utils.requestJson(authorLibs.defaultJSON, function(data){restartCanvasser("sample", data, 'string');});
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
    var preUrl  = authorLibs.authorData.paths.filter(function(selected){return selected.id === item.path;})[0];
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

    if (typeof json.layers !== 'undefined' && json.layers.length === 0) json.layers = undefined;
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

    if (json.settings.responsive === undefined) json.settings.responsive = false;
    if (json.settings.fontlist === undefined) json.settings.fontlist = {type:'fontlist', list:[]};
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

  requestJson: function(fileNamePath, returnFunction){
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          returnFunction(authorLibs.utils.prepJson(JSON.parse(xhr.responseText)));
        }
        if (xhr.status == 404) console.error("JSON File Load Error: " + xhr.statusText + " " + xhr.readyState);
      }
      xhr.overrideMimeType('application/json');
      xhr.open('GET', fileNamePath + '?v="' + Date.now() + '"', true);
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
    var objGet  = authorLibs.authorData[type].filter(function(finder){return (finder.id === objectId);})[0];
    if (objGet.groups === undefined) objGet.groups = [];

    if (element){
      if (authorLibs.utils.findInGroup(objGet, groupName) === -1) objGet.groups.push({id:groupName});
    } else {
      var splicer = authorLibs.utils.findInGroup(objGet, groupName);
      if (splicer > -1) objGet.groups.splice(splicer, 1);
    }

    authorLibs.menus.update(type);
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
