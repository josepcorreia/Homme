/*
 * Serve JSON to our AngularJS client
 */

var mongoose = require('mongoose');
var Devices = mongoose.model( 'Device' );

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};

exports.devices = function (req, res) {
	Devices.find({ $query: {}, $orderby: { id : 1 } }, function (err, result) {
		if (!err) {
			res.json({
				devices: result
			});
		}
	});
};