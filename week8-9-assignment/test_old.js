var pg = require('pg');
var fs = require('fs');


var DBWriter = (function(){

    // connection string
    var un = process.env.PG_USERNAME; // aws db username
    var pw = process.env.PG_PASSWORD; // aws db password
    var db = 'postgres'; // aws db database name
    var ep = 'bestgpsproject.c55t6l9g9dv3.us-west-2.rds.amazonaws.com'; // aws db endpoint
    var conString = "postgres://" + un + ":" + pw + "@" + ep + "/" + db;

    var dropTable = "DROP TABLE IF EXISTS laptop_position;"
    var createTableQuery = "CREATE TABLE laptop_position (timestamp bigint, geo_location text, angle decimal, altitude decimal);"
    var selectAllQuery = "SELECT * FROM laptop_position;"
    var complexQuery = "SELECT * FROM laptop_position ORDER BY timestamp asc"

    /**
    Get all the values from the sample output file
    */
    var getValues = function(){
        var output = fs.readFileSync('test.output').toString();
        var lines = output.split("\n");
        var data = [];
        for(var i=0;i<lines.length;i++){
            if(lines[i].toLowerCase().indexOf("time:")>-1){
                var obj = {};
                while(true){
                    var toStore = false;
                    var time;
                    var line = lines[i];
                    var info = line.split(": ");
                    var key = info[0].toLowerCase();
                    var value = info[1].toLowerCase().trim();
                    if(key.indexOf("time")>-1){
                        //Calculating the actual time in milliseconds
                        time = value.split(".");
                        var ms = parseInt(time[1]);
                        time = time[0].split(":") ;
                        time = 1000*(parseInt(time[0])*60*60 + parseInt(time[1])*60 + parseInt(time[2])) + ms;
                    }else if(key.indexOf("date") > -1){
                        toStore = true;
                        //Calculating the actual timestamp by which entries are to be sorted
                        value = new Date(value).getTime() + time;
                    }else if(key.indexOf("google") > -1){
                        toStore = true;
                        key = "geo_location";
                    }else if(key.indexOf("speed") > -1){
                        toStore = true;
                        key = "speed";
                        value = parseFloat(value);
                    }
                    else if(key.indexOf("altitude") > -1){
                        toStore = true;
                        value = parseFloat(value);
                    }
                    else if(key.indexOf("angle") > -1){
                        toStore = true;
                        value = parseFloat(value);
                    }
                    if(toStore){
                        obj[key] = value;    
                    }
                    if(line.toLowerCase().indexOf("satellites:") > -1){
                        break;
                    }else{
                        i++;    
                    }
                }
                data.push(obj);
            }
        }
        return data;
    }

    /**
    This is where modify the insert to insert all values
    */
    var modifyInsertQuery = function(data){
        var insertIntoQuery = "INSERT INTO laptop_position VALUES"
        for(var i=0;i<data.length;i++){
            insertIntoQuery += "("+data[i].date+",'"+data[i].geo_location+"',"+data[i].speed+","+data[i].angle + "," + data[i].altitude + "),";
        }
        insertIntoQuery = insertIntoQuery.substring(0,insertIntoQuery.length-1) + ";";
        return insertIntoQuery;
    }

    /**
    This is where I run the query.
    */
    var runQ = function(q,c){
        pg.connect(conString, function(err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }

            client.query(q, function(err, result) {
                //call `done()` to release the client back to the pool
                done();
                c(err,result);
            });
        })
    }

    /** Chain of queries **/
    runQ(dropTable,function(e,r){
        runQ(createTableQuery,function(e,r){
            if (e) {
                return console.error('error running query 1', e);
            }else{
                var data = getValues();
                var q = modifyInsertQuery(data);
                console.log(q);
                runQ(q,function(e,r){
                    if (e) {
                        return console.error('error running query 2', e);
                    }else{
                        runQ(complexQuery,function(e,r){
                            var rows = r.rows;
                            for(var i=0;i<rows.length;i++){
                                console.log(rows[i]);
                            }
                        })    
                    }
                })
            }
        });
    });


})();



