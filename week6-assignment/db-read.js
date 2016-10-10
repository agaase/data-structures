var cleaner = require('./data-cleaner.js');
// Connection URL
var url = 'mongodb://127.0.0.1:27017/aa';
// Retrieve
var MongoClient = require('mongodb').MongoClient; // npm install mongodb

MongoClient.connect(url, function(err, db) {
    if (err) {return console.dir(err);}
    var cursor = db.collection('meetings').find();
    cursor.each(function(err, doc) {
        if (doc != null) {
           var cleanName = cleaner.cleanName(doc.name);
           var cleanAddress = cleaner.cleanAddress(doc.address);
           console.log(cleanName + "-- " + cleanAddress);
        } else {
           db.close();
        }
     });

});
