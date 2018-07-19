<?php
$contentModifier = '';
$authControl = getenv('AUTH_CONTROL');

$contentPath = getenv('CONTENT_PATH');
if (empty($contentPath)){
  $contentPath = '/var/www/html/canvasser_content';
}

$contentDeleted = getenv('CONTENT_DELETED');
if (empty($contentDeleted)){
  $contentDeleted = '/var/www/html/canvasser_content_deleted';
}

if ($authControl !== FALSE){
  include $authControl;
}

$contentPath .= $contentModifier;


$contentUrl = getenv('CONTENT_URL');
if (empty($contentUrl)){
  $contentUrl = (($_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://") . $_SERVER['HTTP_HOST'] . '/canvasser_content';
}

$contentUrl .= $contentModifier;

$supportedFiles = array('gif','html','jpg','json','mp3','png','svg','wav');
$imageFiles     = array('gif','jpg','svg','png');
$soundFiles     = array('mp3','wav');

$url   = preg_replace('/\?.*/', '', $_SERVER['REQUEST_URI']);
$path  = explode("/",$url);
$path  = array_filter($path, create_function('$value', 'return $value !== "";'));
$api   = array();
$isApi = false;

foreach ($path as $value) {
  if ($isApi) {array_push($api, $value);}
  if ($value == 'api') {$isApi = True;}
}

if (!$isApi)         {die('{"error":"NOT API!"}');}
if ($api[0] != 'v1') {die('{"error":"NOT v1 of API!"}');}

array_shift($api);

if ($_SERVER['REQUEST_METHOD'] == 'POST'){
  $project = clean($api[1]);
  $projectPath = $contentPath . '/' . $project;
  if (!file_exists($contentPath . '/' . $project)) {
    mkdir($contentPath . '/' . $project, 0744);
  }

  if (count($api) == 2){
    echo '[{"status":"successful"}]';
  } else if ($api[2] == 'files'){
    $fileNameFull  = strtolower(clean(basename($_FILES["fileToUpload"]["name"])));
    $pathParts     = pathinfo($fileNameFull);
    $fileName      = $pathParts['filename'];
    $extension     = $pathParts['extension'];
    $data          = $_POST['data'];
    $outType       = $extension;

    if (!in_array($extension,$supportedFiles)){die('{"error":"File type not supported: ' . $fileNameFull . ' ' . $extension . '."}');}
    if (in_array($extension,$imageFiles)){$outType = 'image';}
    if (in_array($extension,$soundFiles)){$outType = 'sound';}

    $returnOut = array();

    if ($extension == 'json') {
      $html = '<html>' . "\r\n";
      $html .= '<head>' . "\r\n";
      $html .= '    <meta charset="UTF-8">' . "\r\n";
      $html .= '    <script src="../../../../canvasser/canvasser.js" type="text/javascript"></script>' . "\r\n";
      $html .= '    <link href=".../../../../canvasser/author/css/normalize.css" rel="stylesheet" type="text/css"/>' . "\r\n";
      $html .= '    <link href=".../../../../canvasser/author/css/canvasser.css" rel="stylesheet" type="text/css"/>' . "\r\n";
      $html .= '    <title>' . $project . ': ' . $fileName . '</title>' . "\r\n";
      $html .= '</head>' . "\r\n";
      $html .= '  <body onload=\'initCanvasser("activity","./' . $fileName . '.json", "file");\'>' . "\r\n";
      $html .= '    <div id=\'canvasholder\'></div>' . "\r\n";
      $html .= '  </body>' . "\r\n";
      $html .= '</html>' . "\r\n";
      file_put_contents($projectPath . "/" . $fileName . ".html", $html);
      array_push($returnOut, '{"project": "' . $project . '", "url":"' . $contentUrl . DIRECTORY_SEPARATOR . $project . DIRECTORY_SEPARATOR . $fileName .  '.html", "type":"html"}');
    }

    error_log($contentPath . DIRECTORY_SEPARATOR . $project . DIRECTORY_SEPARATOR . $fileNameFull);
    if (file_exists( $contentPath . DIRECTORY_SEPARATOR . $project . DIRECTORY_SEPARATOR . $fileNameFull)) {
      deleteFileBk($contentPath, $contentDeleted, $project, $fileNameFull);
    }

    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $projectPath . DIRECTORY_SEPARATOR . $fileNameFull)) {
      array_push($returnOut, '{"project": "' . $project . '", "url":"' . $contentUrl . DIRECTORY_SEPARATOR . $project . DIRECTORY_SEPARATOR . $fileNameFull .  '", "type":"' . $outType . '"}');
    } else {
      array_push($returnOut, '{"error":"' . $_FILES["fileToUpload"]["tmp_name"] . ' not saved!"}');
    }
    echo '[';
    for ($cnt = 0; $cnt < count($returnOut); $cnt++) {
        echo($returnOut[$cnt]);
        if ($cnt <  count($returnOut)-1){
          echo ',';
        }
    }
    echo ']';
  }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  $filterArray = $supportedFiles;
  if (!empty($_REQUEST['type'])) {
    $getType = clean($_REQUEST['type']);
    if ($getType == 'image') {
      $filterArray = $imageFiles;
    } else if ($getType == 'sound') {
      $filterArray = $soundFiles;
    } else {
      $filterArray = array(clean($_REQUEST['type']));
    }
  }

  if ($api[0] == 'files'){
    arrayToJSON(dirToJSON($contentPath), $contentPath, $contentUrl, $filterArray );
  }
  if ($api[0] == 'projects'){
    if (count($api) == 1) {
      die (dirList($contentPath));
    }
    if($api[2] == 'files'){
      if ($api[1] == '') {die('{"error":"No project specified."}');}
      arrayToJSON(dirToJSON($contentPath . DIRECTORY_SEPARATOR . $api[1]), $contentPath, $contentUrl, $filterArray);
    }
  }
}

function arrayToJSON($array, $path, $url,  $filterArray){
  global $supportedFiles, $imageFiles, $soundFiles;
  echo '[';
  $cnt   = count($array);
  $first = True;
  foreach ($array as $value){
    $replaced  = str_replace($path, $url, $value);
    $stripped  = str_replace($path . '/', '', $value);
    $pathParts = pathinfo($value);
    $extension = $pathParts['extension'];
    $type      = $extension;
    $outType   = $extension;
    $project   = explode(DIRECTORY_SEPARATOR, $stripped);
    if (!in_array($type,$filterArray)){continue;}
    if (in_array($type,$imageFiles)){$outType = 'image';}
    if (in_array($type,$soundFiles)){$outType = 'sound';}

    if ($first){
      $first = False;
    } else {
      echo ',';
    }
    echo '{"project":"' .$project[0]  . '", "url":"' . $replaced . '","type":"' . $outType . '"}';
  }
  echo ']';
}


function dirList($dir) {
  $result = array();
  $cdir   = scandir($dir);
  foreach ($cdir as $key => $value){
    if (in_array($value, array(".",".."))){continue;}
    if (is_dir($dir . DIRECTORY_SEPARATOR . $value)){
        array_push($result, $value);
      }
  }

  $output = "[";
  for ($counter=0; $counter < count($result); $counter++) {
    $output .= '"' . $result[$counter] . '"';
    if ($counter < count($result) -1) {
      $output .= ',';
    }
  }
  $output .= "]";
  echo $output;
}

function dirToJSON($dir) {
  $result = array();
  $cdir   = scandir($dir);

  foreach ($cdir as $key => $value){
    if (in_array($value, array(".",".."))){continue;}
    if (is_dir($dir . DIRECTORY_SEPARATOR . $value)){
      $newArray = dirToJSON($dir . DIRECTORY_SEPARATOR . $value);
      foreach ($newArray as $newValue){
        array_push($result, $newValue);
      }
    } else {
      array_push($result, $dir . DIRECTORY_SEPARATOR . $value);
    }
  }
   return $result;
}

function dirToArray($dir) {
  $result = array();
  $cdir   = scandir($dir);
  foreach ($cdir as $key => $value){
    if (!in_array($value,array(".",".."))){
      if (is_dir($dir . DIRECTORY_SEPARATOR . $value)){
        $result[$value] = dirToArray($dir . DIRECTORY_SEPARATOR . $value);
      } else {
        $result[] = $value;
      }
    }
  }
   return $result;
}


if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  if ($api[0] == 'projects'){
    if (count($api) == 2){
      delTree($contentPath . '/' . clean($api[1]));
      echo '[{"status":"delete command received"}]';
    }else if($api[2] == 'files'){
      $result = deleteFileBk($contentPath, $contentDeleted, clean($api[1]), clean($api[3]));
      echo '[{"status":"delete "' . $result . '"}]';
    }
  }
}

function delTree($dir) {
  $files = array_diff(scandir($dir), array('.','..'));
    foreach ($files as $file) {
      (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
    }
  return rmdir($dir);
}

function deleteFileBk($contentPath, $contentDeleted, $project, $file) {
  $path_parts = pathinfo($file);
  $fileName   = $path_parts['filename' ];
  $extension  = $path_parts['extension'];
  $cnt        = 0;
  $old        = $contentPath    . DIRECTORY_SEPARATOR . $project . DIRECTORY_SEPARATOR . $file;
  $new        = $contentDeleted . DIRECTORY_SEPARATOR . $project . DIRECTORY_SEPARATOR . $fileName . '.' . sprintf("%'.05d", $cnt) . '.' .$extension;

  if (!file_exists($contentDeleted . DIRECTORY_SEPARATOR . $project)) {
    mkdir($contentDeleted . DIRECTORY_SEPARATOR . $project, 0744);
  }
  while (file_exists($new)) {
    $cnt ++;
    $new       = $contentDeleted . DIRECTORY_SEPARATOR . $project . DIRECTORY_SEPARATOR . $fileName . '.' . sprintf("%'.05d", $cnt) . '.' .$extension;
  }
  return rename($old,$new);
}

function deleteFile($contentPath, $contentUrl, $file) {
  $start     = $contentPath;
  $len       = strlen($start) + 1;
  $Directory = new RecursiveDirectoryIterator($start);
  $Iterator  = new RecursiveIteratorIterator($Directory);
  $fileList  = new RecursiveIteratorIterator($Directory, RecursiveIteratorIterator::SELF_FIRST);

  foreach($fileList as $testFile){
    $path_parts = pathinfo($testFile);
    if ( $path_parts['basename'] == $file) {unlink($testFile);}
  }
}

function clean($string) {
  $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
  $string = preg_replace('/[^A-Za-z0-9\-_\.]/', '', $string); // Removes special chars.
  return preg_replace('/-+/', '-', $string); // Replaces multiple hyphens with single one.
}

function finder($contentPath, $contentUrl, $type) {
  $start     = $contentPath;
  $len       = strlen($start) + 1;
  $Directory = new RecursiveDirectoryIterator($start);
  $Iterator  = new RecursiveIteratorIterator($Directory);
  $Regex     = new RegexIterator($Iterator, $type, RecursiveRegexIterator::GET_MATCH);

  echo '[';
  $first = true;
  foreach($Regex as $dir){
    foreach($dir as $file){
      $path_parts = pathinfo($file);
      if ($first == True){
        $first = false;
      } else {
        echo ",";
      }
      $modPath = substr($path_parts['dirname'] ,$len);
      $pathParts = explode("/", $modPath);
      if (count($pathParts) < 2) array_push($pathParts, '');
      echo '{"project":"' .  $pathParts[0] . '","file":"' . $contentUrl . '/' . $pathParts[0] . '/' . $path_parts['filename'] . '.' . $path_parts['extension'] . '"}';
    }
  }
  echo ']';
}

function finderFile($contentPath, $contentUrl, $file) {
  $start     = $contentPath;
  $len       = strlen($start) + 1;
  $Directory = new RecursiveDirectoryIterator($start);
  $Iterator  = new RecursiveIteratorIterator($Directory);
  $fileList  = new RecursiveIteratorIterator($Directory, RecursiveIteratorIterator::SELF_FIRST);

  foreach($fileList as $testFile){
    $path_parts = pathinfo($testFile);
    if ( $path_parts['basename'] == $file) {echo '[{"url":"'.$testFile.'"}]'  . ' </br>';}
  }
}

?>
