var net = require('net');
var util = require('util');
var debug = require('debug')('qufoxMonitor:TcpServer');
var events = require("events");

exports.TcpSocketServer = (function(){
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
		
		server.listen(port, function() {
			debug('Server bound');
		});

		function onData(data){
			var obj = null;
			try {
				obj = JSON.parse(data.toString());
				debug(util.inspect(obj, false, null, true));
				self.emit('data', obj);
			}
			catch (err) {
				debug('Data error - ' + err + ' : ' + data.toString());
			}
		}
	}

	util.inherits(TcpSocketServer, events.EventEmitter);

	return TcpSocketServer;
})();
