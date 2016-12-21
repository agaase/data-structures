var AAMeetings = (function(){
    var map, days = ["","Tomorrow"], dayss = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], markers = [], currentTime, selectedDay;
    
    /**
    * Returns the absolute time in minutes for the week
    * For e.g if its Tuesday morning 6 am, it is then 24*1 + 6*60 minutes.
    **/
    var absWeekTime = function(mt){
      return (Math.abs(selectedDay-mt.day)*24*60+mt.hrs*60+mt.minutes);
    }

    /** Initialises the map. As of now it point to the whole ny state.
    * 
    **/
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: {lat: 40.7405971, lng: -73.8917814}
      });
    }
    /**
    * This changes the marker to a different color and also highlights
    * the exact location.
    */
    function toggleMarker(loc,pos){
      if(!loc){
        loc = $(".location[data-pos='"+pos+"'");
      }
      $(".location").removeClass("active");
      loc.addClass("active");
      if(pos){
        $.each(markers,function(i,marker){
          markers[i].setIcon("");
        });  
        $(".meetings").scrollTop(loc[0].offsetTop-200);
        markers[pos].setIcon("images/mapactive.png");
      }
    }

    /**
    * Fetches the data.
    */
    function fetchData(day,hrs,minutes){
        selectedDay = day;
         $.ajax({
           method: "POST",
           data: JSON.stringify({
            "day" : day,
            "hrs" : hrs,
            "minutes" : minutes
           }),
           contentType: 'application/json',
           url: "/meetings",
         })
         .done(function(data) {
           data  =  JSON.parse(data);
           //Trying to sort everything by time of the day although its a grouping.
           //Will just sort it in order of the first meeting in the group.
           // data = data.sort(function(a,b){
           //  return absWeekTime(a.meetings[0].time) - absWeekTime(b.meetings[0].time);
           // });
           var html ="";
           $.each(data,function(i,loc){
              if(loc.meetings){
                  var latLong=undefined, name;
                  $.each(loc.meetings,function(i,meeting){
                    if(meeting.latLong && meeting.latLong.lat && !latLong){
                      latLong = meeting.latLong;
                    }
                  });
                  if(latLong){
                      html += "<div data-pos='"+markers.length+"' class='location marked'><span class='title'>"+loc._id+"</span>";
                      var marker = new google.maps.Marker({
                      map: map,
                      draggable: false,
                      animation: google.maps.Animation.DROP,
                      pos: markers.length,
                      label : ""+loc.meetings.length,
                      position: {lat: latLong.lat, lng: latLong.lng}
                    });
                    marker.addListener('click', function(){
                      toggleMarker(undefined,parseInt(this.pos));
                    });
                    markers.push(marker);
                  }else{
                    html += "<div class='location'><span class='title'>"+loc._id+"*</span>";
                  }
                  $.each(loc.meetings,function(ii,meeting){
                    html += "<div class='meeting'>";
                    html += "<div class='primary'>" + "<div class='name'>"+meeting.name+",</div>";
                    var mins = (meeting.time.minutes ? ":"+meeting.time.minutes : "");
                    html += "<div class='time'>"+(Math.abs(day - meeting.time.day) > 0 ? dayss[meeting.time.day]+"," : "")+(meeting.time.hrs >= 12 ? (meeting.time.hrs == 12 ? "12" : meeting.time.hrs-12) + mins+"pm" :  meeting.time.hrs +mins+ "am"  )+"</div>";
                    html += "</div>";
                    html += "<div class='secondary'>" + "<div class='address'>*"+meeting.types+"</div></div>";
                    html += "</div>";
                  });
                  html += "</div>";
              }
           })
           $(".meetings").append(html);
           $(".location").on("click",function(){
              debugger;
              toggleMarker($(this),parseInt($(this).data("pos")));
           });
         });
    }
    /**
    * Adds the dropdown for different days as of now
    **/
    function initHTML(){
      var d= currentTime.getDay();
      $(".dd ul").append("<li data-day='"+d+"'>Today</li>");
      d = (d+1) > 6 ? 0 : (d+1);
      $(".dd ul").append("<li data-day='"+d+"'>Tomorrow</li>");

      for(var i=0;i<5;i++){
        d = (d+1) > 6 ? 0 : (d+1);
        $(".dd ul").append("<li data-day='"+d+"'>"+dayss[d]+"</li>");
      }
      $(".dd ul li").on("click",function(){
        $(".dd .selected").text($(this).text());
        $.each(markers,function(i,marker){
          marker.setMap(null);
        });
        $(".meetings").html("");
        var day = parseInt($(this).attr("data-day"));
        //If it is current then give current hr and minutes, else the zeroth time mins and hours
        fetchData(day,day==currentTime.getDay() ? currentTime.getHours() : 0, day==currentTime.getDay() ? currentTime.getMinutes() : 0 );  
      })
    }

    return {
      init : function(){
        //Making sure I have NYC time and date
        //Subtracting current time offest and then adding NY time zone offset
        currentTime = new Date();
        currentTime = new Date(currentTime.getTimezoneOffset()*60*1000+currentTime.getTime() - 300*60*1000);
        initMap();
        initHTML();
        fetchData(currentTime.getDay(),currentTime.getHours(),currentTime.getMinutes());
      }
    }
})();

AAMeetings.init();


