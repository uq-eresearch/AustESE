var hmappings = require('./harpur_data_mappings.json');

for (var i = 0; i < hmappings.length; i++){
	var theUrl = hmappings[i].metadata.imageUrl;
	if (theUrl.match(";")) {
		var urls = theUrl.split(";");

		for (var j = 0; j < urls.length; j++){
				console.log(urls[j]);
		}
	    
	}


}