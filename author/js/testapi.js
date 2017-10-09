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

function apiDelete(params, input){
  if (input !== undefined) params += document.getElementById(input).value;
  var xhr = new XMLHttpRequest();
  var url = params;
  xhr.open("DELETE", url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
  if(xhr.readyState == 4 && xhr.status == 200) {
      var data = xhr.responseText
      document.getElementById('results').innerHTML =data;
    }
  }
  xhr.send();
}
