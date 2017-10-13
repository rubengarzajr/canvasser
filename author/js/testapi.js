var apiData = {
  projectsPath: './api/v1/projects/',
  filesPath: './api/v1/files'
}

document.onreadystatechange = function(){
 if(document.readyState === 'complete'){
  apiGet('allFilesInAllProjects');
  upload_file.addEventListener('change', loadFile, false);
 }
}

function load_click(){
  var projectName = document.getElementById('postproject').value;
  if (projectName === '') return;
  document.getElementById("upload_file").click();
}

function loadFile(){
  var postProject = document.getElementById('postproject');
  var file = document.getElementById("upload_file").files[0];

  if (file) {
    var reader = new FileReader();
    if (file.type.indexOf('image') !== -1 || file.type.indexOf('audio') !== -1)  reader.readAsDataURL(file);
    else reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      document.getElementById("results").innerHTML = evt.target.result;
      apiPost('postfile', file, evt.target.result);
    }
    reader.onerror = function (evt) {
      document.getElementById("results").innerHTML = "error reading file";
    }
  }
}

function apiCopy(action){
  document.getElementById('results').innerHTML = "Not yet implemented.";
}


function apiDelete(action){
  var path = apiData.projectsPath;
  if (action === 'project'){
      path += document.getElementById('deleteprojectname').value;
  }
  if (action === 'file'){
    path += document.getElementById('deletefilesprojectname').value;
    path += '/files/';
    path += document.getElementById('deletefilesfilename').value;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", path, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200){
      document.getElementById('results').innerHTML = xhr.responseText;
    }
  }
  xhr.send();
}


function apiGet(action){
  var url = '';
  if (action === 'allFilesInAllProjects') url = apiData.filesPath;
  if (action === 'allFilesOfATypeInAllProjects') {
    var type = document.getElementById('getalloftype').value
    url = apiData.filesPath + '?type='+ type ;
  }
  if (action === 'allFilesInAProject') {
    var project = document.getElementById('getallfilesinaproject').value
    url = apiData.projectsPath + project + '/files';
  }
  if (action === 'allfilesinaprojectofatype'){
    var project = document.getElementById('project-getallfilesinaprojectofatype').value
    var type    = document.getElementById('type-getallfilesinaprojectofatype').value
    url = apiData.projectsPath + project + '/files' + '?type='+ type ;
  }
  var xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
  if(xhr.readyState == 4 && xhr.status == 200) {
    console.log( xhr.responseText);
      var data = JSON.parse(xhr.responseText);
      document.getElementById('results').innerHTML = JSON.stringify(data, null, 4);
    }
  }
  xhr.send();
}

function apiPost(action, file, data){
  var type = 'unknown';
  if (action === 'postfile'){
    if (file.type !== '') type = file.type;
  }
  var projectName = '';
  var url = '';
  if (action === 'postmakeproject'){
    projectName = document.getElementById('postmakeproject').value;
    url = apiData.projectsPath + projectName;
  } else {
    projectName = document.getElementById('postproject').value;
    url = apiData.projectsPath + projectName + '/files/' + file.name;
  }
  if (projectName === '') return;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
  if(xhr.readyState == 4 && xhr.status == 200) {
      document.getElementById('results').innerHTML = xhr.responseText;
    }
  }

  if (subdata !== undefined){
    var subdata = data;
    if (type.indexOf("image") !== -1 || type.indexOf("sound") !== -1); data.substring(data.indexOf(",") + 1);
    xhr.send("data="+encodeURIComponent(subdata));
  } else xhr.send();
}
