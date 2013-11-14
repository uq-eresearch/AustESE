// 2725 total
// 329 with empty imageUrl
// 2190 with http
// 206 with [++++]
// 1821 versions with images from SETIS
// 367 nla e.g. http://nla.gov.au/nla.news-article60250639 or http://trove.nla.gov.au/ndp/del/article/31737846


// urls in the form http://setis.library.usyd.edu.au/ozedits/harpur/A96/00000068.jpg
// run as nodejs app
var mongo = require('mongodb'),
  http = require("http"),
  fs = require("fs"),
  Db = mongo.Db,
  Server = mongo.Server,
  MongoClient = mongo.MongoClient;

  
var mongoClient = new MongoClient(new Server('localhost', 27017),{safe:true});


mongoClient.open(function(err, mongoClient) {
  var db = mongoClient.db("mappings");
  function paddy(n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
  }
  function downloadFile(){
    // var downloadFile = filed(temp.path({prefix: 'A96-00000068', suffix: '.jpg'}));
    // request(im).pipe(downloadFile);
  }
  var setismappings = db.collection('mappings').find({'metadata.imageUrl':/setis/}).toArray(function(err, mappings){
    var imageUrlList = [];
    mappings.forEach(function(m){
      //console.log("next object",m);
      if (err){
          console.log(err);
      }
      var images = m.metadata.imageUrl.split(";");

      images.forEach(function(im){
        // test if image has setis (again because it might be a compound field with other files)
        var checkSetis = im.match(/setis/);
        if (checkSetis) {
          // check for TO (29 records with)
          var toSplit = im.split(" TO ");
          if (toSplit.length > 1){
            // process to files
            var firstUrlLastSlash = toSplit[0].lastIndexOf("/");
            var firstNum = parseInt(toSplit[0].substring(firstUrlLastSlash + 1).split(".")[0],10);
            var lastNum = parseInt(toSplit[1].substring(toSplit[1].lastIndexOf("/") + 1).split(".")[0],10);
            var urlBase = toSplit[0].substring(0,firstUrlLastSlash + 1);
            console.log(urlBase + " " + firstNum + " to  " + lastNum );
            for (var i = firstNum; i <= lastNum; i++){
                imageUrlList.push((urlBase + paddy(i, 8) + ".jpg").trim());

            }
          } else {
            // single URL
            imageUrlList.push(im.trim());
          }
        }
      });
      
    });
    // dedupe image list
    var uniqueImageUrls = imageUrlList.filter(function(elem, pos) {
        return imageUrlList.indexOf(elem) == pos;
    })
    uniqueImageUrls.forEach(function(url){
        var dir = "/Users/uqagerbe/Desktop/setis/"
        var urlSplit = url.split("/");
        var mssName = urlSplit[urlSplit.length - 2];
        var imageName = urlSplit[urlSplit.length - 1];
        var finalFileName = dir + mssName + "-" + imageName;
        console.log(url);
        (function(file_savedest){
            http.get(url, function(res){
                var imagedata = '';
                res.setEncoding('binary');

                res.on('data', function(chunk){
                    imagedata += chunk
                });

                res.on('end', function(){
                    fs.writeFile(file_savedest, imagedata, 'binary', function(err){
                        if (err){
                            console.log("Error saving file_savedest: " + err);
                        } else {
                            console.log("File " + file_savedest + " saved");
                        }
                    });
                });
            });
        }(finalFileName));

    });
    mongoClient.close();
  });
})
//  for filename in jpeg-00000*; do mv "$filename" "A92-$filename"; done;

// problems
// y http://setis.library.usyd.edu.au/ozedits/harpur/A87-2/00000053.jpg - extra L
// http://setis.library.usyd.edu.au/ozedits/harpur/A95/00000000.jpg - does not exist
// y c377 - all files 00000007 - 135 - too many zeros should be 2
// y 378 - 9 - missing a zero 
// y 381 4 - 82 too many zeros