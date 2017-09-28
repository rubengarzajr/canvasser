<?php
  //TODO: Make this env var
  chdir('/var/www/html/canvasser_content');

  $project = clean($_POST['project']);
  $file    = clean($_POST['file']);
  $data    = $_POST['data'];
  $type    = $_POST['type'];

  if (!file_exists($project)) {
    echo "Creating project " . $project . "\n";
    mkdir($project, 0744);
    mkdir($project . '/json', 0744);
    mkdir($project . '/image', 0744);
    mkdir($project . '/sound', 0744);
  }

  $dir = getcwd();
  chdir( $dir . "/" .  $project);
  echo "Working dir: " . getcwd() . "\n";

  if ($type === 'json')   {file_put_contents("./json/" . $file . ".json", $data);}
  if ($type === 'image') {
    //$imageData = base64_decode(urldecode($data));
    $imageData = base64_decode($data);
    $ext = clean($_POST['ext']);
    file_put_contents("./image/" . $file . "." . $ext, $imageData);
  }

  function clean($string) {
    $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
    $string = preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
    return preg_replace('/-+/', '-', $string); // Replaces multiple hyphens with single one.
  }
?>
