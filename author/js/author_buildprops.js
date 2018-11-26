authorLibs.buildProp = {
  addaction: function(id, type, listType, command){
    var objGet = authorLibs.authorData[type].filter(function(finder){return (finder.id === id);});
    if (objGet.length === 0) return;
    if( objGet[0][listType] === undefined)  objGet[0][listType] = [];
    objGet[0][listType].push(command);
    authorLibs.buildProp.updateSubItem(objGet[0], type, command.type, listType+'.'+(objGet[0][listType].length-1)+'.type');
    authorLibs.buildProp.updateUI(objGet[0], type);
  },

  addDrawcode: function(id){
    var shape = authorLibs.authorData.shapes.filter(function(shape){ return shape.id === id;})[0];
    shape.drawcode.push({type:'fill'});
    authorLibs.buildProp.get('shapes', id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  addtest: function(id, type, listType){
    var objGet = authorLibs.authorData[type].filter(function(finder){return (finder.id === id);});
    if (objGet.length === 0) return;
    if( objGet[0][listType] === undefined)  objGet[0][listType] = [];
    objGet[0][listType].push({"type":"var"});
    authorLibs.buildProp.get(type,objGet[0].id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  clear: function(){
    document.getElementById('propertiestitle').innerHTML = '';
    document.getElementById('properties').innerHTML = '';
  },

  deleteprop: function(type,id,path){
    var find = authorLibs.utils.getSubProp(authorLibs.authorData,type);
    var obj  = find.filter(function(test){return test.id === id})[0];
    var arr  = path.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj.splice(arr[0],1);
    authorLibs.buildProp.get(type, id);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  get: function(type, id){
    var thisProp = undefined;
    var propName = '';

    if (type === 'layers'){
      thisProp = id;
      propName = authorLibs.authorData.layers[id].name;
    }
    else{
      if (type.indexOf('.') > -1){
        var newType = type.split('.');
        type = newType[0];
        id = newType[1];
      }
      var getP = authorLibs.utils.getSubProp(authorLibs.authorData, type);
      if (Array.isArray(getP)) {
        thisProp = getP.filter(function(selected){return selected.id === id;})[0];
        if (thisProp !== undefined) propName = thisProp.id;

      }
      else thisProp = id;
    }
    if (thisProp === undefined) return;
    if (thisProp.name === undefined) thisProp.name = thisProp.id;
    else propName = thisProp.name;

    authorLibs.current = {type:type, id:id};

    var element = document.getElementById('propertiestitle');
    authorLibs.windows.makeDiv({clearparent:true, parent:element, classes:'proptitle', html:type.charAt(0).toUpperCase()+type.slice(1, -1)+' : '+propName});
    var propUI = document.getElementById("properties");

    if (type==='anims'){
      var pDiv = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});

      authorLibs.rules.anim.animdata.widgets.forEach(function(widget, idx, source){
        var val = authorLibs.utils.getSubProp(thisProp, widget.field);
        if (widget.type === "text"){
          authorLibs.buildProp.setText({parent:pDiv, widthClass:'w50', obj:thisProp, widget:widget, inputClass:widget.css,
            value:thisProp[widget.field], type:'anims', path:widget.field});
        }
        if (widget.type === "number") authorLibs.buildProp.setNumber({parent:pDiv, obj:thisProp, type:'anims', widget:widget, path:widget.field, value:val, default:widget.default});
        if (widget.type === "bool")   authorLibs.buildProp.setBoolean({parent:pDiv, obj:thisProp, type:'anims', widget:widget, path:widget.field, value:val});
        if (widget.type === "timelist"){
          var wlist = [];
          authorLibs.rules.anims.forEach(function(template){wlist.push({id:template.type, name:template.type})});
          var paDiv = authorLibs.windows.makeDiv({parent:pDiv});
          var pbDiv = authorLibs.windows.makeDiv({parent:paDiv, classes:'pos_holder w95p'});
          authorLibs.windows.makeDiv({parent:pbDiv, classes:'pos_title', html:widget.display});

          if (thisProp[widget.field] !== undefined){
            thisProp[widget.field].forEach(function(actobject, idx){
              var actionWidgets = authorLibs.rules.anims.filter(function(type){return type.type === actobject.type});
              if (actionWidgets.length === 0) return;
              actionWidgets = actionWidgets[0].widgets;
              var pcDiv = authorLibs.windows.makeDiv({parent:pbDiv, classes:'actionblock'});
              authorLibs.windows.makeImg({parent:pbDiv, classes:'rightx', click:function(){authorLibs.utils.deletetimeline(thisProp.id, idx)},
                src:authorLibs.externalsPath + "image/icon_remove_g.png"});
              authorLibs.windows.makeDiv({parent:pbDiv, classes:'entrylabel c_entrytitle_text w100', html:idx});
              authorLibs.buildProp.setSelect({parent:pbDiv, object:thisProp.id, type:'anims', list:wlist,
              fn:function(){authorLibs.buildProp.updateActionList(this, thisProp.id, 'anims', widget.field+'.'+idx+'.type');},
              defaultId:actobject.type, path:widget.field+'.'+idx+'.type'});
              authorLibs.buildProp.makeWidgets({list:actionWidgets, idx:idx, widget:widget, set:{parent:pbDiv, obj:thisProp, type:'anims'}});
            });
          }
          authorLibs.windows.makeDiv({parent:pDiv, classes:'divbutton', click:function(){
            authorLibs.buildProp.addaction(thisProp.id, 'anims', widget.field, {"type":"console"});}, html:'Add Command'});
        }
      });
    }

    if (type==='constraints'){
      var pDiv = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});
      authorLibs.rules.constraint.widgets.forEach(function(widget, idx, source){
        var val = authorLibs.utils.getSubProp(thisProp, widget.field);
        if (widget.type === "text"){
          authorLibs.buildProp.setText({parent:pDiv, widthClass:'w50', obj:thisProp, widget:widget, inputClass:widget.css,
            value:thisProp[widget.field], type:'constraints', path:widget.field});
        }

        if (widget.type === "number") authorLibs.buildProp.setNumber({parent:pDiv, obj:thisProp, type:'constraints', widget:widget, path:widget.field, value:val, default:widget.default});
        if (widget.type === "bool")  authorLibs.buildProp.setBoolean({parent:pDiv, obj:thisProp, type:'constraints', widget:widget, path:widget.field, value:val});
        if (widget.type === "driverlist"){
          var wlist = [];
          authorLibs.rules.constraint.drivers.forEach(function(template){wlist.push({id:template.type, name:template.type})});
          paDiv = authorLibs.windows.makeDiv({parent:pDiv});
          pbDiv = authorLibs.windows.makeDiv({parent:paDiv, classes:'pos_holder w95p'});
          authorLibs.windows.makeDiv({parent:pbDiv, classes:'pos_title', html:widget.display});

          if (thisProp[widget.field] !== undefined){
            thisProp[widget.field].forEach(function(actobject, idx){
              var actionWidgets = authorLibs.rules.constraint.drivers.filter(function(type){return type.type === actobject.type});
              if (actionWidgets.length === 0) return;
              actionWidgets = actionWidgets[0].widgets;
              pcDiv = authorLibs.windows.makeDiv({parent:pbDiv, classes:'actionblock'});
              authorLibs.windows.makeImg({parent:pbDiv, classes:'rightx', click:function(){authorLibs.utils.deletedriver(thisProp.id, idx)},
                src:authorLibs.externalsPath + "image/icon_remove_g.png"});
              authorLibs.windows.makeDiv({parent:pbDiv, classes:'entrylabel c_entrytitle_text w100', html:idx});
              authorLibs.buildProp.setSelect({parent:pbDiv, fn:function(){authorLibs.buildProp.updateItem(this, thisProp.id, 'constraints', widget.field);}, object:thisProp.id, type:'constraints',
                list:wlist, defaultId:actobject.type, path:widget.field+'.'+idx+'.type'});

              authorLibs.buildProp.makeWidgets({list:actionWidgets, idx:idx, widget:widget,  set:{parent:pbDiv, obj:thisProp, type:'constraints'}});
            });
          }
          authorLibs.windows.makeDiv({parent:pDiv, classes:'divbutton', click:function(){authorLibs.utils.addConstraint(thisProp.id, widget.field)}, html:'Add Command'});
        }
      });
    }

    if (type==='groups'){
      var pDiv = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});
      authorLibs.buildProp.setText({parent:pDiv, widthClass:'w50', obj:thisProp, widget:{field:'name'},
        inputClass:'w200', value:thisProp.name, type:'groups', path:'name'});
    }

    if (type==='images'){
      var pDiv      = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});
      var pList     = authorLibs.utils.objPartToArr(authorLibs.authorData.paths, "id");
      var pathList  = [];
      pList.forEach(function(item){pathList.push(item);});
      var id   = authorLibs.utils.getSubProp(thisProp, 'id');
      var path = authorLibs.authorData.paths.filter(function(check){return check.id === thisProp.path;})[0];
      authorLibs.buildProp.makeWidgets({list:authorLibs.rules.image.imagedata.widgets,
        set:{list:pathList, parent:pDiv, obj:thisProp, path:'path', type:'images'}});
      authorLibs.windows.makeDiv({parent:pDiv, classes:'load_filefolder', html:'Objects Using this Image'});
      var objs = authorLibs.authorData.objects.filter(function(check){return check.type==='image' && check.image === thisProp.id;});
      if (objs.length === 0){
        authorLibs.windows.makeDiv({parent:pDiv, classes:'load_file', html:'None'});
      } else {
        objs.forEach(function(imgObj){
          authorLibs.windows.makeDiv({parent:pDiv, classes:'load_file', html:imgObj.name,  click:function(){authorLibs.buildProp.get('objects', imgObj.id)}});
        });
      }
      authorLibs.windows.makeDiv({parent:pDiv, classes:'load_filefolder', html:'Image Preview'});
      authorLibs.windows.makeImg({parent:pDiv, classes:'imagescale', src:path.url + '/' + thisProp.url});
    }

    if (type==='layers'){
      var pDiv = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});
      authorLibs.gui.currentLayer = thisProp;
      var layer = authorLibs.authorData.layers[thisProp];
      authorLibs.windows.makeDiv({parent:pDiv, html:'name', classes:'entrylabel c_entrytitle_text '});
      authorLibs.windows.makeElement({parent:pDiv, type:'input', subtype:'text',
        classes:'auth_text w200', value:layer.name,
        change:function(){authorLibs.utils.layerUpdate(this, thisProp, 'name', 'value')}});
      authorLibs.windows.makeDiv({parent:pDiv, classes:'entrylabel c_entrytitle_text w100', html:'show'});
      var ck = authorLibs.windows.makeElement({parent:pDiv, classes:'checkbox', type:'input', subtype:'checkbox',
        click:function(){authorLibs.utils.layerUpdate(this, thisProp, 'show', "boolean")}});
      if (layer.show) ck.checked = true;
    }

    if (type==='objects'){
      if (thisProp.type === undefined) thisProp.type = 'image';
      var pDiv = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});
      if (thisProp.type === 'image' && thisProp.image !== undefined){
        var imgList = authorLibs.authorData.images.filter(function(check){return check.id === thisProp.image;});
        if (imgList.length > 0){
          var img = imgList[0];
          var path = authorLibs.authorData.paths.filter(function(check){return check.id === img.path;})[0];
          authorLibs.windows.makeDiv({parent:pDiv, classes:'load_filefolder', html:'Image Preview'});
          authorLibs.windows.makeImg({parent:pDiv, classes:'imagescale', src: path.url + '/' + img.url});
        }

        authorLibs.windows.makeDiv({parent:pDiv, classes:'load_filefolder', html:'Properties'});
      }
      authorLibs.buildProp.makeWidgets({list:authorLibs.rules.object[thisProp.type].widgets, current:true,
        set:{parent:pDiv, obj:thisProp, type:'objects'}});
    }

    if (type==='particles'){
      var pDiv = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});
      authorLibs.buildProp.makeWidgets({list:authorLibs.rules.particle.widgets, currentpos:true, set:{parent:pDiv, obj:thisProp, type:'particles'}});
    }

    if (type==='paths'){
      var pDiv = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});
      authorLibs.buildProp.setText({parent:pDiv, widthClass:'w50', obj:thisProp, widget:{field:'id'}, inputClass:'w200',
        value:thisProp.id, type:'paths', path:'id'});
      authorLibs.buildProp.setText({parent:pDiv, widthClass:'w50', obj:thisProp, widget:{field:'url'}, inputClass:'w200',
        value:thisProp.url, type:'paths', path:'url'});
    }

    if (type==='settings'){
      var pDiv = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});
      if (authorLibs.rules.settings[thisProp].type === "bool"){
        authorLibs.buildProp.setBoolSetting({parent:pDiv, widget:{field:thisProp}, path:thisProp, value:authorLibs.authorData.settings[thisProp]});
      }
      if (authorLibs.rules.settings[thisProp].type === "text" || authorLibs.rules.settings[thisProp].type === "number") {
        authorLibs.windows.makeDiv({parent:pDiv, html:thisProp, classes:'entrylabel c_entrytitle_text w200'});
        authorLibs.windows.makeElement({parent:pDiv, type:'input', subtype:authorLibs.rules.settings[thisProp].type,
          classes:'auth_text w200', value:authorLibs.authorData.settings[thisProp],
          change:function(){authorLibs.buildProp.settingUpdate(this, thisProp)}});
      }
      if (authorLibs.rules.settings[thisProp].type === "fonts"){
        var fontTypes = Object.keys(authorLibs.rules.font);

        authorLibs.authorData.settings[thisProp].forEach(function(font, idx){
          var divB = authorLibs.windows.makeDiv({parent:pDiv, classes:'actionblock'});
          var pDel = authorLibs.windows.makeDiv({parent:divB, classes:'deleter',
            click:function(){authorLibs.buildProp.settingDelete('fonts', font.id)}});
          authorLibs.windows.makeImg({parent:pDel, id:'removeshape', src:'image/icon_x.png'});

          authorLibs.buildProp.setListSelect({parent:divB, obj:font, type:'settings.fonts',
            widget:{field:'type', id:font.id}, path:'type', list:fontTypes, value:font.type});
          var fontWidgets = authorLibs.rules.font[font.type].widgets;
          authorLibs.buildProp.makeWidgets({list:fontWidgets, field:'',
            set:{parent:divB, obj:font, type:'settings.fonts'}});
        });
        authorLibs.windows.makeDiv({parent:pDiv, classes:'divbutton', html:'Add Font',
          click:function(){authorLibs.utils.addFont(thisProp.id);}});
      }
    }

    if (type==='shapes'){
      var pDiv = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});
      authorLibs.buildProp.makeWidgets({list:authorLibs.rules.shape.widgets,  set:{parent:pDiv, obj:thisProp, type:'shapes'}});

      var drawList = [];
      authorLibs.rules.drawcode.forEach(function(template){drawList.push(template.type)});
      var thisProp = authorLibs.authorData.shapes.filter(function(check){return check.id === thisProp.id;})[0];
      if (thisProp === undefined) return;

      if (thisProp.drawcode === undefined) thisProp.drawcode = [];
      thisProp.drawcode.forEach(function(widget, idx, source){
        var pBox = authorLibs.windows.makeDiv({parent:pDiv, classes:'propbox'});
        var rFlo = authorLibs.windows.makeDiv({parent:pBox, classes:'rightfloater'});
        var pDel = authorLibs.windows.makeDiv({parent:rFlo, classes:'deleter',
          click:function(){authorLibs.buildProp.deleteprop('shapes', thisProp.id,'drawcode.'+idx)}});
        authorLibs.windows.makeImg({parent:pDel, id:'removeshape', src:'image/icon_x.png'});
        if (idx > 0){
          var mUp = authorLibs.windows.makeDiv({parent:rFlo, classes:'deleter',
            click:function(){authorLibs.buildProp.moveprop('shapes', thisProp.id,'drawcode.'+idx, idx-1)}});
          authorLibs.windows.makeImg({parent:mUp, id:'removeshape-up', src:'image/icon_move_up.png'});
        }
        if (idx < thisProp.drawcode.length-1){
          var mDown = authorLibs.windows.makeDiv({parent:rFlo, classes:'deleter',
            click:function(){authorLibs.buildProp.moveprop('shapes', thisProp.id,'drawcode.'+idx, idx+1)}});
          authorLibs.windows.makeImg({parent:mDown, id:'removeshape-down', src:'image/icon_move_down.png'});
        }
        authorLibs.windows.makeDiv({parent:pBox, classes:'entrylabel c_entrytitle_text w25', html:idx});
        var tmpObj = {id:widget.type, field:'type'};
        var val = authorLibs.utils.getSubProp(thisProp, 'drawcode.' + idx + '.type');
        authorLibs.buildProp.setListSelect({parent:pBox, obj:thisProp, type:'shapes', widget:tmpObj,
          path:'drawcode.' + idx + '.type', list:drawList, value:val});
        var currentDraw = authorLibs.rules.drawcode.filter(function(draw){return draw.type === widget.type})[0];
        authorLibs.buildProp.makeWidgets({list: currentDraw.widgets, idx:idx,
          widget:{field:'drawcode'}, set:{parent:pBox, obj:thisProp, type:'shapes'}});
      });
      authorLibs.windows.makeDiv({parent:pDiv, classes:'divbutton', html:'Add drawcode',
        click:function(){authorLibs.buildProp.addDrawcode(thisProp.id);}});
    }

    if (type==='sounds'){
      var pDiv  = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});
      var pList = authorLibs.utils.objPartToArr(authorLibs.authorData.paths, "id");
      var path = authorLibs.authorData.paths.filter(function(check){return check.id === thisProp.path;})[0];
      var pathList  = [];
      pList.forEach(function(item){pathList.push(item);});
      var id = authorLibs.utils.getSubProp(thisProp, 'path');
      authorLibs.buildProp.makeWidgets({list:authorLibs.rules.sound.widgets, set:{list:pathList, parent:pDiv, obj:thisProp, path:'path', type:'sounds'}});
      authorLibs.windows.makeDiv({parent:pDiv, classes:'load_filefolder', html:'Sound Preview'});
      authorLibs.windows.makeVid({parent:pDiv, classes:'imagescale', src:path.url + '/' + thisProp.url});
    }

    if (type==='tests'){
      var pDiv  = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});
      authorLibs.buildProp.makeWidgets({list:authorLibs.rules.tests, set:{parent:pDiv, obj:thisProp, type:'tests'}});
    }

    if (type==='vars'){
      var pDiv  = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});
      authorLibs.buildProp.setText({parent:pDiv, widthClass:'w50', obj:thisProp, widget:{field:'name'}, inputClass:'w200',
        value:thisProp.name, type:'vars', path:'name'});
      if (thisProp.type === undefined) thisProp.type = 'number';
      authorLibs.buildProp.setListSelect({parent:pDiv, widthClass:'w50', obj:thisProp, widget:{field:'type', id:'vartype'},
        value:thisProp.type, type:'vars', path:'type'});
      if (thisProp.type === 'number'){
        if (isNaN(thisProp.value)) thisProp.value = 0;
        authorLibs.buildProp.setNumber({parent:pDiv, obj:thisProp, type:'vars', widget:{field:'value'},
          path:'value', value:thisProp.value, default:widget.default});
      }
      if (thisProp.type === 'string'){
        authorLibs.buildProp.setText({parent:pDiv, widthClass:'w50', obj:thisProp, widget:{field:'value'},
          inputClass:'w200', value:thisProp.value, type:'vars', path:'value'});
      }
    }

    if (type==='videos'){
      var pDiv = authorLibs.windows.makeDiv({clearparent:true, parent:propUI, classes:'propbody'});
      var id   = authorLibs.utils.getSubProp(thisProp, 'id');
      var path = authorLibs.authorData.paths.filter(function(check){return check.id === thisProp.path;})[0];
      var pList = authorLibs.utils.objPartToArr(authorLibs.authorData.paths, "id");
      var pathList  = [];
      pList.forEach(function(item){pathList.push(item);});
      authorLibs.buildProp.makeWidgets({list:authorLibs.rules.video.widgets,
        set:{list:pathList, parent:pDiv, obj:thisProp, path:'path', type:'videos'}});

      authorLibs.windows.makeDiv({parent:pDiv, classes:'load_filefolder', html:'Video Preview'});
      authorLibs.windows.makeVid({parent:pDiv, classes:'imagescale', src:path.url + '/' + thisProp.url});
    }

    authorLibs.menus.updateSelectionWindow(type,id);
  },

  getCurrent: function(){
    if (authorLibs.current.type === undefined || authorLibs.current.id === undefined) return;
    authorLibs.buildProp.get(authorLibs.current.type, authorLibs.current.id);
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

  makeWidgets: function(obj){
    obj.list.forEach(function(subWidget){
      var wPath = '';
      if (obj.widget === undefined && obj.idx === undefined) wPath = subWidget.field;
      else wPath = obj.widget.field + '.' + obj.idx + (subWidget.field !== undefined ? '.' + subWidget.field : '');
      if (obj.current === true &&
        (subWidget.type === 'number' || subWidget.type === 'posxy'  || subWidget.type === 'scale')){
        wPath += '.current';
      }
      if (obj.currentpos === true && subWidget.type === 'posxy'){
        wPath += '.current';
      }
      var val = authorLibs.utils.getSubProp(obj.set.obj, wPath);
      var defaults = Object.assign({}, obj.set, {widget:subWidget, path:wPath, value:val, default:subWidget.default});
      defaults.value = authorLibs.buildProp.setDefault(defaults);

      if (subWidget.type === "actions")    authorLibs.buildProp.setAction(defaults);
      if (subWidget.type === 'animlist')   authorLibs.buildProp.setTypeList(Object.assign(defaults, {filter:'anims'}));
      if (subWidget.type === 'anmlist')    authorLibs.buildProp.setTypeList(Object.assign(defaults, {filter:'anims'}));
      if (subWidget.type === 'bool')       authorLibs.buildProp.setBoolean(defaults);
      if (subWidget.type === "color")      authorLibs.buildProp.setColor(defaults);
      if (subWidget.type === "filterlink") authorLibs.buildProp.setLinkSel(defaults);
      if (subWidget.type === "fonts")      authorLibs.buildProp.setFont(defaults);
      if (subWidget.type === 'grplist')    authorLibs.buildProp.setGroup(Object.assign(defaults));
      if (subWidget.type === "imagedata")  authorLibs.buildProp.setImage(defaults);
      if (subWidget.type === "linkedcontent") {
        if (val.check !== undefined){
          authorLibs.buildProp.makeWidgets({list:authorLibs.rules.conditionals[val.check].widgets, idx:obj.idx, type:'tests', widget:obj.widget, set:obj.set});
        }
      }
      if (subWidget.type === 'laylist')    authorLibs.buildProp.setTypeList(Object.assign(defaults, {filter:'layers'}));
      if (subWidget.type === 'number' )    authorLibs.buildProp.setNumber(defaults);
      if (subWidget.type === 'objlist')    authorLibs.buildProp.setTypeList(Object.assign(defaults, {filter:'objects'}));
      if (subWidget.type === 'parlist')    authorLibs.buildProp.setTypeList(Object.assign(defaults, {filter:'particles'}));
      if (subWidget.type === 'posxy'  ){
        defaults.value = {
          x:authorLibs.utils.getSubProp(obj.set.obj, wPath+'.x'),
          y:authorLibs.utils.getSubProp(obj.set.obj, wPath+'.y')
        };
        authorLibs.buildProp.setPosition(defaults);
      }
      if (subWidget.type === 'scale')       authorLibs.buildProp.setNumber(defaults);
      if (subWidget.type === 'select')      authorLibs.buildProp.setListSelect(defaults);
      if (subWidget.type === 'selecttext')  authorLibs.buildProp.setTxtSelect(defaults);
      if (subWidget.type === 'suggesttext') authorLibs.buildProp.setTxtSuggest(defaults);
      if (subWidget.type === 'shapelist')   authorLibs.buildProp.setTypeList(Object.assign(defaults, {filter:'shapes'}));
      if (subWidget.type === 'sndlist')     authorLibs.buildProp.setTypeList(Object.assign(defaults, {filter:'sounds'}));
      if (subWidget.type === 'tests')       authorLibs.buildProp.setTest(defaults);
      if (subWidget.type === 'text')        authorLibs.buildProp.setText(Object.assign(defaults, {widthClass:'w100'}));
      if (subWidget.type === 'textarea')    authorLibs.buildProp.setTextArea(Object.assign(defaults, {widthClass:'w100'}));
      if (subWidget.type === 'varlist')     authorLibs.buildProp.setTypeList(Object.assign(defaults, {filter:'vars'}));
      if (subWidget.type === "videodata")   authorLibs.buildProp.setVideo(defaults);
    });
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

  setAction: function(obj){
    var div  = authorLibs.windows.makeDiv({parent:obj.parent});
    var divA = authorLibs.windows.makeDiv({parent:div, classes:'pos_holder w95p'});
    authorLibs.windows.makeDiv({parent:divA, classes:'pos_title', html:obj.widget.display});

    var go = true;
    if (obj.widget.dependson != undefined) go = obj.obj[obj.widget.dependson];
    if (go === undefined || go === false) return;

    var actionsList = [];
    authorLibs.rules.actions.forEach(function(template){actionsList.push({id:template.type, name:template.type})});

    if (obj.obj[obj.widget.field] !== undefined){
      obj.obj[obj.widget.field].forEach(function(itemAct, idx){
        var actionWidgets = authorLibs.rules.actions.filter(function(rType){ return rType.type === itemAct.type});
        if (actionWidgets.length === 0) return;
        actionWidgets = actionWidgets[0].widgets;
        var divB = authorLibs.windows.makeDiv({parent:divA, classes:'actionblock'});
        authorLibs.windows.makeDiv({parent:divB, classes:'entrylabel c_entrytitle_text w100', html:idx});

        authorLibs.buildProp.setSelect({parent:divB, fn:function(){authorLibs.buildProp.updateActionList(this, obj.obj.id,  obj.type, obj.widget.field+'.'+idx+'.type');},
        object:obj.obj.id, type: obj.type, list:actionsList, defaultId:itemAct.type, path:obj.widget.field+'.'+idx+'.type'});
        authorLibs.windows.makeImg({parent:divB, classes:'rightx', click:function(){authorLibs.utils.deleteitem(obj.type, obj.obj.id, obj.widget.field, idx)},
          src:authorLibs.externalsPath + "image/icon_remove_g.png"});

        authorLibs.buildProp.makeWidgets({list:actionWidgets, idx:idx, widget:obj.widget, set:{parent:divB, obj:obj.obj, type:obj.type}});
      });
    }
    authorLibs.windows.makeDiv({parent:divA, classes:'divbutton', html:'Add Action', click:function(){authorLibs.buildProp.addaction(obj.obj.id, obj.type, obj.widget.field, {"type":"cleardown"});}});
  },

  setBoolean: function(obj){
    var display = obj.widget.display === undefined ? obj.widget.field : obj.widget.display;
    var div = authorLibs.windows.makeDiv({parent:obj.parent});
    authorLibs.windows.makeDiv({parent:div, classes:'entrylabel c_entrytitle_text w100', html:display});
    var ck = authorLibs.windows.makeElement({parent:div, classes:'checkbox', type:'input', subtype:'checkbox',
      click:function(){authorLibs.buildProp.updateItem(this, obj.obj.id, obj.type, obj.path)}});
    if (obj.value) ck.checked = true;
  },

  setBoolSetting: function(obj){
    var display = obj.widget.display === undefined ? obj.widget.field : obj.widget.display;
    var div = authorLibs.windows.makeDiv({parent:obj.parent});
    authorLibs.windows.makeDiv({parent:div, classes:'entrylabel c_entrytitle_text w100', html:display});
    var ck = authorLibs.windows.makeElement({parent:div, classes:'checkbox', type:'input', subtype:'checkbox',
      click:function(){authorLibs.buildProp.settingUpdate(this, obj.path)}});
    if (obj.value) ck.checked = true;
  },

  setColor: function(obj){
    if (obj.obj[obj.widget.field] === undefined || obj.obj[obj.widget.field] === {}){
      obj.obj[obj.widget.field] = {current:["rgba(0,0,0,1)"]};
    }
    var divZ = authorLibs.windows.makeDiv({parent:obj.parent});
    var div  = authorLibs.windows.makeDiv({parent:divZ, classes:'pos_holder',style:'display:block;'});
    authorLibs.windows.makeDiv({parent:div, classes:'pos_title', html:obj.widget.field });

    Object.keys(obj.obj[obj.widget.field]).forEach(function(colorList){
        obj.obj.color[colorList].forEach(function(color,idx){
          var val   = authorLibs.utils.getSubProp(obj.obj, obj.widget.field+'.'+colorList+'.'+idx);
          var pActB = authorLibs.windows.makeDiv({parent:div, classes:'actionblock'});
          authorLibs.windows.makeImg({parent:pActB, classes:'rightx', click:function(){
            authorLibs.utils.deleteitem('objects', obj.obj.id, obj.widget.field+'.'+colorList, idx)},
            src:authorLibs.externalsPath + "image/icon_remove_g.png"});
          authorLibs.buildProp.setText({parent:pActB, widthClass:'w20', obj:obj.obj, widget:{field:idx},
            value:val, type:'objects', path:obj.widget.field+'.'+colorList+'.'+idx});
      });
    });
    authorLibs.windows.makeDiv({parent:div, classes:'divbutton', html:'Add Color', click:function(){authorLibs.utils.addColor(obj.obj.id, obj.widget.field)}});
  },

setDefault: function(obj){
  if (obj.value === undefined && obj.default !== undefined){
    var def = authorLibs.utils.getById(obj.obj.id, obj.type);
    authorLibs.buildProp.setSubProp(def, obj.path, obj.default);
    return obj.default;
  }
  return obj.value;
},

  //TODO: What's this?
  setFont: function(obj){
    console.log("wee")
  },

  setGroup: function(obj){
    var groupList = authorLibs.buildProp.listIdsNames('groups');
    if (obj.obj.groups === undefined) obj.obj.groups = [];
    var div = authorLibs.windows.makeDiv({parent:obj.parent, classes:'grouper'});
    authorLibs.windows.makeDiv({parent:div, classes:'grouptitle', html:'Groups'});
    groupList.forEach(function(grp, idx){
      var id = authorLibs.utils.findInGroup(obj.obj, grp.id);
      var divA = authorLibs.windows.makeDiv({parent:div, classes:'nosplit'});
      authorLibs.windows.makeDiv({parent:divA, classes:'entrylabel c_entrytitle_text w100', html:grp.name});
      var ck = authorLibs.windows.makeElement({parent:divA, classes:'checkbox', type:'input', subtype:'checkbox',
        click:function(){authorLibs.utils.togglegroup(this, obj.obj.id, obj.type, obj.path, grp.id)}});
      if (id > -1) ck.checked = true;
    });
  },

  setImage: function(obj){
    var imageList = authorLibs.buildProp.listIdsNames('images');
    var div = authorLibs.windows.makeDiv({parent:obj.parent});
    authorLibs.windows.makeDiv({parent:div, classes:'entrylabel c_entrytitle_text w100', html:obj.widget.field});
    authorLibs.buildProp.setSelect({parent:div, fn:function(){authorLibs.buildProp.updateItem(this, obj.obj.id, obj.type, obj.path)}, object:obj.obj.id, type:obj.type,
      list:imageList, defaultId:obj.obj[obj.widget.field], path:obj.widget.field});

    var flipTest = authorLibs.authorData.images.filter(function(img){ return img.id === obj.obj.image})[0];
    if (flipTest){
      if(flipTest.atlas){
        var pos = {x:authorLibs.utils.getSubProp(obj.obj, 'atlascell.x'), y:authorLibs.utils.getSubProp(obj.obj, 'atlascell.y')};
        authorLibs.buildProp.setNumber({parent:div, obj:obj.obj, type:obj.type, widget:{field:'atlascell.x'}, path:'atlascell.x', value:pos.x, default:widget.default});
        authorLibs.buildProp.setNumber({parent:div, obj:obj.obj, type:obj.type, widget:{field:'atlascell.y'}, path:'atlascell.y', value:pos.y, default:widget.default});
      }
    }
  },

  setLinkSel: function(obj){
    var filter   = obj.path.substr(0, obj.path.lastIndexOf(".")) + '.' + obj.widget['link'] ;
    var filterId = authorLibs.utils.getSubProp(obj.obj, filter)+'s';
    var val      = authorLibs.utils.getSubProp(obj.obj, obj.path);
    authorLibs.buildProp.setTypeList({parent:obj.parent, obj:obj.obj, type:obj.type, widget:obj.widget,
      path:obj.path, value:val, filter:filterId});
  },

  setListSelect: function(obj){
    var selOp = (obj.list === undefined ? authorLibs.rules.select[obj.widget.id].list : obj.list);
    var localList  = [];
    selOp.forEach(function(item){
      localList.push({id:item, name:item});
    });
    var html = obj.widget.display ? obj.widget.display : obj.widget.field;
    if (obj.path === 'type' && obj.type === 'objects'){
        html += '<img style="display: inline-block;margin-left: 52px;margin-bottom: -8px; margin-top: -16px;" src="'+'./image/icon_layer_' + obj.obj.type + '.png'+'">';
    }
    authorLibs.windows.makeDiv({parent:obj.parent, classes:'entrylabel c_entrytitle_text w100', html:html});

    authorLibs.buildProp.setSelect({parent:obj.parent, object:obj.obj.id, type:obj.type,
      fn:function(){authorLibs.buildProp.updateItem(this, obj.obj.id, obj.type, obj.path)},
      list:localList, defaultId:obj.value, path:obj.path}
    );
  },

  setNumber: function(obj){
    var div = authorLibs.windows.makeDiv({parent:obj.parent});
    authorLibs.windows.makeDiv({parent:div, classes:'entrylabel c_entrytitle_text w100',
      html:(obj.widget.display ? obj.widget.display : obj.widget.field)});
    authorLibs.windows.makeElement({parent:div, classes:'auth_xy', type:'input', subtype:'number',
      value:obj.value, change:function(){authorLibs.buildProp.updateItem(this, obj.obj.id, obj.type, obj.path)}});
  },

  setPosition: function(obj){
    if (obj.value.x === undefined) obj.value.x = 0;
    if (obj.value.y === undefined) obj.value.y = 0;
    var display = obj.widget.display ? obj.widget.display : obj.widget.field;
    var div = authorLibs.windows.makeDiv({parent:obj.parent, style:'display:table;'});
    authorLibs.windows.makeSpan({parent:div, classes:'entrylabel c_entrylabel_pos w100', html:display});
    var spX = authorLibs.windows.makeSpan({parent:div, classes:'entrytitle c_entrylabel_pos', html:'X',
      style:'display:inline-block; height:16px;'});
    authorLibs.windows.makeElement({parent:div, classes:'auth_xy', type:'input', subtype:'number',
      value:obj.value.x, change:function(){authorLibs.buildProp.updateItem(this, obj.obj.id, obj.type, obj.path+'.x')}});
    var spY = authorLibs.windows.makeSpan({parent:div, classes:'entrytitle c_entrylabel_pos', html:'Y',
      style:'display:inline-block; height:16px;'});
    authorLibs.windows.makeElement({parent:div, classes:'auth_xy', type:'input', subtype:'number',
      value:obj.value.y, change:function(){authorLibs.buildProp.updateItem(this, obj.obj.id, obj.type, obj.path+'.y')}});
  },

  setSelect: function(obj){
    if (obj.text){
      authorLibs.windows.makeElement({parent:obj.parent, id:'prop_'+obj.path,
        classes:'sellist', type:'input', subtype:'text',
        value:obj.defaultId, list:'datalist_'+obj.path, change:obj.fn});
      var dl = authorLibs.windows.makeElement({parent:obj.parent, id:'datalist_'+obj.path, type:'datalist'});

      var newList = obj.list.slice();
      newList.unshift("---NONE---");
      newList.forEach(function(listObject){
        authorLibs.windows.makeElement({parent:dl, type:'option', html:listObject.id});
      });
    } else {
      var sel = authorLibs.windows.makeElement({parent:obj.parent, id:'prop_'+obj.path, classes:'sellist', type:'select',
        change:obj.fn});
      var objList  = obj.list.slice();
      objList.unshift({id:"---NONE---", name:"---NONE---"} );
      objList.forEach(function(listObject){
        var op = authorLibs.windows.makeElement({parent:sel, id:'datalist_'+obj.path, value:listObject.id, type:'option', html:listObject.name});
        if (listObject.id === obj.defaultId) op.selected = true;
      });
    }
  },

  setSubProp: function(obj, descIn, val){
    var desc = String(descIn);
    var arr = desc.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj[arr[0]] = typeof(val) === "boolean" ? val : isNaN(val) ? val : typeof(val) === "number" ? val : val.indexOf(".")==-1 ? parseInt(val) : parseFloat(val);
  },

  setTest: function(obj){
    var tList = Object.keys(authorLibs.rules.conditionals);
    var list  = [];
    tList.forEach(function(item){list.push({id:item, name:item});});

    var pDivA = authorLibs.windows.makeDiv({parent:obj.parent});
    var pDivB = authorLibs.windows.makeDiv({parent:pDivA, classes:'pos_holder w95p'});
    authorLibs.windows.makeDiv({parent:pDivB, classes:'pos_title', html:obj.widget.display});

    if (obj.obj[obj.widget.field] !== undefined){
      obj.obj[obj.widget.field].forEach(function(actobject, idx){
        if (actobject.type === undefined) return;
        var actionWidgets = authorLibs.rules.conditionals[actobject.type].widgets;
        if (actionWidgets.length === 0) return;
        var pActB = authorLibs.windows.makeDiv({parent:pDivB, classes:'actionblock'});
        authorLibs.windows.makeDiv({parent:pActB, classes:'entrylabel c_entrytitle_text w100', html:idx});
        authorLibs.buildProp.setSelect({parent:pActB, fn:function(){authorLibs.buildProp.updateActionList(this, obj.obj.id, 'tests', obj.widget.field+'.'+idx+'.type')},
        object:obj.obj.id, type:'tests', list:list, defaultId:actobject.type, path:obj.widget.field+'.'+idx+'.type'});
        authorLibs.windows.makeImg({parent:pActB, classes:'rightx', click:function(){authorLibs.utils.deleteitem('tests', obj.obj.id, obj.widget.field, idx)},
          src:authorLibs.externalsPath + "image/icon_remove_g.png"});
        authorLibs.buildProp.makeWidgets({list:actionWidgets, idx:idx, type:'tests', widget:obj.widget, set:{parent:pActB, obj:obj.obj, type:'tests'}});
      });

    }
    authorLibs.windows.makeDiv({parent:pDivB, classes:'divbutton', click:function(){
      authorLibs.buildProp.addtest(obj.obj.id, 'tests', obj.widget.field);}, html:'Add Test'});
  },

  setText: function(obj){
    var div = authorLibs.windows.makeDiv({parent:obj.parent});
    authorLibs.windows.makeDiv({parent:div, html:obj.widget.field,
      classes:'entrylabel c_entrytitle_text '+(obj.widthClass != undefined ? obj.widthClass : '')});
    authorLibs.windows.makeElement({parent:div, type:'input', subtype:'text',
      classes:'auth_text '+(obj.inputClass != undefined ? obj.inputClass : ''), value:obj.value,
      html:obj.widget.field, change:function(){authorLibs.buildProp.updateItem(this, obj.obj.id, obj.type, obj.path)}});
  },

  setTextArea: function(obj){
    var div = authorLibs.windows.makeDiv({parent:obj.parent});
    authorLibs.windows.makeDiv({parent:div, html:obj.widget.field,
      classes:'entrylabel c_entrytitle_text '+(obj.widthClass != undefined ? obj.widthClass : '')});
    authorLibs.windows.makeElement({parent:div, type:'textarea',
      classes:'auth_text '+(obj.inputClass != undefined ? obj.inputClass : ''), value:obj.value,
      html:obj.widget.field, change:function(){authorLibs.buildProp.updateItem(this, obj.obj.id, obj.type, obj.path)}});
  },

  setTxtSelect: function(obj){
    var selOp   = (obj.list === undefined ? authorLibs.rules.select[obj.widget.id].list : obj.list);
    var list    = [];
    selOp.forEach(function(item){list.push({id:item, name:item});});
    var id      = authorLibs.utils.getSubProp(obj.obj, obj.path);
    if (id === undefined) id = obj.default;
    var display = obj.widget.display ? obj.widget.display : obj.widget.field;
    authorLibs.windows.makeDiv({parent:obj.parent, classes:'entrylabel c_entrytitle_text w100', html:display});
    authorLibs.buildProp.setSelect({parent:obj.parent, text:true, fn:function(){authorLibs.buildProp.updateItem(this, obj.obj.id, obj.type, obj.path)},
    object:obj.obj.id, type:obj.type, list:list, defaultId:id, path:obj.path});
  },

  settingDelete: function(type, id){
    var find  = authorLibs.utils.getSubProp(authorLibs.authorData.settings, type);
    var index = find.map(function(e) { return e.id; }).indexOf(id);
    find.splice(index,1);
    authorLibs.buildProp.get('settings', type);
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  settingUpdate: function(domElement, setting){
    if (domElement.type === 'checkbox') authorLibs.authorData.settings[setting] = domElement.checked;
    else authorLibs.authorData.settings[setting] = domElement.value;
    authorLibs.menus.update('settings');
    restartCanvasser("sample", authorLibs.authorData, "string");
  },

  setTypeList: function(obj){
    var list = [];
    if (obj.filter === 'layers'){
      authorLibs.authorData.layers.forEach(function(layer, idx){ list.push({name:layer.name, id:layer.id})});
    } else list = authorLibs.buildProp.listIdsNames(obj.filter);

    var div = authorLibs.windows.makeDiv({parent:obj.parent});
    authorLibs.windows.makeDiv({parent:div, classes:'entrylabel c_entrytitle_text w100',
      html: (obj.widget.display ? obj.widget.display : obj.widget.field)});

    authorLibs.buildProp.setSelect({parent:div, fn:function(){authorLibs.buildProp.updateItem(this, obj.obj.id, obj.type, obj.path)}, object:obj.obj.id, type:obj.type,
      list:list, defaultId:obj.value, path:obj.path});
    if (obj.path === 'shape' && obj.type === 'objects') {
      if(obj.obj.shape === '' || obj.obj.shape === undefined){
        authorLibs.windows.makeDiv({parent:div, classes:'abs divbutton', html:"Create", click:function(){
          var id = authorLibs.menus.addItem('shapes');
          obj.obj.shape = id;
          authorLibs.buildProp.get(obj.type, obj.obj.id)
          }
        });
      } else {
        authorLibs.windows.makeDiv({parent:div, classes:'abs divbutton', html:"Edit", click:function(){
          authorLibs.buildProp.get('shapes', obj.obj.shape);
          }
        });
        //TODO: Maybe include shape in object for easier editing?
        // authorLibs.windows.makeDiv({parent:obj.parent, classes:'pos_holder', html:obj.obj.shape, click:function(){
        //   authorLibs.buildProp.get('shapes', obj.obj.shape);
        //   }
        //});
      }
    }
  },

  setVideo: function(obj){
    var vidList = authorLibs.buildProp.listIdsNames('videos');
    var div = authorLibs.windows.makeDiv({parent:obj.parent});
    authorLibs.windows.makeDiv({parent:div, classes:'entrylabel c_entrytitle_text w100', html:obj.widget.field});
    authorLibs.buildProp.setSelect({parent:div, fn:function(){authorLibs.buildProp.updateItem(this, obj.obj.id, obj.type, obj.path)}, object:obj.obj.id, type:obj.type,
      list:vidList, defaultId:obj.value, path:obj.widget.field});
  },

  //TODO: Why request JSON in this function?
  statsfile: function(type){
    var element = document.getElementById('propertiestitle');
    authorLibs.windows.makeDiv({clearparent:true, parent:element, classes:'proptitle', html:'File Stats:'});
    var propUI = document.getElementById("properties");
    propUI.innerHTML = '';

    function addToProp(file, data){
      authorLibs.windows.makeDiv({parent:propUI, classes:'load_filefolder', html:file.id});
      authorLibs.windows.makeDiv({parent:propUI, classes:'load_file', html:'objects:' + data.objects.length});
      data.objects.forEach(function(obj){
        if (obj.clicklist === undefined) return;
        obj.clicklist.forEach(function(click){
          Object.keys(click).some(function(k){
              if (click[k] !== "loadinto") return;
              authorLibs.windows.makeDiv({parent:propUI, classes:'load_file',
                html:'Load: ' + obj.name + ' ' + click.url});
          });
        });
      });
      authorLibs.windows.makeDiv({parent:propUI, classes:'load_file', html:'Images:' + data.images.length});
    }

    function requestJson(file, fileNamePath, returnFunction){
      var fileToDl = fileNamePath;
      fileToDl += '?' + new Date().getTime();
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) returnFunction(file, JSON.parse(xhr.responseText));
        if (xhr.status == 404) console.error("JSON Load Error: " + xhr.statusText + " " + xhr.readyState);
      }
      xhr.overrideMimeType('application/json');
      xhr.open('GET', fileToDl, true);
      xhr.send(null);
    }
    authorLibs.lists.fileManager.forEach(function(file){
      var list = [];
      if (file.type === 'json'){
        requestJson(file, file.url, addToProp)
      }
    });
  },

  updateActionList: function(domElement, objectId, type, paramPath){
    var item = authorLibs.authorData[type].filter(function(finder){return (finder.id === objectId);})[0];
    var prop = authorLibs.utils.getSubProp(item, paramPath);
    authorLibs.buildProp.updateItem(domElement, objectId, type, paramPath);
  },

  updateItem: function(domElement, objectId, type, paramPath){
    var newVal = domElement.value.toString();
    if (domElement.type === 'checkbox') newVal = domElement.checked;
    if (newVal === '---NONE---')        newVal = undefined;
    var path = authorLibs.utils.getSubProp(authorLibs.authorData, type);
    var objGet = path.filter(function(finder){return (finder.id === objectId);})[0];

    authorLibs.buildProp.setSubProp(objGet, paramPath, newVal);
    //TODO: This caused position x y with 2 moves in an anim to duplicate entry.
    // Did this ever do anthing useful?
    //authorLibs.buildProp.updateSubItem(objGet, type, newVal, paramPath);
    authorLibs.buildProp.updateUI(objGet, type);
  },

  updateSubItem: function(objGet, type, newVal, paramPath){
    if (authorLibs.rules[type] === undefined) return;
    var subRule = authorLibs.rules[type].filter(function(rule){
      return rule.type === newVal}
    )[0];
    if (subRule !== undefined){
      subRule.widgets.forEach(function(widget){
        if (widget.default !== undefined) {
          var newPath = paramPath.substr(0, paramPath.lastIndexOf("."));
          authorLibs.buildProp.setSubProp(objGet, newPath+'.'+widget.field, widget.default);
        }
      })
    }
  },

  updateUI(obj, type){
    authorLibs.buildProp.get(type, obj.id);
    authorLibs.menus.update(type);
    authorLibs.menus.update('layers');
    restartCanvasser("sample", authorLibs.authorData, "string");
  }

}
