<?php
$source = "/mnt/dev/dev.texasbeyondhistory.net/canvasser_content_bk";
$dest= "/mnt/dev/dev.texasbeyondhistory.net/canvasser_content";

echo __FILE__;
echo '<br>';

exec('rm -rf /mnt/dev/dev.texasbeyondhistory.net/canvasser_content/* 2>&1', $output, $return_var);

foreach ($output as $key => $val) {
   echo $val;
}
?>
