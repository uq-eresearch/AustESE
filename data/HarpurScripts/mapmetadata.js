
var csv = require('csv');
var fs = require('fs');
var currWorkTitle, currWorkNumber;
var headers = ["dc_title","dc_contributor.author", "dc_date.issued", "dc_source", 
"dc_identifier","dc_identifier.other","dc_identifier.citation","dc_relation.ispartofseries",
"dc_relation.isversionof","dc_description","dc_type","dc_files"]

function paddy(n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
}

csv()
.from.stream(fs.createReadStream(__dirname+'/HarpurData.csv'), {columns: true})
.to.path(__dirname+'/A95export.csv', {columns: headers, header:true, lineBreaks: 'unix'})
.transform( function(row){
	var wTitle = row["Work title"];
	if (wTitle) {
		currWorkTitle = wTitle;
		currWorkNumber = row["Work no."]
	} else {
		wTitle = currWorkTitle;
		wNumber = currWorkNumber;
	}
	var vTitle = row["Title of version"];
	if (vTitle && vTitle.trim() == "-") {
		vTitle = "Untitled";
	} else if (vTitle && vTitle.trim() == "^") {
		vTitle = wTitle;
	}
	vTitle = replaceChars(vTitle);
	var tRow = {};
    console.log(row);
    var url = row.URL;
    var imageUrlList = [];
    var mssName = row.Source.trim();

    var toSplit = url.split(" TO ");
    if (url && toSplit.length > 1){
      // process to files
      var firstUrlLastSlash = toSplit[0].lastIndexOf("/");
      var firstNum = parseInt(toSplit[0].substring(firstUrlLastSlash + 1).split(".")[0],10);
      var lastNum = parseInt(toSplit[1].substring(toSplit[1].lastIndexOf("/") + 1).split(".")[0],10);
      var urlBase = toSplit[0].substring(0,firstUrlLastSlash + 1);
      var actualFileName = url.substring(url.lastIndexOf("/") + 1).trim();
      var urlSplit = url.split("/");
      var mssName = urlSplit[urlSplit.length - 2];
      var paddyAmount = 8;
      if (mssName == "C381" || mssName == "C377"){
        paddyAmount = 4;
      }
      for (var i = firstNum; i <= lastNum; i++){
            imageUrlList.push((urlBase + paddy(i, paddyAmount) + ".jpg").trim());
      }
    } else {
      imageUrlList.push(url);
    }
    
    var newList = "";
    imageUrlList.forEach(function(u){
    	newList += u + "; " ;
    });
    // get actual title i.e. - = Untitled, ^ = same as work title
    if (mssName == "A95") {
    	var description = "p. " + row["Page no."] + "; " + row.Lines + " lines; " + vTitle;
    	tRow["dc_title"] = wTitle;
    	tRow["dc_contributor.author"] = "Harpur, Charles";
    	tRow["dc_date.issued"] = row.Year;
    	tRow["dc_source"] = mssName;
    	tRow["dc_identifier"] = row["Version no."];
    	tRow["dc_identifier.other"] = row["MS"];
    	tRow["dc_identifier.citation"] = description;
    	tRow["dc_relation.ispartofseries"] = row["Series/ Sequence"];
    	tRow["dc_relation.isversionof"] = wNumber;
    	tRow["dc_description"]  = description;
    	tRow["dc_type"] = "image";
    	tRow["dc_files"] = newList;
    	return tRow;
	}
})

.on('end', function(count){
  console.log('Number of lines: '+count);
})
.on('error', function(error){
  console.log(error.message);
});

function replaceChars(str) {
	return str.replace(/Ñ/g,'&mdash;');
}
