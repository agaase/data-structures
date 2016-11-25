var express = require('express');
var req = require('request');
var cors = require('cors');
var AAData = require('./aadata.js');

var app = express();
app.use(cors());

app.set('port', 8181);


//rendering the home page
app.get("/",function(request, response) {
    AAData.fetchData(function(data){
        response.end(JSON.stringify(data));
    });
});
//Starting the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
