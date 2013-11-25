
// into test
// mongoimport -d test -c mappings --file harpur_data_mappings.json

// first process images with placeholders in their URL
// [++++] local file was originally in heurist
// http://setis.library.usyd.edu.au/ozedits/harpur/ from SETIS
// 
var mappings = db.mappings.find({'metadata.imageUrl':/setis/});
function paddy(n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
}
mappings.forEach(function(m){
    var mappingData = m.metadata;
    //printjson(mappingData);
    var imageUrl = mappingData.imageUrl;
    var images = imageUrl.split(";");
    images.forEach(function(i){
      var checkSetis = i.match(/setis/);
      if (checkSetis) {
        var imageUrlList = [];
        var toSplit = i.split(" TO ");
        if (toSplit.length > 1){
          // process to files
          var firstUrlLastSlash = toSplit[0].lastIndexOf("/");
          var firstNum = parseInt(toSplit[0].substring(firstUrlLastSlash + 1).split(".")[0],10);
          var lastNum = parseInt(toSplit[1].substring(toSplit[1].lastIndexOf("/") + 1).split(".")[0],10);
          var urlBase = toSplit[0].substring(0,firstUrlLastSlash + 1);
          var actualFileName = i.substring(i.lastIndexOf("/") + 1).trim();
          var urlSplit = i.split("/");
          var mssName = urlSplit[urlSplit.length - 2];
          var paddyAmount = 8;
          if (mssName == "C381" || mssName == "C377"){
            paddyAmount = 4;
          }
          for (var i = firstNum; i <= lastNum; i++){
                imageUrlList.push((urlBase + paddy(i, paddyAmount) + ".jpg").trim());
          }
        } else {
          imageUrlList.push(i);
        }
        imageUrlList.forEach(function(i){
          //print(urlBase + " " + firstNum + " to  " + lastNum );
          var actualFileName = i.substring(i.lastIndexOf("/") + 1).trim();
          var urlSplit = i.split("/");
          var mssName = urlSplit[urlSplit.length - 2];
          if (mssName == "jpeg"){
            mssName = "A92-jpeg";
          }
          var imageName = urlSplit[urlSplit.length - 1];
          var finalFileName =  mssName + "-" + imageName;

          // split on . to get file name and extension
          var fileTitle= finalFileName.split(".")[0];
          var resource = db.fs.files.findOne({'metadata.project':'21', 'metadata.title':fileTitle});
          if (resource){
            var resourceId = resource._resourceid;
            //print("found " + fileTitle);
            db.fs.files.update({"_id":resource._id},{$set:{'metadata.source':i.trim()}});
            db.artefacts.update({'_id': ObjectId(mappingData.artefact)},{'$push': {'metadata.facsimiles':resourceId, '_revisions.0.facsimiles':resourceId}});
          } else {
            print("couldn't find " + fileTitle);
          }
          
        });
      }
    }); 

});
// db.mappings.update({'_id':ObjectId("5283054ebc1fd4389f13a3ab")},{imageUrl:'http://setis.library.usyd.edu.au/ozedits/harpur/C378/00000009.jpg'})
//db.artefacts.update({'metadata.project': '21'},{'$set': {'metadata.facsimiles':[], '_revisions.0.facsimiles':[]}},{multi:true});
