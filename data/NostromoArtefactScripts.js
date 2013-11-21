// create artefact parts for Nostromo image files

// TS2
var silfiles = db.fs.files.find({'metadata.project':'24',filename:/TS2/, _deleted:{$exists:false}}).sort({'filename':1});
silfiles.forEach(function(f){
    var filename = f.filename;
    var fsplit = f.filename.split(".");
    var pages = fsplit[0].substring(4,fsplit[0].length) 
    print(pages)
    var artefactMetadata = {
    	source: 'TS2 ' + pages,
    	pageNumbers: pages,
    	project: '24',
    	facsimiles: [f["_resourceid"]],
    	generated: "Nimport"
    }
    db.artefacts.insert({"_revisions":[artefactMetadata], "metadata": artefactMetadata}) 
})

// TS1
var silfiles = db.fs.files.find({'metadata.project':'24',filename:/TS1\_A/, _deleted:{$exists:false}}).sort({'filename':1});
silfiles.forEach(function(f){
    var filename = f.filename;
    var fsplit = f.filename.split(".");
    var pages = fsplit[0].substring(4,fsplit[0].length) 
    print(pages)
    var artefactMetadata = {
        source: 'TS1 ' + pages,
        pageNumbers: pages,
        project: '24',
        facsimiles: [f["_resourceid"]],
        generated: "Nimport"
    }
    db.artefacts.insert({"_revisions":[artefactMetadata], "metadata": artefactMetadata}) 
})

// TS1a
var silfiles = db.fs.files.find({'metadata.project':'24',filename:/TS1\_[1-9]/, _deleted:{$exists:false}}).sort({'filename':1});
silfiles.forEach(function(f){
    var filename = f.filename;
    var fsplit = f.filename.split(".");
    var pages = fsplit[0].substring(4,fsplit[0].length) 
    print(pages)
    var artefactMetadata = {
        source: 'TS1a ' + pages,
        pageNumbers: pages,
        project: '24',
        facsimiles: [f["_resourceid"]],
        generated: "Nimport"
    }
    db.artefacts.insert({"_revisions":[artefactMetadata], "metadata": artefactMetadata}) 
})

//MSb
var silfiles = db.fs.files.find({'metadata.project':'24',filename:/^MSb/i, _deleted:{$exists:false}}).sort({'filename':1});
silfiles.forEach(function(f){
    var filename = f.filename;
    var fsplit = f.filename.split(".");
    var pages = fsplit[0].substring(3,fsplit[0].length) 
    print(pages)
    var artefactMetadata = {
        source: 'MSb ' + pages,
        pageNumbers: pages,
        project: '24',
        facsimiles: [f["_resourceid"]],
        generated: "Nimport"
    }
    db.artefacts.insert({"_revisions":[artefactMetadata], "metadata": artefactMetadata}) 
})
// MSa
var silfiles = db.fs.files.find({'metadata.project':'24',filename:/^MS[1-9]/i, _deleted:{$exists:false}, 'metadata.filetype':'image/jpg'}).sort({'filename':1});
silfiles.forEach(function(f){
    var filename = f.filename;
    var fsplit = f.filename.split(".");
    var pages = fsplit[0].substring(2,fsplit[0].length) 
    print(pages)
    var artefactMetadata = {
        source: 'MSa ' + pages,
        pageNumbers: pages,
        project: '24',
        facsimiles: [f["_resourceid"]],
        generated: "Nimport"
    }
    db.artefacts.insert({"_revisions":[artefactMetadata], "metadata": artefactMetadata}) 
})

// associate with TS2
var artefacts = db.artefacts.find({'metadata.generated':'Nimport', 'metadata.pageNumbers': {$exists:true}, 'metadata.source':/^TS2 [1-9]/}).toArray();
artefacts.sort(function(a,b){
    var aNum = parseInt(a.metadata.pageNumbers);
    var bNum = parseInt(b.metadata.pageNumbers);
    return aNum - bNum;
})
var newArtefacts = []
artefacts.forEach(function(a){
    newArtefacts.push(a._id.str);
})
// update typescript ts2
var theArtefact = db.artefacts.findOne({_id:ObjectId('528c18af1b26327b79000007')});
theArtefact["_revisions"].length
db.artefacts.update({_id:ObjectId('528c18af1b26327b79000007')},{$set:{'metadata.artefacts':newArtefacts, '_revisions.0.artefacts':newArtefacts}})

// associate with msa
var artefacts = db.artefacts.find({'metadata.generated':'Nimport', 'metadata.pageNumbers': {$exists:true}, 'metadata.source':/^MSa /}).toArray();
artefacts.sort(function(a,b){
    var aNum = parseInt(a.metadata.pageNumbers);
    var bNum = parseInt(b.metadata.pageNumbers);
    return aNum - bNum;
})
var newArtefacts = []
artefacts.forEach(function(a){
    newArtefacts.push(a._id.str);
})

var theArtefact = db.artefacts.findOne({_id:ObjectId('528c186c1b26326475000006')});
theArtefact["_revisions"].length
db.artefacts.update({_id:ObjectId('528c186c1b26326475000006')},{$set:{'metadata.artefacts':newArtefacts, '_revisions.1.artefacts':newArtefacts}})


// associate with msb
var artefacts = db.artefacts.find({'metadata.generated':'Nimport', 'metadata.pageNumbers': {$exists:true}, 'metadata.source':/^MSb /}).toArray();
artefacts.sort(function(a,b){
    var aNum = parseInt(a.metadata.pageNumbers);
    var bNum = parseInt(b.metadata.pageNumbers);
    return aNum - bNum;
})
var newArtefacts = []
artefacts.forEach(function(a){
    newArtefacts.push(a._id.str);
})
db.artefacts.update({_id:ObjectId('528c1a2d1b2632d66f000003')},{$set:{'metadata.artefacts':newArtefacts, '_revisions.0.artefacts':newArtefacts}})


// associate with ts1
var artefacts = db.artefacts.find({'metadata.generated':'Nimport', 'metadata.pageNumbers': {$exists:true}, 'metadata.source':/^TS1a /}).toArray();
artefacts.sort(function(a,b){
    var aNum = parseInt(a.metadata.pageNumbers);
    var bNum = parseInt(b.metadata.pageNumbers);
    return aNum - bNum;
})
var artefacts2 = db.artefacts.find({'metadata.generated':'Nimport', 'metadata.pageNumbers': {$exists:true}, 'metadata.source':/^TS1 /}).toArray();
artefacts2.sort(function(a,b){
    var aNum = parseInt(a.metadata.pageNumbers);
    var bNum = parseInt(b.metadata.pageNumbers);
    return aNum - bNum;
})
var newArtefacts = []
artefacts.forEach(function(a){
    newArtefacts.push(a._id.str);
})
artefacts2.forEach(function(a){
    newArtefacts.push(a._id.str);
})

db.artefacts.update({_id:ObjectId('528c189f1b26329374000007')},{$set:{'metadata.artefacts':newArtefacts, '_revisions.0.artefacts':newArtefacts}})


