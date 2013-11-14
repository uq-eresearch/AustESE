// remove harpur files (only deletes metadata)
db.fs.files.remove({'project.metadata':'21'});

// remove orphaned file chunks
var cursor = db.fs.chunks.find({}, {"_id" : 1, "files_id" : 1});
while (cursor.hasNext()) {
  var chunk = cursor.next();
  if (db.fs.files.findOne({_id : chunk.files_id}) == null) {
    db.fs.chunks.remove({"_id": chunk._id})
  }
}