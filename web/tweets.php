<?php 
 // From http://www.queness.com/post/10778/create-a-twitter-feed-with-hash-tag-and-cache-support 
$cache = 'tweets-cache.txt';
$date = 'tweets-date.txt';
 
$currentTime = time(); // Current time
 
// Get cache time
$datefile = fopen($date, 'r');
$cacheDate = fgets($datefile);
fclose($datefile);
 
 
//check if cache has expired
if (floor(abs(($currentTime-$cacheDate) / 3600)) <= $_GET['hours'] && $cacheDate) {
 
    $cachefile = fopen($cache, 'r');
    $data = fgets($cachefile);
    fclose($cachefile);
 
} else { //renew the cache
    $data = file_get_contents('https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=austese&exclude_replies=true');
     
    // update cache file
    $cachefile = fopen($cache, 'wb');  
    fwrite($cachefile,utf8_encode($data));  
    fclose($cachefile); 
 
    // update date file
    $datefile = fopen($date, 'wb');  
    fwrite($datefile, utf8_encode(time()));  
    fclose($datefile);   
}
 
 
header('Content-type: application/json');
echo $data;
?>
