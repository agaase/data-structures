var AAData = (function(){

  //This is where my mongo db resides
  var url = 'mongodb://127.0.0.1:27017/aa';
  var MongoClient = require('mongodb').MongoClient;

  var cleanName = function(name){
    return name.replace(/\s\((.)+\)/g,"").replace(/[\\;,-]/g,"").trim();
  };

  var geoAddress = function(address){
    //The address from the new NY meeting group is pretty clean.
    //So iam just going to replace space with + for geocode input and add NY state whereever it is absent
    var address = address.trim().replace(/\s/g,"+");
    if(address.toLowerCase().indexOf("ny")==-1 && address.toLowerCase().indexOf("new york") ==-1){
      address += ",New+York";
    }
    return address;
  }

  /**
   * Returns the absolute time in minutes for the week
   * For e.g if its Tuesday morning 6 am, it is then 24*1 + 6*60 minutes.
   **/
   var absWeekTime = function(d,mt){
     return (Math.abs(d-mt.day)*24*60+mt.hrs*60+mt.minutes);
   }

  return {

    fetchDayMeetings : function(callback,day,hrs,minutes){
      MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}
        console.log(hrs);
          var q = { 
            $or : [ 
              {"time.day" : day,"time.hrs" : { $gte : 12+hrs}, "time.minutes" : { $gte : minutes}},
              {"time.day" : ((day+1) > 6 ? 0 : (day+1)),"time.hrs" : { $lt : 4} } 
            ]
          };
          // var cursor = db.collection('meetings').find(q).sort({ "time.hrs" : 1, "time.minutes": 1 });
          var coll = db.collection('meetings');
          coll.aggregate([
              {$match: q}
            , {$group : { _id : "$address", meetings: { $push: "$$ROOT" } } }
          ]).toArray(function(err, docs) {
            db.close();
            docs = docs.sort(function(a,b){
              return absWeekTime(day,a.meetings[0].time) - absWeekTime(day,b.meetings[0].time);
             });
            callback(docs);
          });
      });
    },
    
    fetchData : function(callback){
      MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}
        var cursor = db.collection('meetings').find();
        var data = [];
        cursor.each(function(err, doc) {
            if (doc != null) {
               var name = cleanName(doc.name);
               var geo_address = geoAddress(doc.address);
               data.push({
                "name" : name,
                "address" : doc.address,
                "geoAddress" : geo_address,
            		"time" : doc.time,
            		"latLong" : doc.latLong,
            		"types" : doc.types
               });
            } else {
               db.close();
               callback(data);
            }
         });
        
      });
    }
  }
})();

module.exports = AAData;
