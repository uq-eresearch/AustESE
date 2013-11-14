
// run from shell
var artefacts = db.artefacts.find({'metadata.project':'21', 'metadata.artefacts.0': {$exists: true}})
artefacts.forEach(function(a){
  var parts = a.metadata.artefacts;
  var newParts = [];
  parts.forEach(function(p){
    var part = db.artefacts.findOne({"_id": new ObjectId(p)});
    newParts.push(part);
  });
  newParts.sort(function(a,b){
    return parseInt(a.metadata.pageNumbers) - parseInt(b.metadata.pageNumbers);
  });
  var newPartIds = [];
  newParts.forEach(function(np){
    newPartIds.push(np["_id"].str)
  })
  db.artefacts.update({"_id":a["_id"]},{$set:{'metadata.artefacts':newPartIds, '_revisions.0.artefacts':newPartIds}});
});
