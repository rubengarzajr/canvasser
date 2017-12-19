<html>
  <head>
    <meta charset="UTF-8">
    <title>Restore</title>

    <link rel="shortcut icon" href="../favicon.ico" />
    <link href="../css/normalize.css" rel="stylesheet" type="text/css"/>
    <link href="../css/canvasser.css" rel="stylesheet" type="text/css"/>
    <script src="../js/restore.js"         type="text/javascript"></script>
<style>
/* unvisited link */
a:link {
    color: rgb(50,50,50);
    text-decoration: none;
}

/* visited link */
a:visited {
    color: rgb(50,50,50);
    text-decoration: none;
}

/* mouse over link */
a:hover {
    color: rgb(10,250,10);
    text-decoration: none;
}

/* selected link */
a:active {
    color: rgb(50,50,50);
    text-decoration: none;
}
</style>

  </head>
  <body>
    <div class="header">
      <div class="titlecenter" id="titlelabel">Canvasser Recover File Utility</div>
    </div>
    <div class="outwin">

  <?php

$contentDeleted = getenv('CONTENT_DELETED');
if (empty($contentDeleted)){
  $contentDeleted = '/var/www/html/canvasser_content_deleted';
}

$contentUrl = getenv('CONTENT_URL');
if (empty($contentUrl)){
  $contentUrl = (($_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://") . $_SERVER['HTTP_HOST'] . '/canvasser_content_deleted';
}

$path = $contentDeleted;
$list = array();
$objects = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path), RecursiveIteratorIterator::SELF_FIRST);
foreach($objects as $file){
  if (is_dir($file)){continue;}
  $pathParts = pathinfo($file);
  $dirName   = $pathParts['dirname'];
  $baseName  = $pathParts['basename'];
  $fileName  = $pathParts['filename'];
  $extension = $pathParts['extension'];
  $project   = substr($dirName, strrpos($dirName, DIRECTORY_SEPARATOR) + 1);

  if(!array_key_exists ($project, $list)){$list[$project] = array();}
  array_push($list[$project],$baseName);
}

ksort($list);
foreach($list as $project => $files){
  echo '<div class="load_project">' . $project . '</div>';
  asort($files);
  foreach($files as $file){
    echo '<div class="load_file"><a href="' . $contentUrl . DIRECTORY_SEPARATOR . $project . DIRECTORY_SEPARATOR . $file . '" download>' . $file . '</a></div>';
  }
}

?>
</div>
</body>
</html>
