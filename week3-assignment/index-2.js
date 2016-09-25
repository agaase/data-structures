var fs = require('fs');
var scraper = require('./scraper.js');
var cheerio = require('cheerio');
var request = require('request');
var MAPS_KEY = process.env.MAPS_KEY;


var meetingsLoc = [];
var parseBody = function(content){
  //console.log(content);
  var $ = cheerio.load(content);
  var meetings = [];
  //Our table resides next to the form element
  $("#meetings tbody tr").each(function(i,trel){
      var time = $(".time",trel).text();
      var name = $(".name",trel).text();
      var location = $(".location",trel).text();
      var address = $(".address",trel).text();
      var region = $(".region",trel).text();
      var types = $(".types",trel).text();
      meetings.push({
        "time" : time,
        "name" : name,
        "location" : location,
        "address" : address,
        "region" : region,
        "types" : types
      });
  });
  console.log(meetings.length);
  var meetingsAdd = [];
  for(var i=0;i<meetings.length;i++){
    meetings[i]["address"] = meetings[i].address+","+meetings[i].region;
  }
  getMapLocation(meetings,0);
}

var getMapLocation = function(meetings,ct){
    if(ct >= meetings.length){
      fs.writeFileSync('dumps/meetings.dump',JSON.stringify(meetings));
      //console.log(JSON.stringify(meetings));
      return;
    }
    var add = meetings[ct]["address"];
    add = add.replace(/\s+/g, '+').toLowerCase();

    var key = process.env.MAPS_KEY;
    request("https://maps.google.com/maps/api/geocode/json?address="+add+"&key="+MAPS_KEY, function (error, response, body) {
      var json = JSON.parse(body);
      var results = json.results;
      if(results.length){
        meetingsLoc.push({
            "address" : results[0].formatted_address,
            "latLong" : results[0].geometry.location
        });
        meetings[ct]["detailed_address"] = results[0].formatted_address;
        meetings[ct]["latLong"] = results[0].geometry.location;
      }
      console.log((ct+1)+" of " + meetings.length + "done" );
      ct++;
      getMapLocation(meetings,ct);
    });
}

var file = "aa.dump";
try{
    var body = fs.readFileSync('dumps/'+file);
}catch(err){

}
if(body){
  parseBody(body);
}else{
  scraper.scrapeUrl("http://meetings.nyintergroup.org/?d=any&v=list",file,function(body){
      parseBody(body);
  });
}
