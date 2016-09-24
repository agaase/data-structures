var request = require('request');
var fs = require('fs');

    var body = fs.readFileSync('dumps/geoLoc.dump');
    var meetingsData = JSON.parse(body);
    
    // Connection URL
    var url = 'mongodb://' + process.env.IP + ':27017/aa';

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; // npm install mongodb

    MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}

        var collection = db.collection('meetings');

        // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
        for (var i=0; i < meetingsData.length; i++) {
            collection.insert(meetingsData[i]);
        }
        db.close();

    }); //MongoClient.connect

