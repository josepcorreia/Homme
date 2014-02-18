/*
 * Serve JSON to our AngularJS client
 */

var mongoose = require('mongoose');
var Device = mongoose.model( 'Device' );

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};

exports.devices = function (req, res) {
//nao está a funcionar
	Device.find({}, function (err, result) {
		if (!err) {
			res.json({
				devices: result
			});
		}
	});
};