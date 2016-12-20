var express = require('express');
var req = require('request');
var cors = require('cors');
var bodyParser = require('body-parser');

//This is one more file where all the code to fetch data is writtern. 
//Just makes it more clean.
var AAData = require('./aadata.js');

//Express makes it super easy to create a server and allow routing
var app = express();
app.use(bodyParser.json());

//The public directory where all the static resources are served from
app.use(express.static('./public'));

//Using cors to allow request from any URL
app.use(cors());

//Setting the port where the server will listen to
app.set('port', 8181);


//rendering the home page
app.get("/data",function(request, response) {
    AAData.fetchData(function(data){
    	//This is how we return back something to a request. 
    	//In this case Iam just returning the string representation of my json data.
        response.end(JSON.stringify(data));
    });
});



app.post("/data",function(request,response){
	AAData.fetchDayMeetings(function(data){
    	//This is how we return back something to a request. 
    	//In this case Iam just returning the string representation of my json data.
        response.end(JSON.stringify(data));
    },request.body.day,request.body.hrs,request.body.minutes);
});

//rendering the home page
app.get("/data/day",function(request, response) {
    AAData.fetchDayMeetings(function(data){
    	//This is how we return back something to a request. 
    	//In this case Iam just returning the string representation of my json data.
        response.end(JSON.stringify(data));
    });
});

//Starting the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
