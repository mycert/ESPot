module.exports = function(req, res) {
	res.send("No handler found for url [" + req.originalUrl + "] and method [" + req.method + "]");
};