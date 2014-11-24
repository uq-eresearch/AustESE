// remove harpur transcription files

db.fs.files.remove({'metadata.project':'21', 'metadata.filetype':'text/xml'})

// remove orphaned file chunks
var cursor = db.fs.chunks.find({}, {"_id" : 1, "files_id" : 1});
while (cursor.hasNext()) {
  var chunk = cursor.next();
  if (db.fs.files.findOne({_id : chunk.files_id}) == null) {
    db.fs.chunks.remove({"_id": chunk._id})
  }
}