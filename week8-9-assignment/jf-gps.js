var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  console.log("-----------");
  /*
   * This is the simplest initialization
   * We assume SW_SERIAL0 for the port
   */
  var gps = new five.GPS({
    pins: {
      rx: 8,
      tx: 7
    },
    baud : 57600
  });

  // If latitude, longitude, course or speed change log it
  gps.on("change", function() {
    console.log("position");
    console.log("  latitude   : ", this.latitude);
    console.log("  longitude  : ", this.longitude);
    console.log("--------------------------------------");
  });
});
