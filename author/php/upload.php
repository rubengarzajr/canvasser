<?php

  $contentPath = getenv('CONTENT_PATH');
  if (empty($contentPath)){
    $contentPath = '/var/www/html/canvasser_content';
  }

  $project = clean($_POST['project']);
  $file    = clean($_POST['file']);
  $data    = $_POST['data'];
  $type    = $_POST['type'];

  $projectPath = $contentPath . '/' . $project;

  if (!file_exists($contentPath . '/' . $project)) {
    echo "Creating project: " . $project . '<br>';
    mkdir($contentPath . '/' . $project, 0744);
    mkdir($projectPath . '/json', 0744);
    mkdir($projectPath . '/image', 0744);
    mkdir($projectPath . '/sound', 0744);
  }

  if ($type === 'json') {
    file_put_contents($projectPath . "/json/" . $file . ".json", $data);
    echo "File saved: " . $file . '<br>';

    $html = '<html>' . "\r\n";
    $html .= '<head>' . "\r\n";
    $html .= '    <meta charset="UTF-8">' . "\r\n";
    $html .= '    <script src="../../../../canvasser/canvasser.js" type="text/javascript"></script>' . "\r\n";
    $html .= '    <link href=".../../../../canvasser/author/css/normalize.css" rel="stylesheet" type="text/css"/>' . "\r\n";
    $html .= '    <link href=".../../../../canvasser/author/css/canvasser.css" rel="stylesheet" type="text/css"/>' . "\r\n";
    $html .= '    <title>' . $project . ': ' . $file . '</title>' . "\r\n";
    $html .= '</head>' . "\r\n";
    $html .= '  <body onload=\'initCanvasser("activity","./json/' . $file . '.json", "file");\'>' . "\r\n";
    $html .= '    <div id=\'canvasholder\'></div>' . "\r\n";
    $html .= '  </body>' . "\r\n";
    $html .= '</html>' . "\r\n";
    file_put_contents($projectPath . "/" . $file . ".html", $html);
    echo "HTML created: " . $file;
  }
  if ($type === 'image' || $type === 'sound') {
    $imageData = base64_decode($data);
    $ext = clean($_POST['ext']);
    file_put_contents($projectPath . '/' . $type . '/' . $file . '.' . $ext, $imageData);
    echo $type . ' saved: ' . $file;
  }

  function clean($string) {
    $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
    $string = preg_replace('/[^A-Za-z0-9\-_]/', '', $string); // Removes special chars.
    return preg_replace('/-+/', '-', $string); // Replaces multiple hyphens with single one.
  }
?>
