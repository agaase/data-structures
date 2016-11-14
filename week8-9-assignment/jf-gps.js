var five = require("johnny-five");
var board = new five.Board();
var DBWriter = require("./dbwriter.js");

DBWriter.createTable();

board.on("ready", function() {
  console.log("7----------");
  /*
   * This is the simplest initialization
   * We assume SW_SERIAL0 for the port
   */
  var gps = new five.GPS({
    pins: {
      rx: 8,
      tx: 7
    }
  });

  var data = [];
  // If latitude, longitude, course or speed change log it
  gps.on("change", function() {
    var obj = {
      "geo_location" : parseFloat(this.latitude)+","+parseFloat(this.longitude),
      "altitude" : parseFloat(this.altitude),
      "angle" : parseFloat(this.course),
      "date" : new Date().getTime()
    };
    if(data.length >=4){
      console.log("calling insert");
      DBWriter.insertIntoTable(data);
      data = [];
      DBWriter.fetchData();
    }
    data.push(obj);
  });
  
});
