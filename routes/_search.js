var fs = require('fs');
var request = require('request');
var Logger = require(__dirname + '/../logger');
var crypto = require('crypto');

var downloader = function(url) {
	var temp_path = '/tmp/espot-' + crypto.randomBytes(4).readUInt32LE(0) + '.tmp';
	var req = request({
		url: url,
		headers: {
			'User-Agent': 'Wget/1.5.3'
		}
	}).pipe(fs.createWriteStream(temp_path));

	req.on('finish', function() {
		var hashfile = crypto.createHash('md5');
		var fread = fs.ReadStream(temp_path);
		fread.on('data', function(d) {
			hashfile.update(d);
		});
		fread.on('end', function() {
			var hash = hashfile.digest('hex');
			Logger.logdl({
				url: url,
				hash: hash
			});
			fs.exists( __dirname + '/../downloads/' + hash, function(exists) {
				if( !exists ) {
					var _src = fs.createReadStream(temp_path);
					var _dst = fs.createWriteStream( __dirname + '/../downloads/' + hash );
					_src.pipe(_dst, { end: false });
					_src.on('end', function() {
						fs.unlinkSync(temp_path);
					});
				} else {
					fs.unlinkSync(temp_path);
				}
			});
		});
	});
};

var handlePayload = function(payload) {
	var pattern = /getRuntime\(\)\.exec\((.+?)\)/ig;
	var matched = pattern.exec(payload);

	if(matched && matched[1]) {
		if( payload.indexOf("whoami") > -1 ) {
			return ["root"];
		}
		if( payload.indexOf("uname") > -1 ) {
			return ["Linux ubuntu 3.13.0-24-generic #47-Ubuntu SMP Fri May 2 23:30:00 UTC 2014 x86_64 x86_64 x86_64 GNU/Linux"];
		}
		if( payload.indexOf("id") > -1 ) {
			return ["uid=0(root) gid=0(root) groups=0(root)"];
		}
		if( payload.indexOf("wget") > -1 ) {
			var url_pattern = /((?:f|ht)tps?:\/\/(?:.+?))\s/;
			var url = url_pattern.exec(payload)[1];
			console.log(url);
			if( url ) {
				console.log(url);
				downloader(url);
			}
			return [""];
		}
	} else {
		return [""];
	}
};

module.exports = function(req, res) {
	if(req.query.source) {
		var payload = {};
		try {
			payload = JSON.parse(req.query.source);
		} catch(e) {}

		if( payload.script_fields ) {
			var key = Object.keys(payload.script_fields)[0];
			var val = payload.script_fields[key].script;
			Logger.log({
				payload: val,
				payload_key: key,
				ip: req.ip,
				timestamp: new Date().getTime(),
				raw_request: req.originalUrl
			});
			var ret = {
				took: 10,
				timed_out: false,
				_shards: {
					total: 5,
					successful: 5,
					failed: 0
				},
				hits: {
					total: 10,
					max_score: 1.0,
					hits: [{
						_index: "tmb",
						_type: "post",
						_id: "9",
						_score: 1.0,
						fields: {
						}
					}]
				}
			};
			ret.hits.hits[0].fields[key] = handlePayload(val);
			if( req.query.callback ) {
				res.jsonp(ret);
			} else {
				res.send(ret);
			}
		} else {
			res.send("No handler found for url [" + req.originalUrl + "] and method [" + req.method + "]");
		}
	} else {
		res.send({
			"took" : 0,
			"timed_out" : false,
			"_shards" : {
				"total" : 0,
				"successful" : 0,
				"failed" : 0
			},
			"hits" : {
				"total" : 0,
				"max_score" : 0.0,
				"hits" : [ ]
			}
		});
	}
};