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

io.configure('development', function(){
  io.set('transports', ['xhr-polling']);
});
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
io.sockets.on('connection', require('./routes/socket'));
var socketIO;
io.sockets.on('connection', function (socket) {
  socketIO=socket;
  socket.on('message', function (data) {
    console.log(data);
  });
  socket.on('update:name', function (data) {
    updateDevName(data);
  });
  socket.on('update:analog', function (data) {
    updateAnalog(data);
  });
  socket.on('update:digital', function (data) {
    updateDigitalType(data);
  });
  socket.on('update:room', function (data) {
    updateLocal(data);
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
var listsockets = [];

var TCPserver = net.createServer(function(sock) { //'connection' listener
  console.log('server connected');
  var deviceId;
  sock.on('data', function(data) {
    console.log('Recebido ' + data);
    
    var received = splitData(String(data));
    deviceId = parseInt(received.id);
    console.log(deviceId);
    if(received.mgs1=="in"){
      console.log(received.mgs1);
      listsockets[deviceId]=sock;
    } else{
      console.log(received.status);
      updateStatus(deviceId, received.status);

      console.log(received.digital);
      updateDigitalPort(deviceId, received.digital)

      /*io.sockets.on('connection', require('./routes/socket'));
        var socketIO;
        //io.sockets.on('connection', function (socket) {
          //socketIO=socket;
          //var status ={id:$scope.devID, status:received.mgs1};
          //socket.emit('update:status', status);
          console.log(received.mgs1);
          console.log(received.mgs3);
        //})*/
    }
  });
    
  io.sockets.on('connection', function (socket) {
    socketIO=socket;
    socket.on('send:status', function (data) {
      var id = parseInt(data.id);
      if(id==deviceId){
        listsockets[id].write(data.status);
        console.log(data.status + ' ->tcp');
      }
    });
    socket.on('update:digitalport', function (data) {
      var id = parseInt(data.id);
      if(id==deviceId){
        listsockets[id].write(data.digitalport);
        console.log(data.digitalport + ' ->tcp');
      }
    });
})

  sock.on('end', function() {
    console.log('server disconnected');
  });
});


TCPserver.listen(PORT, function() { //'listening' listener
  console.log('server bound');
});
//end tcp communication

 var mongoose = require('mongoose');
 var Device = mongoose.model( 'Device' );

 var updateDevName = function(dev){
    Device.update({ id: dev.id }, { $set: { name: dev.name } }).exec();
 }

var updateAnalog = function(dev){
    Device.update({ id: dev.id }, { $set: { analog: dev.analog } }).exec();
}

var updateDigitalType = function(dev){
    Device.update({ id: dev.id }, { $set: { digital: dev.digital } }).exec();
}

var updateLocal = function(dev){
    Device.update({ id: dev.id }, { $set: { room: dev.room } }).exec();
}

//split the receive data
var splitData  = function(data){
  var dataSplit = data.split('|');
   if(dataSplit[1]=='in'){
      var received = {id:dataSplit[0], mgs1:dataSplit[1]};
   }else{
    var received = {id:dataSplit[0], status:dataSplit[1],analogic:dataSplit[2],digital:dataSplit[3]};
   }  
  return received;
};

//update the devicce's status that octonoff sends
var updateStatus = function(devid, stat){
    Device.update({ id: devid }, { $set: { status: stat } }).exec();
    //send by socket io  
}

//update the devicce's digital port, that octonoff sends
var updateDigitalPort = function(devid, digitalport){
    Device.update({ id: devid }, { $set: { digitalport: digitalport } }).exec();
    //send by socket io 
}


/*
    socketIO.emit('update:trash', send); 
    socketIO.broadcast.emit('update:trash', send); 
Trash.update({ name: dataSplit[0] }, { $set: { level: dataSplit[1] } }).exec();
*/
