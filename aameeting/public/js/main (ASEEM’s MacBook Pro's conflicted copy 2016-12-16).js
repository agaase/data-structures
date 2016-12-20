var AAMeetings = (function(){
    var map;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: {lat: 40.7836107, lng: -73.9334874}
      });

      
    }

    function fetchData(){
         $.ajax({
           method: "POST",
           data: JSON.stringify({
            "day" : new Date().getDay(),
            "hrs" : new Date().getHours() > 12 ? new Date().getHours() - 12 :  new Date().getHours(),
            "minutes" : new Date().getMinutes(),
            "a_p" : new Date().getHours() > 12 ? "pm" : "am"
           }),
           contentType: 'application/json',
           url: "/data",
         })
         .done(function(data) {
           data  =  JSON.parse(data);
           var html ="";
           $.each(data,function(i,loc){
              if(loc.meetings){
                var latLong=undefined;
                $.each(loc.meetings,function(i,meeting){
                  if(meeting.latLong && !latLong){
                    latLong = meeting.latLong;
                  }
                });
                html += "<div class='location'>";
                  $.each(loc.meetings,function(i,meeting){
                    if(latLong){
                      var marker = new google.maps.Marker({
                      map: map,
                      draggable: false,
                      animation: google.maps.Animation.DROP,
                      position: {lat: latLong.lat, lng: latLong.lng}
                    });
                    marker.addListener('click', function(){
                    });
                    html += "<div class='meeting'>";
                    html += "<div class='primary'>" + "<div class='name'>"+meeting.name+"</div>";
                    html += "<div class='time'>"+meeting.time.day+"-"+meeting.time.hrs+":"+meeting.time.minutes+"</div>";
                    html += "</div>";
                  }
                })
              }
           })
           $(".meetings").append(html)
         });
    }

    return {

      init : function(){
        initMap();
        fetchData();
      },

    }
})();

AAMeetings.init();


