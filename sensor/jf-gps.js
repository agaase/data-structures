var five = require("johnny-five");
var board = new five.Board();
var DBOp = require("./dbop.js");

board.on("ready", function() {
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

  var data = [], ct=0;
  // If latitude, longitude, course or speed change log it
  gps.on("change", function() {
    var obj = {
      "geo_location" : parseFloat(this.latitude)+","+parseFloat(this.longitude),
      "altitude" : parseFloat(this.altitude),
      "angle" : parseFloat(this.course),
      "date" : new Date().getTime(),
      "event" : "12_19_2016_0922_at_home_studying_table"
    };
    // console.log(obj);
    if(data.length >1){
      console.log("calling insert: "+data.length+"records");
      DBOp.insertIntoTable(data);
      data = [];
      // DBOp.fetchData();
    }
    if(ct>5){
      data.push(obj);
      ct=0;  
    }
    ct++;
  });
  
});
