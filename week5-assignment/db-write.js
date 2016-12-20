var request = require('request');
var fs = require('fs');

    var body = fs.readFileSync('dumps/meetings.dump');
    var meetingsData = JSON.parse(body);

    var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

    var refinedData = [],adds={};

    var geoAddress = function(add,callback){
      request("https://maps.google.com/maps/api/geocode/json?address="+add+"&key=AIzaSyAzvGvPYLhlZL_gNSOtV_-0Y5Hjt2O1X8w", function (error, response, body) {
        var json = JSON.parse(body);
        var results = json.results;
        if(results.length){
          callback(results[0].geometry.location);
        }else{
          callback("");
        }
      });
    }

    var parseMeeting = function(ct){
      var meeting = meetingsData[ct];
      for(var k in meeting){
         if(typeof(meeting[k]) == "string"){
            meeting[k] = meeting[k].trim();
         }
         if(k == "time"){
          var time = meeting[k];
          for(var z=0;z<time.length;z++){
              if(parseInt(time.charAt(z))){
                var day = time.substring(0,z).toLowerCase();
                var time_n = time.substring(z,time.length);
                time_n = time_n.split(" ");
                var a_p = time_n[1].trim();
                time_n = time_n[0].trim();
                time_n = time_n.split(":");
                var hrs =  parseFloat(time_n[0]);
                hrs =  (a_p == "pm" && hrs != 12) ? hrs+12 : hrs;
                hrs = (a_p == "am" && hrs == 12) ? 0 : hrs;
                meeting[k] = {
                  "day" : days.indexOf(day),
                  "hrs" : hrs,
                  "minutes" : parseFloat(time_n[1])
                }
                break;
              }
          }
         }
      }
      if(!meeting["latLong"] && !adds[meeting["address"]]){
        console.log("no add - " + meeting["address"]);
        geoAddress(meeting["address"],function(ga){
             if(ga){
             	console.log("found address" + ga);
               meeting["latLong"] = ga;
               adds[meeting["address"]] = ga;
             }else{
              	adds[meeting["address"]] = {}
              	console.log("still didnt found address!");
             }
            refinedData.push(meeting);
            if((ct+1)<meetingsData.length){
              ct++;
              parseMeeting(ct);
            }else{
              storeMongo();
            }
        })
      }else{
      	if(!meeting["latLong"] && adds[meeting["address"]]){
      		meeting["latLong"] = adds[meeting["address"]];
      	}
        refinedData.push(meeting);
        if((ct+1)<meetingsData.length){
          ct++;
          parseMeeting(ct);
        }else{
          storeMongo();
        }
      }
    }
    parseMeeting(0);
    console.log(adds);

    var storeMongo = function(){
      // Connection URL
      var url = 'mongodb://127.0.0.1:27017/aa';

      // Retrieve
      var MongoClient = require('mongodb').MongoClient; // npm install mongodb


      MongoClient.connect(url, function(err, db) {
          if (err) {return console.dir(err);}

          var collection = db.collection('meetings');
          collection.insert(refinedData)
          db.close();

      }); 
    }

