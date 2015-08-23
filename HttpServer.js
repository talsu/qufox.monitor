var debug = require('debug')('qufoxMonitor:HttpServer');
var http = require('http');
var tools = require('./tools');

module.exports = (function(){
	function HttpServer (port, WebServer) {
		var self = this;
		self.port = port;
		self.WebServer = WebServer;

		WebServer.app.set('port', port);
		self.server = http.createServer(WebServer.app);
	}

	HttpServer.prototype.listen = function (callback) {
		var self = this;

		self.server.on('error', function (error) {
			debug(error);
			if (tools.isFunction(callback)) callback(error);
		});

		self.server.on('listening', function () {
			var addr = self.server.address();
			var bind = typeof addr === 'string'
				? 'pipe ' + addr
				: 'port ' + addr.port;
			debug('Listening on ' + bind);
			if (tools.isFunction(callback)) callback();
		});

		self.server.listen(self.port);

	};
	
	return HttpServer;
})();
