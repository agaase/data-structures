var request = require('request');
var fs = require('fs');

/**
@function
This is a utility function to parse the web.
Right now it only downloads the website pages for a specific alcohol meeting group
**/
var WebParser = (function(){

  /**
    @function
    Generic function to read urls recursively. As of now it assumes that
    the number is going to be padded with 0.
  **/
  var readUrlRecursively = function(websiteBaseUrl,suffix,count){
      var new_count = ++count;
      if(count<10){
        new_count = "0"+count;
      }
      console.log("Requesting -- " + websiteBaseUrl + new_count + suffix);
      request(websiteBaseUrl + new_count + suffix, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          fs.writeFileSync('/Users/aseemaggarwal/magichappens/newschool/courses/datastructures/dumps/'+count+".html", body);
            readUrlRecursively(websiteBaseUrl,suffix,count);
        }
        else {
          console.error('request failed; exiting')
        }
      });
  };
  return {
    /**
      This is where the meeting group parameters are added
    **/
    downloadMeetingLists : function(websiteBaseUrl){
      var prefix = "m";
      var suffix = ".html"
      readUrlRecursively(websiteBaseUrl+prefix,suffix,0);
    }
  }
})();

WebParser.downloadMeetingLists("http://visualizedata.github.io/datastructures/data/");
