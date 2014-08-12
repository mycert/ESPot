var config = require('../config').logging.sqlite;
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(config.dbpath);

module.exports = {
	log: function(data) {
		db.serialize(function() {
			db.run("CREATE TABLE IF NOT EXISTS attack ( id INTEGER PRIMARY KEY AUTOINCREMENT, ip TEXT, payload TEXT, payload_key TEXT, raw_request TEXT, timestamp INTEGER );");
			var stmt = db.prepare("INSERT INTO attack (ip, payload, payload_key, raw_request, timestamp) VALUES (?, ?, ?, ?, ?)");
			stmt.run(data.ip);
			stmt.run(data.payload);
			stmt.run(data.payload_key);
			stmt.run(data.raw_request);
			stmt.run(data.timestamp);
			stmt.finalize();
			db.close();
		});
	}
};