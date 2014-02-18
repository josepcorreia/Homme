/*
 * Serve content over a socket
 */

 var mongoose = require('mongoose');
 //var Trash = mongoose.model( 'Trash' );

module.exports = function (socket) {
/*
	socket.on('message', function (data) {
		socket.emit('response', data);
		socket.broadcast.emit('response', data);
	});

	socket.on('change:color', function (data) {
		socket.emit('change:color', data);
		socket.broadcast.emit('change:color', data);
	});

	socket.on('register:trash', function (trash) {
		Trash.create(trash, function (err, trash) {
  			if (err) console.error('trash duplicated');

  			socket.emit('register:trash', trash);
			socket.broadcast.emit('register:trash', trash);
  			// saved!
		});
	});

	socket.on('update:trash', function (data) {
		Trash.update({ name: data.name }, { $set: { level: data.level } }).exec();
		
		socket.emit('update:trash', data);
		socket.broadcast.emit('update:trash', data);
	})*/
};
