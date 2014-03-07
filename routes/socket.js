/*
 * Serve content over a socket
 */

 var mongoose = require('mongoose');
 var Device = mongoose.model( 'Device' );

module.exports = function (socket) {

	socket.on('message', function (data) {
		socket.emit('response', data);
		socket.broadcast.emit('response', data);
	});

	socket.on('update:name', function (data) {
    	Device.update({ id: data.id }, { $set: { name: data.name } }).exec();
    	//nao precisa de mandar para quem mandou
      //socket.emit('up:name', data);
		socket.broadcast.emit('up:name', data);
  	});
  	socket.on('update:analog', function (data) {
    	 Device.update({ id: data.id }, { $set: { analog: data.analog } }).exec();
    	 //socket.emit('up:analog', data);
		 socket.broadcast.emit('up:analog', data);
  	});
  	socket.on('update:digital', function (data) {
   		Device.update({ id: data.id }, { $set: { digital: data.digital } }).exec();
   		//socket.emit('up:digital', data);
		  socket.broadcast.emit('up:digital', data);
  	});
  	socket.on('update:room', function (data) {
    	Device.update({ id: data.id }, { $set: { room: data.room } }).exec();
    	//socket.emit('up:room', data);
		  socket.broadcast.emit('up:room', data);
  	});
};