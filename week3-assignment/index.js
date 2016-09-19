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
    meetingsAdd.push(meetings[i].address+","+meetings[i].region);
  }
  getMapLocation(meetingsAdd,0);
}

var getMapLocation = function(addresses,ct){
    if(ct >= addresses.length){
      fs.writeFileSync('/Users/aseemaggarwal/magichappens/newschool/courses/data-structures/datastructures/week3-assignment/dumps/geoLoc.dump',JSON.stringify(meetingsLoc));
      return;
    }
    var add = addresses[ct];
    add = add.replace(/\s+/g, '+').toLowerCase();
    console.log((ct+1)+" of " + addresses.length + "done" );
    var key = process.env.MAPS_KEY;
    request("https://maps.google.com/maps/api/geocode/json?address="+add+"&key="+MAPS_KEY, function (error, response, body) {
      var json = JSON.parse(body);
      var results = json.results;
      if(results.length){
        meetingsLoc.push({
            "address" : results[0].formatted_address,
            "latLong" : results[0].geometry.location
        });
      }
      ct++;
      getMapLocation(addresses,ct);
    });
}

var file = "aa.dump";
try{
    var body = fs.readFileSync('/Users/aseemaggarwal/magichappens/newschool/courses/data-structures/datastructures/week3-assignment/dumps/'+file);
}
catch(err){
}
if(body){
  parseBody(body);
}else{
  scraper.scrapeUrl("http://meetings.nyintergroup.org/?d=any&v=list",file,function(body){
      parseBody(body);
  });
}
