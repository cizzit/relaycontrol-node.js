var sio = require('socket.io')
 , http = require('http')
 , index = require('fs').readFileSync(__dirname + '/index.html')
 , request = require('request')
 , spawn = require('child_process').spawn
 , sys = require('sys')
 , exec = require('child_process').exec;

var app = http.createServer(function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(index);
})
 , io = sio.listen(app, {
'log level': 2
});

app.listen(8000);

/*
* Create call to mosquitto_sub cli client
* to subscribe on topic "test"
*/
mosq = spawn('mosquitto_sub',['-h','127.0.0.1','-t','WebControl']);

function puts(error, stdout, stderr) { sys.puts(stdout) }

mosq.stdout.on('data', function (data) {
        io.sockets.emit('statusUpdate', data);
        var time = exec('date', puts);
        console.log(time+' Status received: '+data);
});

mosq.stderr.on('data', function (data) {
        var time = exec('date', puts);
        console.log(time+' error: ' + data);
});

io.sockets.on('connection', function (socket) {
        socket.on('message', function(data) {
                if(data=='status') {
                        var time = exec('date', puts);
                        console.log(time+' Message received! Doing status check');
                        mosqstatus = spawn('mosquitto_pub',['-h','127.0.0.1','-t','RelayControl','-m','999']);
                        mosqstatus.stderr.on('data', function(data) {
                                var time = exec('date', puts);
                                console.log(time+' '+data);
                        });
                } else { // data contains 1-16, 0 or 998, pass these
                        var time = exec('date', puts);
                        console.log(time+' Control message received, publishing ...');
                        mosqsend = spawn('mosquitto_pub',['-h','127.0.0.1','-t','RelayControl','-m',data]);
                        mosqsend.stderr.on('data', function(data) {
                                var time = exec('date', puts);
                                console.log(time+' '+data);
                        });
                }
        });
        socket.on('disconnect', function() {
                var time = exec('date', puts);
                console.log(time+' Disconnected');
        });
});
