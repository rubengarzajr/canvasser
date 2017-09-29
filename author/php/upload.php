<?php
  //TODO: Make this env var
  chdir('/var/www/html/canvasser_content');

  $project = clean($_POST['project']);
  $file    = clean($_POST['file']);
  $data    = $_POST['data'];
  $type    = $_POST['type'];

  if (!file_exists($project)) {
    echo "Creating project: " . $project . '<br>';
    mkdir($project, 0744);
    mkdir($project . '/json', 0744);
    mkdir($project . '/image', 0744);
    mkdir($project . '/sound', 0744);
  }

  $dir = getcwd();
  chdir( $dir . '/' .  $project);

  if ($type === 'json') {
    file_put_contents("./json/" . $file . ".json", $data);
    echo "File saved: " . $file;
  }
  if ($type === 'image' || $type === 'sound') {
    $imageData = base64_decode($data);
    $ext = clean($_POST['ext']);
    file_put_contents('./' . $type . '/' . $file . '.' . $ext, $imageData);
    echo $type . ' saved: ' . $file;
  }

  function clean($string) {
    $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
    $string = preg_replace('/[^A-Za-z0-9\-_]/', '', $string); // Removes special chars.
    return preg_replace('/-+/', '-', $string); // Replaces multiple hyphens with single one.
  }
?>
