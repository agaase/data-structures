var request = require('request');
var fs = require('fs');

    var body = fs.readFileSync('dumps/meetings.dump');
    var meetingsData = JSON.parse(body);
    console.log(meetingsData.length);

    var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];



    var refinedData = [],adds=[];

    var parseMeeting = function(){

    },

    for(var i=0;i<meetingsData.length;i++){
      var meeting = meetingsData[i];
      for(var k in meeting){
        if(!meeting["latLong"]){
          if(adds.indexOf(meeting["address"])==-1){
            adds.push(meeting["address"]);    
          }
        }
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
      refinedData.push(meeting);
    }
    console.log(adds);


    // Connection URL
    var url = 'mongodb://127.0.0.1:27017/aa';

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; // npm install mongodb


    // MongoClient.connect(url, function(err, db) {
    //     if (err) {return console.dir(err);}

    //     var collection = db.collection('meetings');
    //     collection.insert(refinedData)
    //     db.close();

    // }); 
