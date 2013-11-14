//var transcriptions = db.fs.files.find({'metadata.mvdpath': {'$exists':true}})
var allT = db.fs.files.aggregate({$match:{'metadata.mvdpath':{$exists:true}}},{$group:{_id:"$metadata.mvdpath",resources:{$push:"$_resourceid"}}})

allT.result.forEach(function(t){
	
	var mvdmeta = {
		project: '21',
		name: "Harpur/" + t._id.replace(/%/g,""),
		resources: t.resources,
		generated: true
	}
	printjson(mvdmeta)
	db.mvds.insert({
		'metadata': mvdmeta,
		'_revisions':[mvdmeta]
	})
})