var express = require('express');
var req = require('request');
var cors = require('cors');
var DBOp = require("./dbop.js");
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('./public'));
app.use(bodyParser.json());

app.use(cors());

app.set('port', 8383);


// This gets all of the data; not a good idea to expose.
// app.get("/data",function(request, response) {
//     DBOp.fetchData(function(d){
//       response.end(JSON.stringify({"data" : d, "total" : d.length}));
//     });
// });

//rendering the home page
app.get("/events",function(request, response) {
    DBOp.fetchEvents(function(d){
      response.end(JSON.stringify(d));
    });
});


//rendering the home page
app.get("/events/:event",function(request, response) {
    DBOp.fetchEventData(request.params.event,function(d){
      response.end(JSON.stringify(d));
    });
});

//Starting the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
