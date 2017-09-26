<?php
   //echo($_POST['data']);
   $data = json_decode($_POST['data'], true);
   echo($data['images'][0]['local']);
?>
