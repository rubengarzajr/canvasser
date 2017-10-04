<?php

  $contentPath = getenv('CONTENT_PATH');
  if (empty($contentPath)){
    $contentPath = '/var/www/html/canvasser_content';
  }

  $action  = clean($_POST['action']);
  $project = clean($_POST['project']);
  $dir     = clean($_POST['dir']);
  $file    = clean($_POST['file']);
  $data    = $_POST['data'];

  $projectPath = $contentPath . '/' . $project;

  if ($action == 'delete'){
    unlink($contentPath . '/' . $project . ($dir == '' ? '' : '/' . $dir ) . '/' . $file);
  }


  function clean($string) {
    $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
    $string = preg_replace('/[^A-Za-z0-9\-_]/', '', $string); // Removes special chars.
    return preg_replace('/-+/', '-', $string); // Replaces multiple hyphens with single one.
  }
?>
