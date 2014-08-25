var config = require('../config.js').logging;
var fs = require('fs');

var Log = {
	log: function(data) {
		fs.readdirSync(__dirname).forEach(function(file){
			if(file.substr(-3) == '.js' && file != 'index.js') {
				var logger_file = file.slice(0, -3);
				if((config[logger_file]) && config[logger_file].enable === true) {
					var logger = require(__dirname + '/' + logger_file);
					logger.log(data);
				}
			}
		});
	},
	logdl: function(data) {
		fs.readdirSync(__dirname).forEach(function(file){
			if(file.substr(-3) == '.js' && file != 'index.js') {
				var logger_file = file.slice(0, -3);
				if((config[logger_file]) && config[logger_file].enable === true) {
					var logger = require(__dirname + '/' + logger_file);
					logger.logdl(data);
				}
			}
		});
	}
};

module.exports = Log;