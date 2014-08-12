/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var fs = require('fs');
var access_logfile = fs.createWriteStream('./logs/access.log', {flags: 'a'});
var app = express();

// all environments
app.set('port', 9200);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('Content-Type', 'application/json');
app.set('Access-Control-Allow-Origin', '*');
app.set('tz', config.tz);
app.use(express.logger({ stream: access_logfile }));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.disable('etag');

var esResponse = function(req, res) {
	var x = {
		_index: "",
		_type: "",
		_id: "",
		_version: 1,
		created: true
	};
	var path = req.params[0].split('/');

	if( !path[3] ) {
		app.set('Content-Type', 'text/plain');
		res.send("No handler found for url [" + req.originalUrl + "] and method [PUT]");
	} else {
		x._index = path[1];
		x._type = path[2];
		x._id = path[3];
		res.send(x);
	}
};
app.post('/test', function(req, res) {
	res.send('a');
	console.log(req.body);
});
app.get('/', require('./routes/index'));
app.all('/_search', require('./routes/_search'));

app.put('*', esResponse);
app.post('*', esResponse);

app.all('*', require('./routes/404'));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
