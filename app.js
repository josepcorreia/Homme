/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  db = require('./db'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//io.configure('development', function(){
  //io.set('transports', ['xhr-polling']);
//});
/**
 * Configuration
 */

// all environments
app.set('port', process.env.VCAP_APP_PORT || process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);
app.get('/api/devices', api.devices);
// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
//io.sockets.on('connection', require('./routes/socket'));
var socketIO;
io.sockets.on('connection', function (socket) {
  socketIO=socket;
  socket.on('message', function (data) {
    //console.log(data);
  });
})

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

/**
* TCP Sockets
*/
var net = require('net');
var PORT = 8888;
/*
var TCPserver = net.createServer(function(sock) { //'connection' listener
  console.log('server connected');

  sock.on('data', function(data) {
    //console.log('Recebido' + data);
      splitData(String(data));
  });
*/
/*  
  sock.on('end', function() {
    console.log('server disconnected');
  });
  //c.write('hello\r\n');
  //c.pipe(c);
});

TCPserver.listen(PORT, function() { //'listening' listener
  console.log('server bound');
});

 var mongoose = require('mongoose');
 //var Trash = mongoose.model( 'Trash' );

/*var send;
var splitData  = function(data){
  var dataSplit = data.split('|');
  send = {name:dataSplit[0], level:Number(dataSplit[1]) }
  console.log(send);
    socketIO.emit('update:trash', send); 
    socketIO.broadcast.emit('update:trash', send); 
Trash.update({ name: dataSplit[0] }, { $set: { level: dataSplit[1] } }).exec();
};
*/

