var DBOp = require("./dbop.js");

DBOp.fetchEventData("12_12_2016_2155_at_home_watching",function(items){
	console.log(items.length);
})


