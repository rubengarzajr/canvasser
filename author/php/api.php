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

echo "<h1>Canvasser API</h1>" . '<br>';
echo $_SERVER['REQUEST_URI'] . '<br><br>';
echo $_SERVER['PHP_SELF'] . '<br><br>';
echo $_SERVER['HTTP_HOST'] . '<br><br>';
$url = preg_replace('/\?.*/', '', $_SERVER['REQUEST_URI']);
$path = explode("/",$url);

$api = [];
$isApi = false;

foreach ($path as $value) {
  if ($isApi) {array_push($api, $value);}
  if ($value == 'api') {$isApi = True;}
}

if (!$isApi)         {die("NOT API!");}
if ($api[0] != 'v1') {die("NOT v1 of API!");}

array_shift($api);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // …
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

  if ($api[0] == 'files'){
    if (empty($_REQUEST['type'])) {
      $type = $supportedFileTypes;
    } else {
      $type = '/^.+\.' . clean($_REQUEST['type']) . '/i';
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
    // …
}


function clean($string) {
  $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
  $string = preg_replace('/[^A-Za-z0-9\-_]/', '', $string); // Removes special chars.
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
      echo '{"project":"' .  $pathParts[0] . '","folder":"' .  $pathParts[1] . '","file":"' . $path_parts['filename'] . '.' . $path_parts['extension'] . '"}';
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