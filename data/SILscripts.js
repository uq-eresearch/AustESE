// create artefact parts for SILTS image files
var silfiles = db.fs.files.find({'filename':/SILTS/, _deleted:{$exists:false}}).sort({'filename':1});
silfiles.forEach(function(f){
    var filename = f.filename;
    var fsplit = f.filename.split(".");
    var pages = fsplit[0].substring(5,fsplit[0].length) 
    if (pages.match("(RR)")){
    	pages = pages.substring(4,pages.length);
    } 
    print(pages)
    var artefactMetadata = {
    	source: 'SILTS ' + pages,
    	pageNumbers: pages,
    	project: '22',
    	facsimiles: [f["_resourceid"]],
    	generated: "SILimport"
    }
    db.artefacts.insert({"_revisions":[artefactMetadata], "metadata": artefactMetadata}) 
})

//db.fs.files.update({'_id':f["_id"]},{$set:{'filename': newFileName}});

// generate the list of imported artefacts and sort according to page number
var artefacts = db.artefacts.find({'metadata.generated':'SILimport'}).toArray();
artefacts.sort(function(a,b){
	var aNum = parseInt(a.metadata.pageNumbers);
	var bNum = parseInt(b.metadata.pageNumbers);
	return aNum - bNum;
})
var newArtefacts = []
artefacts.forEach(function(a){
	newArtefacts.push(a._id.str);
})


// find how many revisions for existing artefact
var theArtefact = db.artefacts.findOne({_id:ObjectId('501f5538df8edeca4d000004')});
theArtefact["_revisions"].length

db.artefacts.update({_id:ObjectId('501f5538df8edeca4d000004')},{$set:{'metadata.artefacts':newArtefacts, '_revisions.9.artefacts':newArtefacts}})


// find old resources without resourceids
var broken = db.fs.files.find({"_resourceid":{$exists:false}, _deleted:{$exists:false}})
broken.forEach(function(f) {
	print(f.filename)
})

