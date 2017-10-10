<?php

$contentPath = getenv('CONTENT_PATH');
if (empty($contentPath)){
  $contentPath = '/var/www/html/canvasser_content';
}

$contentUrl = getenv('CONTENT_URL');
if (empty($contentUrl)){
  $contentUrl = $_SERVER['HTTP_HOST'] . '/canvasser_content';
}

$supportedFileTypes = '/^.+\.json|^.+\.mp3|^.+\.jpg|^.+\.gif|^.+\.png|^.+\.wav|^.+\.html/i';
$imageFileTypes = '/^.+\.jpg|^.+\.gif|^.+\.png/i';
$soundFileTypes = '/^.+\.mp3|^.+\.wav/i';

$url   = preg_replace('/\?.*/', '', $_SERVER['REQUEST_URI']);
$path  = explode("/",$url);
$api   = [];
$isApi = false;

foreach ($path as $value) {
  if ($isApi) {array_push($api, $value);}
  if ($value == 'api') {$isApi = True;}
}

if (!$isApi)         {die("NOT API!");}
if ($api[0] != 'v1') {die("NOT v1 of API!");}

array_shift($api);

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
  $project = clean($api[1]);
  $projectPath = $contentPath . '/' . $project;
  if (!file_exists($contentPath . '/' . $project)) {
    echo "Creating project: " . $project . '<br>';
    mkdir($contentPath . '/' . $project, 0744);
    mkdir($projectPath . '/json', 0744);
    mkdir($projectPath . '/image', 0744);
    mkdir($projectPath . '/sound', 0744);
  }

  if (count($api == 2)){

  }else if($api[2] == 'files'){
    echo 'make a file';
  }

}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if ($api[0] == 'files'){
    if (empty($_REQUEST['type'])) {
      $type = $supportedFileTypes;
    } else {
      $getType = clean($_REQUEST['type']);
      if ($getType == 'image') {
        echo "IMAGE <br>";
        $type = $imageFileTypes;
      } else if ($getType == 'sound') {
        $type = $soundFileTypes;
      } else {
        $type = '/^.+\.' . clean($_REQUEST['type']) . '/i';
      }

    }
    finder($contentPath, $type);
}

  if ($api[0] == 'projects'){
    if($api[2] == 'files'){
      finderFile($contentPath, $contentUrl, $api[3]);
    }
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  if ($api[0] == 'projects'){
    if (count($api) == 2){
      echo $contentPath . clean($api[1]);
      delTree($contentPath . '/' . clean($api[1]));
    }else if($api[2] == 'files'){
      deleteFile($contentPath, $contentUrl, clean($api[3]));
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


function clean($string) {
  $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
  $string = preg_replace('/[^A-Za-z0-9\-_\.]/', '', $string); // Removes special chars.
  return preg_replace('/-+/', '-', $string); // Replaces multiple hyphens with single one.
}

function finder($contentPath, $type) {
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
      echo '{"project":"' .  $pathParts[0] . '","type":"' .  $pathParts[1] . '","file":"' . $path_parts['filename'] . '.' . $path_parts['extension'] . '"}';
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

?>
