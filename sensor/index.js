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


//rendering the home page
app.get("/data",function(request, response) {
    DBOp.fetchData(function(d){
      response.end(JSON.stringify({"data" : d, "total" : d.length}));
    });
});

//rendering the home page
app.post("/events",function(request, response) {
    DBOp.fetchEvents(function(d){
      response.end(JSON.stringify(d));
    });
});


//rendering the home page
app.post("/eventdata",function(request, response) {
    DBOp.fetchEventData(request.body.event,function(d){
      response.end(JSON.stringify(d));
    });
});

//Starting the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
