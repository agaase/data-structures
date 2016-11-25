var fs = require('fs');
// var split = require('split');

var indexHtml = fs.readFileSync('./index.html');
var socketio = require('socket.io');
var app = require('http').createServer(handler);
var io = socketio.listen(app);

function handler (req, res) {
    res.writeHead(200, {'content-type': 'text/html'});
    res.write(indexHtml);
    res.end();
}

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    var addr = app.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
});

io.on('connection', function (socket) {
    var readableStream = fs.createReadStream('test.txt');
    var chunks = [];
    readableStream.on('data', function(chunk) {
        if(chunks.length>=100){
            socket.emit('pixel', chunks);
            //console.log(chunks[0].toString());
            chunks = [];
        }else{
            chunks.push(chunk);
        }

    }); //.pipe(split())
    
    readableStream.on('end', function() {
        socket.emit('done', 'done');
        socket.disconnect(); 
    });
});