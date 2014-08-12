
/*
 * GET home page.
 */
var fs = require('fs');
var config = require('../config');

module.exports = function(req, res) {
	var file = '../views/es-response/default.js';
	if(fs.existsSync('./views/es-response/' + config.default_response + '.js')) {
		file = '../views/es-response/' + config.default_response;
	}
	res.send(require(file));
};