<?php

//echo __FILE__;
echo '<br>';

//exec('cp -R /mnt/dev/dev.texasbeyondhistory.net/canvasser_content_apache/. /mnt/dev/dev.texasbeyondhistory.net/canvasser_content 2>&1', $output, $return_var);

exec('mkdir /mnt/www/laits.utexas.edu/canvasser/canvasser_content 2>&1', $output, $return_var);
//exec('cp -R /mnt/dev/dev.texasbeyondhistory.net/canvasser_content/. /mnt/www/laits.utexas.edu/canvasser/canvasser_content 2>&1', $output, $return_var);

foreach ($output as $key => $val) {
   echo $val;
}
?>
