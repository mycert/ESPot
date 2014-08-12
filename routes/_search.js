var Loggger = require(__dirname + '/../logger');

module.exports = function(req, res) {
	if(req.query.source) {
		var payload = {};
		try {
			payload = JSON.parse(req.query.source);
		} catch(e) {}

		if( payload.script_fields ) {
			var key = Object.keys(payload.script_fields)[0];
			var val = payload.script_fields[key].script;
			Loggger.log({
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
			ret.hits.hits[0].fields[key] = ["fake data"];
			if( req.query.callback ) {
				res.jsonp(ret);
			} else {
				res.send(ret);
			}
		} else {
			res.send("No handler found for url [" + req.originalUrl + "] and method [" + req.method + "]");
		}
	} else {
		res.send("No handler found for url [" + req.originalUrl + "] and method [" + req.method + "]");
	}
};