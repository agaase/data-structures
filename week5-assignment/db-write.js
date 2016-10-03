var request = require('request');
var fs = require('fs');

    var body = fs.readFileSync('dumps/meetings.dump');
    var meetingsData = JSON.parse(body);
    console.log(meetingsData.length);

    var days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

    var refinedData = [];
    for(var i=0;i<meetingsData.length;i++){
      var meeting = meetingsData[i];
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
                time_n = parseFloat(time_n[0]) + (parseFloat(time_n[1]) ? parseInt(time_n[1])/60 : 0);

                meeting[k] = {
                  "day" : days.indexOf(day),
                  "time" : time_n,
                  "a_p" : a_p
                }
                break;
              }
          }
         }
      }
      refinedData.push(meeting);
    }


    // Connection URL
    var url = 'mongodb://127.0.0.1:27017/aa';

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; // npm install mongodb


    MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}

        var collection = db.collection('meetings');
        collection.insert(refinedData)
        db.close();

    }); //MongoClient.connect
