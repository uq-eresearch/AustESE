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
  var db = mongoClient.db("foo");
  var grid = new Grid(db, 'fs');

  var dir = "/Users/uqagerbe/Dropbox/Development/_harpur/+english/harpur/";
  fs.readdir(dir, function(err, dirlist) { 
    if (err){
      return console.log(err);
    }
    dirlist.forEach(function(anthDir){
      var anthName = anthDir;
      anthDir = dir + anthDir;
      var anthDirStat = fs.statSync(anthDir);
      if (anthDirStat.isDirectory()){
        fs.readdir(anthDir, function(err, workList){
          if (err){
            return console.log('Error reading anthology dir', err);
          }
          workList.forEach(function(workDir){
            var workName = workDir;
            workDir = anthDir + '/' + workDir + "/XML"; 
            if (fs.existsSync(workDir)){
              fs.readdir(workDir, function(err, versionList){
                if (err){
                  return console.log('Error reading work dir', err);
                }
                versionList.forEach(function(vers){
                  var fileName = workDir + "/" + vers;
                  var versSplit = vers.split("#");
                  var hnum;
                  if (versSplit.length < 2) {
                    hnum = workName + " " + vers.split(".")[0];
                  } else {
                    hnum = vers.split("#")[1].split(".")[0];
                  }
                  
                  function writeToGridFSPut (err,data){
                    var fileId = new ObjectID();
                    var fileData = new Buffer(data);
                    var resId = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                      return v.toString(16);
                    });
                    // TODO search for a grid fs thing with the same hnum
                    // update it
                    // otherwise create new
                    grid.put(fileData, {_id: fileId, 
                      filename: vers, 
                      content_type: 'text/xml', 
                      metadata:{
                        _resourceid: resId, 
                        shortname: hnum, 
                        filetype:'text/xml', 
                        mvdpath: anthName + "/" + workName, 
                        project:'21'}}, function(err, result) {
                      if (err){
                        console.log(err);
                      }
                      console.log(hnum);
                    })
                  }
                  bp.push(fs.readFile,fileName,writeToGridFSPut);
                });
              });
            }
          });
        });
      }
    });
  });

// remove existing harpur files

// drop everything from foo
/* 
use foo
db.fs.files.drop()
db.fs.chunks.drop()

*/
// run node importtexts.js
// then update to move resourceid:
/*

db.fs.files.update({},{$rename: {"metadata._resourceid": "_resourceid" }}, false, true )
*/
// then export 
/*
 mongoexport --db foo --collection fs.chunks --out harpurfilechunks.json
 mongoexport --db foo --collection fs.files --out harpurfilemetadata.json

 mongoimport --db test --collection fs.chunks --file harpurfilechunks.json
 mongoimport --db test --collection fs.files --file harpurfilemetadata.json
*/
});