var pg = require('pg');
var fs = require('fs');


var DBOp = (function(){

    // connection string
    var un = process.env.PG_USERNAME; // aws db username
    var pw = process.env.PG_PASSWORD; // aws db password
    var db = 'postgres'; // aws db database name
    var ep = 'gps.ce0y2lzh69ye.us-west-2.rds.amazonaws.com:5432'; // aws db endpoint
    var conString = "postgres://" + un + ":" + pw + "@" + ep + "/" + db;

    var createTableQuery = "CREATE TABLE laptop_position (timestamp bigint, geo_location text, angle decimal, altitude decimal, event text);"
    var selectAllQuery = "SELECT * FROM laptop_position;"
    var complexQuery = "SELECT * FROM laptop_position ORDER BY timestamp asc;";
    var uniqueEvents = "SELECT DISTINCT event FROM laptop_position;";
    var eventData = "SELECT * FROM laptop_position WHERE event=";

    /**
    This is where modify the insert to insert all values
    */
    var modifyInsertQuery = function(data){
        var insertIntoQuery = "INSERT INTO laptop_position VALUES"
        for(var i=0;i<data.length;i++){
            insertIntoQuery += "("+data[i].date+",'"+data[i].geo_location+"',"+data[i].angle + "," + data[i].altitude+ ",'" + data[i].event + "'),";
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

    return {
        createTable : function(){
            runQ(dropTable,function(e,r){
                runQ(createTableQuery,function(e,r){
                    if (e) {
                        return console.error('error running query', e);
                    }else{
                        return console.log('table created');
                    }
                });
            });
        },
        insertIntoTable : function(data){
            var q = modifyInsertQuery(data);
            console.log("inserting - "+data.length);
            runQ(q,function(e,r){
                if(e){
                    console.error('error running query 1', e);    
                }else{
                    console.log('inserted');
                }
            });
        },

        fetchEvents : function(callback){
            runQ(uniqueEvents,function(e,r){
                if(e){
                    console.log(e);
                }
                callback(r.rows);
            })
        },

        fetchEventData : function(event,callback){
            runQ(eventData+"'"+event+"'",function(e,r){
                if(e){
                    console.log(e);
                }
                callback(r.rows);
            })
        },

        fetchData : function(callback){
            console.log("running query");
            runQ(complexQuery,function(e,r){
                    if(e){
                        console.log(e);
                    }
                    else if(callback){
                        callback(r.rows);
                    }
                });
        }

    }

})();

module.exports = DBOp;


