var config = require('../config').logging.http_push;
var request = require('request');

module.exports = {
	log: function(data) {
		var jData = JSON.stringify(data);
		request.post({
			uri: config.url,
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': jData.length
			},
			body: jData
		}, function(err, res, body) {
		});
	}
};