<?php

//UT Login (if not using UT Login it should ignore this.)
$eid = getenv('HTTP_UTLOGIN_EID');
//$eid = 'woo';
$contentModifier = '';
if ($eid !== FALSE){
  $userlist = file('../.users', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  $key = array_search($eid, $userlist);
  if ($key === FALSE) {$contentModifier = '_sandbox/' . $eid;}
}
