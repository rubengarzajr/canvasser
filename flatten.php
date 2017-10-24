<?php

$serv = '/var/www/html/canvasser_content';
//$serv = '/mnt/dev/dev.texasbeyondhistory.net/canvasser_content';

$di = new RecursiveDirectoryIterator($serv);
foreach (new RecursiveIteratorIterator($di) as $filename => $file) {

  if (basename($filename) == '.' || basename($filename) == '..') {continue;}
  $path = explode('/', $filename);
  if ($path[count($path)-3] == 'canvasser_content') {continue;}
  echo $di . '<br>  >' . is_dir($filename) . '  ' . $filename . ' - ' . $file->getSize() . ' bytes <br/>';
  $par = dirname($filename);
  $gpar = dirname($par);
  echo dirname($filename) . '<br>';
  echo $gpar . '/' . basename($filename) . '<br>';
  rename($filename, $gpar . '/' . basename($filename));
}

?>
