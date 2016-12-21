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
  var readUrl = function(url,file,callback){
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fs.writeFileSync('dumps/'+file, body);
            callback(body);
        }
        else {
          console.error('request failed; exiting');
          callback(null);
        }
      });
  };
  return {
    scrapeUrl : readUrl
  }
})();

// create a model using the name of the DynamoDB table and a schema
module.exports = WebParser;
