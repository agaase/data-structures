var SensorGPS = (function(){
    var map, dayss = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var selectedEvent, graphs;
   
    function fetchEvents(callback){
      $.ajax({
           method: "GET",
           data: null,
           contentType: 'application/json',
           url: "/events",
         })
         .done(function(data) {
           data  =  JSON.parse(data);
           $.each(data,function(i,event){
            if(!i){
              selectedEvent = event.event;
            }
            $(".events").append("<div class='event"+(i==0 ? " active" : "")+"'>"+event.event+"</div>");
           })
           callback();
         });
    }

    function renderGraph(graph,d,max,marginTop,hi,ww,eventName){
      var x = d3.scaleLinear()
              .domain([parseFloat(d[0].timestamp), parseFloat(d[d.length-1].timestamp)])
              .range([20, ww-20]);
      var y = d3.scaleLinear()
              .domain([0,max])
              .range([0,hi]);

      graph.append("text")
            .attr("x",20)
            .attr("y",marginTop-10)
            .style("font-weight","bold")
            .text(eventName+", maximum change: "+max);

      for(var i=1;i<d.length;i++){
        var diffh = y(d[i].diff);
        graph.append("line")
          .attr("x1",x(parseFloat(d[i].timestamp)))
          .attr("y1", marginTop + (hi/2) - (diffh/2)-1)
          .attr("x2",x(parseFloat(d[i].timestamp)))
          .attr("y2", marginTop + (hi/2) + (diffh/2)+1)
          .style("stroke","#575757")
          .style("stroke-width","1px")
      }
    }

    function renderGraphs(d){
      d = d.sort(function(a,b){
        return parseFloat(a.timestamp)-parseFloat(b.timestamp);
      })
      var minutes = parseInt((new Date(parseFloat(d[d.length-1].timestamp)) - new Date(parseFloat(d[0].timestamp)))/(1000*60));

      var eventName = d[0].event;
      var ww = $(".graph").width();
      var hh = $(".graph").height();
      var hi = window.innerHeight*.2;
      var margin = window.innerHeight*.1;
      var marginTop=margin;

      graphs.append("text")
            .attr("x",20)
            .attr("y",marginTop/2)
            .style("font-weight","bold")
            .style("text-decoration","underline")
            .style("font-size","125%")
            .text(minutes+" minutes");
      marginTop += margin/2;
      //Altitude
      var params = getParams(d,"altitude");
      renderGraph(graphs.append("g"),params[0],10,marginTop,hi,ww,"altitude");
      marginTop += margin+hi;
      //Geolocation, latitude
      var maxLat = 0,maxLong = 0, arrLat=[], arrLong=[];
      for(var i=1;i<d.length;i++){
        var geoloc1 = getLongLat(d[i].geo_location);
        var geoloc2 = getLongLat(d[i-1].geo_location);
        var diffLat = Math.abs(parseFloat(geoloc1[0])-parseFloat(geoloc2[0]));
        var diffLong = Math.abs(parseFloat(geoloc1[1])-parseFloat(geoloc2[1]));
        if(diffLat > 5 || diffLong > 5){
          continue;
        }
        if(diffLat > maxLat ){
          maxLat = diffLat;
        }
        if(diffLong > maxLong ){
          maxLong = diffLong;
        }
        arrLat.push({
          "timestamp" : d[i].timestamp,
          "diff"  : diffLat
        });
        arrLong.push({
          "timestamp" : d[i].timestamp,
          "diff"  : diffLong
        });
      }
      
      renderGraph(graphs.append("g"),arrLat,0.00039199999999794954/2,marginTop,hi,ww,"latitude");
      marginTop += margin+hi;

      renderGraph(graphs.append("g"),arrLong,0.0005979999999965457/2,marginTop,hi,ww,"longitude");
      marginTop += margin+hi;

      //Angle
      var params = getParams(d,"angle");
      renderGraph(graphs.append("g"),params[0],params[1],marginTop,hi,ww,"angle");
    }
    function getParams(d,parameter){
      var max=0, arr = [];
      for(var i=1;i<d.length;i++){
        var diff = Math.abs(parseFloat(d[i][parameter])-parseFloat(d[i-1][parameter]));
        if(diff > 5){
          continue;
        }
        if(diff > max ){
          max = diff;
        }
        arr.push({
          "timestamp" : d[i].timestamp,
          "diff"  : diff
        });
      }
      return [arr,max];
    }

    function getLongLat(geolocString){
      var geoloc = geolocString.split(",");
      geoloc[0] = parseFloat(geoloc[0]);
      geoloc[1] = parseFloat(geoloc[1]);
      return geoloc;
    }

    function fetchEventData(callback){
      $.ajax({
           method: "GET",
           data: null,
           contentType: 'application/json',
           url: "/events/"+selectedEvent,
         })
         .done(function(data) {
           data  =  JSON.parse(data);
           callback(data);
         });
    }

    function initEvents(){
      $(".events .event").on("click",function(){
          $(".events .event").removeClass("active");
          $(".graph svg").empty();
          $(this).addClass("active");
          selectedEvent = $(this).text();
          fetchEventData(function(d){
            renderGraphs(d);
          });
      });
    }

    /**
    * Adds the dropdown for different days as of now
    **/
    function initHTML(){
        graphs = d3.select(".graph")
                   .append("svg")
                   .attr("height",(window.innerHeight*.4)*3)
                   .attr("width",$(".graph").width())
    }

    return {

      init : function(){
        initHTML();
        fetchEvents(function(){
          initEvents();
          fetchEventData(function(d){
            renderGraphs(d);
          });
        });
      },



    }
})();

SensorGPS.init();


