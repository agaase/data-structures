var DataCleaner = (function(){
  return {
    cleanName : function(name){
        return name.replace(/\s\((.)+\)/g,"").replace(/[\\;,-]/g,"").trim();
    },
    cleanAddress : function(address){
      //The address from the new NY meeting group is pretty clean.
      //So iam just going to replace space with + for geocode input and add NY state whereever it is absent
      var address = address.trim().replace(/\s/g,"+");
      if(address.toLowerCase().indexOf("ny")==-1 && address.toLowerCase().indexOf("new york") ==-1){
        address += ",New+York";
      }
      return address;
    }
  }
})();

module.exports = DataCleaner;
