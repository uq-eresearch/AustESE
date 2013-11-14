// run as nodejs app
var mongo = require('mongodb'),
  Db = mongo.Db,
  MongoClient = mongo.MongoClient,
  Server = mongo.Server,
  ObjectID = mongo.ObjectID,
  GridStore = mongo.GridStore,
  fs = require('graceful-fs'),
  Bagpipe = require('bagpipe'),
  assert = require('assert'),
  Grid = mongo.Grid;

var bp = new Bagpipe(10);
var mongoClient = new MongoClient(new Server('localhost', 27017),{safe:true});
mongoClient.open(function(err, mongoClient) {
  var db = mongoClient.db("fooimages");
  var grid = new Grid(db, 'fs');

  var dir = "/Users/uqagerbe/Desktop/setis/A92/";
  fs.readdir(dir, function(err, dirlist) { 
    if (err){
      return console.log(err);
    }
    dirlist.forEach(function(image){
      var fileName = dir + image;
      var imageTitle = image.split(".")[0];
      function writeToGridFSPut (err,data){
        var fileId = new ObjectID();
        var fileData = new Buffer(data);
        var resId = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
        });
        grid.put(fileData, {_id: fileId, 
          filename: image, 
          content_type: 'image/jpg', 
          metadata:{_resourceid: resId, title: imageTitle, filetype:'image/jpg', project:'21'}}, function(err, result) {
          if (err){
            console.log(err);
          }
          console.log(image);
        });
      }
      bp.push(fs.readFile,fileName,writeToGridFSPut);
    });
  });
});
// in test
// db.fs.files.remove({'metadata.project':'21', 'metadata.filetype':'image/jpg'})
// in fooimages
// db.fs.files.drop()
// db.fs.chunks.drop()
// run the import script ie node loadimagefiles.js 
/*

db.fs.files.update({},{$rename: {"metadata._resourceid": "_resourceid" }}, false, true )

*/
/*
 mongoexport --db fooimages --collection fs.chunks --out harpurimagechunks.json
 mongoexport --db fooimages --collection fs.files --out harpurimagemetadata.json

 mongoimport --db test --collection fs.chunks --file harpurimagechunks.json
 mongoimport --db test --collection fs.files --file harpurimagemetadata.json
*/
