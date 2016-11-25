var AAData = (function(){

  var url = 'mongodb://127.0.0.1:27017/aa';
  var MongoClient = require('mongodb').MongoClient; // npm install mongodb

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

  return {
    
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
                "geoAddress" : geo_address
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
