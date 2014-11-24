
// run from mongodb shell
var transcriptions = db.fs.files.find({'metadata.project':'21', 'metadata.shortname': {$exists:true}, 'metadata.filetype':'text/xml'});

transcriptions.forEach(function(t){
  var shortname = t.metadata.shortname;
  shortname = t.metadata.shortname.charAt(0).toUpperCase() + t.metadata.shortname.slice(1);
  var resourceid = t.metadata["_resourceid"];
  // find the corresponding version using hnum
  var version = db.versions.findOne({'metadata.project':'21', 'metadata.name': shortname});
  if (version && version.metadata.artefacts && version.metadata.artefacts.length > 0){
    print("attaching " + resourceid + " to " + shortname);
    // there should be only one artefact
    var artefact = version.metadata.artefacts[0];
    // attach as a diplomatic transcription
    db.artefacts.update({"_id": ObjectId(artefact)},{$set:{"metadata.transcriptions": [resourceid], "_revisions.0.transcriptions": [resourceid]}})
  } 
});

/* remove version transcriptions that were created previously

var version = db.versions.find({'metadata.project':'21'})
version.forEach(function(v){
  db.versions.update({'_id':v._id},{$set:{'metadata.transcriptions':"","_revisions.0.transcriptions":""}});
})

*/
