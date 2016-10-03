var ch = require("cheerio");
var fs = require('fs');
var $ = ch.load("<body></body>");
var html_data = "";
var data;
var latency = [];

// Connection URL
var url = 'mongodb://127.0.0.1:27017/aa';

// Retrieve
var MongoClient = require('mongodb').MongoClient; // npm install mongodb

var dbc;

MongoClient.connect(url, function(err, db) {
    if (err) {return console.dir(err);}
    dbc = db;
    var collection = dbc.collection('meetings');
    getMeetings(collection,0);
});

var report = function(){
    var days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    $("body").css({
      "padding" : "30px 100px"
    })
    $("body").append("<div class='latency'></div>");
    for(var i=0;i<latency.length;i++){
      $("body .latency").append("<div class='value' style='height:"+latency[i]*2+"px;'>"+latency[i]+"</div>");
    }
    $("body .latency").css({
      "margin-bottom" : "35px"
    });
    $("body .latency .value").css({
      "margin-right":"2px",
      "width":"30px",
      "display" : "inline-block",
      "background-color" : "rgb(27, 146, 196)",
      "text-align" : "center",
      "vertical-align" : "bottom",
      "color" : "#FFFFFF",
      "font-size" : "75%",
      "font-family" : "sans-serif"
    });
    for(var i=0;i<data.length;i++){
     $("body").append("<div class='meeting'><div><b>" + data[i].name + ",&nbsp;" + days[data[i].time.day]+","+data[i].time.time + data[i].time.a_p+"</b>&nbsp;(" +  data[i].types + ")" + "</div><div>"+ data[i].location+","+data[i].address+"</div></div>");
    }
    $("body .meeting").css({
      "padding" : "10px 5px",
      "font-family" : "sans-serif"
    });
   fs.writeFileSync('dumps/report.html',$.html());
}


var getMeetings = function(collection,ct){
  if(ct==25){
    dbc.close();
    report();
    return;
  }
  var time = new Date().getTime();
  collection.aggregate( [{ $match : { 'time.day' :  1, 'time.time' : {$gt : 7}, 'time.a_p' : "pm" }}],
    function(err, results) {
      data = results;
      latency.push(new Date().getTime()-time);
      getMeetings(collection,++ct);
    }
  );
}
