<?php

$contentPath = getenv('CONTENT_PATH');
if (empty($contentPath)){
  $contentPath = '/var/www/html/canvasser_content';
}

chdir($contentPath);

$start = './';
$len = strlen($start);

$Directory = new RecursiveDirectoryIterator($start);
$Iterator = new RecursiveIteratorIterator($Directory);
$Regex = new RegexIterator($Iterator, '/^.+\.json|^.+\.mp3|^.+\.jpg|^.+\.gif|^.+\.png|^.+\.wav|^.+\.html/i', RecursiveRegexIterator::GET_MATCH);

echo '{"data":[';
$first = true;
foreach($Regex as $dir){
  foreach($dir as $file){
    $path_parts = pathinfo($file);
    if ($first == True){
      $first = false;
    } else {
      echo ",";
    }

    $modPath = substr($path_parts['dirname'], 2);
    $pathParts = explode("/", $modPath);
    if (count($pathParts) < 2) array_push($pathParts, '');
    echo '{"project":"' .  $pathParts[0] . '","folder":"' .  $pathParts[1] . '","file":"' . $path_parts['filename'] . '.' . $path_parts['extension'] . '"}';

  }
}
echo ']}';
?>
