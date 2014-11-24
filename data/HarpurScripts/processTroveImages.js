var csv = require('csv');
var fs = require('fs');
var $ = require('cheerio')
var request = require('request')

function grabImage(err, resp, html) {
  if (err) return console.error(err)
  var theHTML = $.load(html)
  //console.log("images: ");
  theHTML('img').map(function(i,img){ img = $(img); console.log(img.attr('src'));});

}

csv()
.from.stream(fs.createReadStream(__dirname+'/trovelist.txt'), {columns: true})
.transform( function(row){
  var url = row.URL;
  var articleId = url.substring(url.lastIndexOf('/') + 1)
  //console.log(articleId)
  //var printUrl = "http://trove.nla.gov.au/ndp/del/printArticleJpg/" + articleId + "/7?print=n";
  var printUrl = url;
  request(printUrl, grabImage)
})
