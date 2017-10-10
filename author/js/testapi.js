document.onreadystatechange = function(){
 if(document.readyState === 'complete'){
  apiGet("./api/v1/files");
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

function apiPost(params, input, data){
  if (input === undefined) return;
  console.log(params);
  return;
  params += '/' + document.getElementById(input).value;
  var xhr = new XMLHttpRequest();
  var url = params;
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
  if(xhr.readyState == 4 && xhr.status == 200) {
      var data = xhr.responseText
      document.getElementById('results').innerHTML =data;
    }
  }
  if (data !== undefined) xhr.send("data="+encodeURIComponent(JSON.stringify(data)));
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
