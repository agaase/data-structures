var request = require('request');
var fs = require('fs');

    var body = fs.readFileSync('dumps/meetings.dump');
    var meetingsData = JSON.parse(body);
    console.log(meetingsData.length);
    
    // Connection URL
    var url = 'mongodb://127.0.0.1:27017/aa';

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; // npm install mongodb

    
    MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}

        var collection = db.collection('meetings');

        // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
        for (var i=0; i < meetingsData.length; i++) {
            collection.insert({"name" : meetingsData[i].name,"address" :meetingsData[i].detailed_address});
        }
        db.close();
    
    }); //MongoClient.connect

