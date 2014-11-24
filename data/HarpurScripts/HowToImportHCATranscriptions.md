

# How to update HCA transcriptions in AustESE workbench

You'll need nodejs installed (install from http://nodejs.org/). Install required libraries using node packge manager (npm):

    cd HarpurScripts
    npm install

Update the path in the importtexts.js script to match location of transcription files

    node importtexts.js

This will load the files into gridfs in a mongo database called 'foo'

Check that the data looks the way you expect it should by running some queries e.g.

    use foo
    db.fs.files.findOne({'metadata.project':'21'})
    db.fs.files.find().count()

The data can then either be imported directly into the AustESE (test) mongo database using nodejs (change the db name to test) or the data can be exported and imported from json files


To export imported data from foo db to json files

    mongoexport --db foo --collection fs.chunks --out harpurfilechunks.json
    mongoexport --db foo --collection fs.files --out harpurfilemetadata.json

If you have been running the scripts locally, copy the json files to server e.g.

    scp harpurfile*.json austese.net:importtexts

Remove old HCA transcription files from AustESE test database (run this script from the mongo shell i.e. run mongo and then paste into the shell and hit enter to run it)

    db.fs.files.remove({'metadata.project':'21', 'metadata.filetype':'text/xml'})
    // remove orphaned file chunks
    var cursor = db.fs.chunks.find({}, {"_id" : 1, "files_id" : 1});
    while (cursor.hasNext()) {
      var chunk = cursor.next();
      if (db.fs.files.findOne({_id : chunk.files_id}) == null) {
        db.fs.chunks.remove({"_id": chunk._id})
      }
    }

Import the new files from the exported files (run from terminal)

    mongoimport --db test --collection fs.chunks --file harpurfilechunks.json
    mongoimport --db test --collection fs.files --file harpurfilemetadata.json


Now link the transcriptions with the metadata records (run from the mongo shell)

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

File import is done.

If you ever want to clear the links between transcriptions you can clear the metadata.transcriptions field on the versions or artefacts for a given project (run from mongo shell):

    var version = db.versions.find({'metadata.project':'21'})
    version.forEach(function(v){
      db.versions.update({'_id':v._id},{$set:{'metadata.transcriptions':"","_revisions.0.transcriptions":""}});
    })