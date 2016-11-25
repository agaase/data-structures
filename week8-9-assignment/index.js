var express = require('express');
var req = require('request');
var cors = require('cors');
var DBOp = require("./dbop.js");

var app = express();
app.use(cors());

app.set('port', 8383);


//rendering the home page
app.get("/",function(request, response) {
    DBOp.fetchData(function(d){
      response.end(JSON.stringify(d));
    });
});
//Starting the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
