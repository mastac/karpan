<?php

//extract data from the post
extract($_POST);

//set POST variables
$url = 'http://kaptest.us7.list-manage.com/subscribe/post';
$fields = array(
    'u' => urlencode($u),
    'id' => urlencode($id),
    'MERGE0' => urlencode($MERGE0),
    'MERGE1' => urlencode($MERGE1),
    'MERGE2' => urlencode($MERGE2),
    'MERGE3' => urlencode($MERGE3),
    'MERGE4' => urlencode($MERGE4),
    'MERGE5' => urlencode($MERGE5)
);

//error_log(print_r($_POST, 1)."\n\n\n", 3, '/var/www/vhosts/karpan.lo/data.log');

//url-ify the data for the POST
$fields_string = '';
foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }

//error_log(print_r($fields_string, 1), 3, '/var/www/vhosts/karpan.lo/data.log');

if (isset($MERGE6) && isset($MERGE6['area'])) {
    $fields_string .= 'MERGE6[area]=' . $MERGE6['area'] . '&';
}
if (isset($MERGE6) && isset($MERGE6['detail1'])) {
    $fields_string .= 'MERGE6[detail1]=' . $MERGE6['detail1'] . '&' ;
}
if (isset($MERGE6) && isset($MERGE6['detail2'])) {
    $fields_string .= 'MERGE6[detail2]=' . $MERGE6['detail2'] . '&' ;
}

//error_log(print_r($group, 1)."\n\n\n", 3, '/var/www/vhosts/karpan.lo/data.log');

if (isset($group) && isset($group['457']) && isset($group['457']['1'])) {
    $fields_string .= 'group[457][1]=' . $group['457']['1'] . '&' ;
}
if (isset($group) && isset($group['457']) && isset($group['457']['2'])) {
    $fields_string .= 'group[457][2]=' . $group['457']['2'] . '&' ;
}
if (isset($group) && isset($group['457']) && isset($group['457']['4'])) {
    $fields_string .= 'group[457][4]=' . $group['457']['4'] . '&' ;
}
if (isset($group) && isset($group['457']) && isset($group['457']['8'])) {
    $fields_string .= 'group[457][8]=' . $group['457']['8'] . '&' ;
}
if (isset($group) && isset($group['457']) && isset($group['457']['16'])) {
    $fields_string .= 'group[457][16]=' . $group['457']['16'] . '&' ;
}
if (isset($group) && isset($group['457']) && isset($group['457']['32'])) {
    $fields_string .= 'group[457][32]=' . $group['457']['32'] . '&' ;
}
if (isset($group) && isset($group['457']) && isset($group['457']['64'])) {
    $fields_string .= 'group[457][64]=' . $group['457']['64'] . '&' ;
}
rtrim($fields_string, '&');
//error_log("\n\n\n". $fields_string."\n\n\n", 3, '/var/www/vhosts/karpan.lo/data.log');


//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);

//execute post
$result = curl_exec($ch);
//error_log($result, 3, './data.log');
$pattern = '/.*?(We need to confirm your email address).*?/i';
if (preg_match_all($pattern, $result, $matches)) {
    echo "success";
} else {
    echo "fail";
}
//print_r($matches);
//error_log(print_r($matches,1), 3, './data.log');

//close connection
curl_close($ch);
