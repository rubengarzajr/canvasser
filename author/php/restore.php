<html>
  <head>
    <meta charset="UTF-8">
    <title>Restore</title>

    <link rel="shortcut icon" href="../favicon.ico" />
    <link href="../css/normalize.css" rel="stylesheet" type="text/css"/>
    <link href="../css/canvasser.css" rel="stylesheet" type="text/css"/>
    <script src="../js/restore.js"         type="text/javascript"></script>
  </head>
  <body>
    <div class="header">
      <div class="titlecenter" id="titlelabel">Canvasser Restore Files</div>
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

$objects = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path), RecursiveIteratorIterator::SELF_FIRST);
$currentProject = '';
foreach($objects as $file){

  $pathParts     = pathinfo($file);
  $dirName       = $pathParts['dirname'];
  $baseName      = $pathParts['basename'];
  $fileName      = $pathParts['filename'];
  $extension     = $pathParts['extension'];
  $project       = substr($file, strrpos($file, DIRECTORY_SEPARATOR) + 1);

  if (is_dir($file)){
    if ($baseName == '.' || $baseName == '..') {continue;}
    $currentProject = $project;
    echo '<div class="load_project">' . $project . '</div>';
    continue;
  }

  if ($baseName == '.' || $baseName == '..') {continue;}
  $project = substr($file, strrpos($file, DIRECTORY_SEPARATOR) + 1);
  echo '<div class="load_file"><a href="' . $contentUrl . DIRECTORY_SEPARATOR . $currentProject . DIRECTORY_SEPARATOR . $baseName . '" download>' . $baseName . '</a></div>';
}

?>
</div>
</body>
</html>
