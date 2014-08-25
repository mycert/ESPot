var config = require('../config').logging.sqlite;
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(config.dbpath);

module.exports = {
	log: function(data) {
		db.serialize(function() {
			db.run("CREATE TABLE IF NOT EXISTS attack ( id INTEGER PRIMARY KEY AUTOINCREMENT, ip TEXT, payload TEXT, payload_key TEXT, raw_request TEXT, timestamp INTEGER );");
			db.run("INSERT INTO attack (ip, payload, payload_key, raw_request, timestamp) VALUES (?, ?, ?, ?, ?);", data.ip, data.payload, data.payload_key, data.raw_request, data.timestamp);
		});
	},
	logdl: function(data) {
		db.serialize(function() {
			db.run("CREATE TABLE IF NOT EXISTS downloads ( id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, hash TEXT);");
			db.run("INSERT INTO downloads (url, hash) VALUES (?, ?);", data.url, data.hash);
		});
	}
};