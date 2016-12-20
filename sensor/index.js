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
app.get("/sessions",function(request, response) {
    DBOp.fetchSessions(function(d){
      response.end(JSON.stringify(d));
    });
});


//rendering the home page
app.get("/sessions/:session",function(request, response) {
    DBOp.fetchSessionData(request.params.session,function(d){
      response.end(JSON.stringify(d));
    });
});

//Starting the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
