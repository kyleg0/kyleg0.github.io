var fs = require('fs');
var areas = ["Africa-Alliance", "Bangladesh", "Bolivia", "Central-America", "Ethiopia", "Ghana", "India", "Malawi", "Mexico", "Mozambique", "Myanmar", "Nepal", "Nigeria", "Pakistan", "Sierra-Leone", "United-States", "Zambia"];

areas.forEach(function(area){
	fs.writeFile(area + ".html", "<h1>" + area + "</h1>", function(err){
		if(err){
			console.log(err);
		}
		console.log("writing " + area + ".html");
	})
})