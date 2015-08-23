var net = require('net');
var util = require('util');
var debug = require('debug')('qufoxMonitor:TcpServer');
var events = require("events");
var tools = require('./tools');

module.exports = (function(){
	function TcpSocketServer(port) {
		var self = this;
		var server = net.createServer(function(socket){
			debug('Client connected');

			var receiveBuffer = new Buffer(0);

			function readBuffer() {
				var payloadLength = receiveBuffer.readUIntBE(0, 8);
				if (payloadLength <= 0) {
					throw ('Bad payload length : ' + payloadLength);						
				}

				var packetLength = 8 + payloadLength;
				if (receiveBuffer.length >= packetLength){
					var payloadString = receiveBuffer.toString('utf8', 8, packetLength);
					receiveBuffer = receiveBuffer.slice(packetLength);					
					onData(payloadString);

					if (receiveBuffer.length > 0) {
						debug('remain ' + receiveBuffer.length + ' - read again.');
						readBuffer();
					}
				}
			}

			socket.on('data', function (data){
				try {
					receiveBuffer = Buffer.concat([receiveBuffer, data]);
					debug('Receive ' + data.length + 'bytes / buffer size ' + receiveBuffer.length);
					readBuffer();					
				}
				catch (err) {
					debug(err);
					receiveBuffer = new Buffer(0);
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

		self.server = server;
		self.port = port;
		

		function onData(data){
			var obj = null;
			try {
				obj = JSON.parse(data.toString());
				debug(util.inspect(obj, false, null, true));				
			}
			catch (err) {
				debug('Data error - ' + err + ' : ' + data.toString());
			}

			self.emit('data', obj);
		}
	}

	util.inherits(TcpSocketServer, events.EventEmitter);

	TcpSocketServer.prototype.listen = function (callback) {
		var self = this;
		self.server.listen(self.port, function (err) {
			if (err) {
				debug(err);
			}
			else {
				debug('Server bound on port ' + self.port);	
			}
			
			if (tools.isFunction(callback)) callback(err);
		});
	};


	return TcpSocketServer;
})();
