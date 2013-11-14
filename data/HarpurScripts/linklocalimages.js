
// into test
// mongoimport -d test -c mappings --file harpur_data_mappings.json

// first process images with placeholders in their URL
// [++++] local file was originally in heurist
// http://setis.library.usyd.edu.au/ozedits/harpur/ from SETIS
// 
var mappings = db.mappings.find({'metadata.imageUrl':/\+\+\+\+/});
mappings.forEach(function(m){
    var mappingData = m.metadata;
    //printjson(mappingData);
    var imageUrl = mappingData.imageUrl;
    var images = imageUrl.split(";");
    images.forEach(function(i){
      // strip out [++++]
      var actualFileName = i.substring(i.indexOf("]") + 1).trim()
      // split on . to get file name and extension
      var fileTitle= actualFileName.split(".")[0];
      var resource = db.fs.files.findOne({'metadata.title':fileTitle});
      if (resource){
        var resourceId = resource._resourceid;
        print(fileTitle);
        db.artefacts.update({'_id': ObjectId(mappingData.artefact)},{'$set': {'metadata.facsimiles':[resourceId], '_revisions.0.facsimiles':[resourceId]}});
      } else {
        print("couldn't find " + fileTitle);
      }
    }); 

});