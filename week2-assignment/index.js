var fs = require('fs');
var cheerio = require('cheerio');
var content = fs.readFileSync('/Users/aseemaggarwal/magichappens/newschool/courses/data-structures/datastructures/week2-assignment/dumps/1.html');

var $ = cheerio.load(content);
//Our table resides next to the form element
$("tbody tr",$("form").next()).each(function(i,trel){
  //The first td element is what interests us
  var tdel = $("td",trel).eq(0);
  //We dont need this information, so removing it
  $(".detailsBox,span",tdel).remove();
  //Lot of white spaces with each line. Only way is to split and then trim each
  var addressArray = tdel.text().trim().split("\n");
  var address = "";
  $(addressArray).each(function(i,part){
      address += part.trim() + " ";
    if(i==0){
      //Lets just add a comma after the title
      address += "; ";
    }
  });
  fs.appendFileSync('/Users/aseemaggarwal/magichappens/newschool/courses/data-structures/datastructures/week2-assignment/dumps/address-1.txt',address+"\n");
});
