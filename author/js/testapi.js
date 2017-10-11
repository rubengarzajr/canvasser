var apiData = {
  projectPath: './api/v1/projects/'
}

document.onreadystatechange = function(){
 if(document.readyState === 'complete'){
  apiGet("./api/v1/files");
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
    if (file.type.indexOf('image') !== -1)  reader.readAsDataURL(file);
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

function apiGet(params, input){
  if (input !== undefined) params += document.getElementById(input).value;
  var xhr = new XMLHttpRequest();
  var url = params;
  xhr.open("GET", url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
  if(xhr.readyState == 4 && xhr.status == 200) {
      var data = JSON.parse(xhr.responseText)
      document.getElementById('results').innerHTML = JSON.stringify(data, null, 4);
    }
  }
  xhr.send();
}

function apiPost(action, file, data){
  var type = 'unknown';
  if (action === 'postfile'){
    console.log(file, file.name, file.type, file.size);
    if (file.type !== '') type = file.type;
  }
  if (action === 'postmakeproject'){
    return;
  }
  var projectName = document.getElementById('postproject').value;
  var url = apiData.projectPath + projectName + '/files/' + file.name;

  console.log(url)
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
  if(xhr.readyState == 4 && xhr.status == 200) {
      document.getElementById('results').innerHTML = xhr.responseText;
    }
  }
  //if (data !== undefined) xhr.send("data="+encodeURIComponent(JSON.stringify(data)));
  var subdata = data.substring(data.indexOf(",") + 1);
  console.log(subdata)
  if (subdata !== undefined) xhr.send("data="+encodeURIComponent(subdata));
  else xhr.send();
}

function apiDelete(input){
  var path = './api/v1/projects/';
  if (input === 'project'){
      path += document.getElementById('deleteprojectname').value;
  }
  if (input === 'file'){
    console.log('hi')
    path += document.getElementById('deletefilesprojectname').value;
    path += '/files/';
    path += document.getElementById('deletefilesfilename').value;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", path, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
  if(xhr.readyState == 4 && xhr.status == 200) {
      var data = xhr.responseText
      document.getElementById('results').innerHTML =data;
    }
  }
  xhr.send();
}
