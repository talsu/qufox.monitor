var net = require('net');
var util = require('util');
var debug = require('debug')('qufoxMonitor:TcpServer');
var events = require("events");

exports.TcpSocketServer = (function(){
	function TcpSocketServer(port) {
		var self = this;
		var server = net.createServer(function(socket){
			debug('Client connected');

			socket.on('data', function (data){		
				var obj = null;
				try {
					obj = JSON.parse(data.toString());
					debug(util.inspect(obj, false, null, true));
					self.emit('data', obj);
				}
				catch (err) {
					debug('Data error - ' + err);
				}				
			});

			socket.on('error', function (err) {
				debug(err);
			});

			socket.on('timeout', function() {
				debug('Socket Timed Out');
			});
			socket.on('close', function() {
				debug('Socket Closed');		
			});			
			socket.on('end', function() {
				debug('Socket End');
			});
		});

		
		server.listen(port, function() {
			debug('Server bound');
		});
	}

	util.inherits(TcpSocketServer, events.EventEmitter);

	return TcpSocketServer;
})();
