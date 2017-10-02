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
$Regex = new RegexIterator($Iterator, '/^.+\.json$/i', RecursiveRegexIterator::GET_MATCH);

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
    echo '{"project":"' . substr($path_parts['dirname'], $len, -5) . '","file":"' . $path_parts['filename']  . '"}';
  }
}
echo ']}';
?>
