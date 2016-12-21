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

          //This is the aggregate query that returns all the records
          //First OR is whether current time is today and the hr clock is greater than current clock
          //Second OR is whether current time is today, the hr clock is equal to current clock and minutes clock is greater than current clock mins
          //Third OR is whether current time is tomorrow, the hr clock is less than 4
          var q = { 
            $or : [ 
              {"time.day" : day,"time.hrs" : { $gt : hrs}},
              {"time.day" : day,"time.hrs" : hrs, "time.minutes" : { $gte : minutes}},
              {"time.day" : ((day+1) > 6 ? 0 : (day+1)),"time.hrs" : { $lt : 4} } 
            ]
          };
          var coll = db.collection('meetings');
          coll.aggregate([
              {$match: q}
            , {$group : { _id : "$address", meetings: { $push: "$$ROOT" } } }
          ]).toArray(function(err, docs) {
            db.close();
            // console.log(day + "--" + hrs+":"+minutes+" ---"+docs.length);
            //Going to sort every location on basis of first meeting time.
            docs = docs.sort(function(a,b){
              return absWeekTime(day,a.meetings[0].time) - absWeekTime(day,b.meetings[0].time);
             });
            callback(docs);
          });
      });
    }
  }
})();

module.exports = AAData;
