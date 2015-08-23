var Sockets = require('socket.io');

module.exports = (function(){
	function WebSocketServer(httpServer) {
		var self = this;		
		self.io = Sockets(httpServer.app);
	}

	WebSocketServer.prototype.broadcast = function(type, obj) {
		var self = this;
		self.io.sockets.emit(type, obj);
	};

	return WebSocketServer;
})();