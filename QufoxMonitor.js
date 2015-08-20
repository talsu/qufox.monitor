var format = require('util').format;    
var debug = require('debug')('qufoxMonitor');
var MongoClient = require('mongodb').MongoClient;
var TcpSocketServer = require('./TcpSocketServer').TcpSocketServer;


var mongodbUrl = 'mongodb://127.0.0.1:27017/qufoxMonitor';
var tcpServerPort = 3200;

debug('Try Mongodb connect ... (' + mongodbUrl + ')');
MongoClient.connect(mongodbUrl, function(err, db) {
	if(err) {
		debug('Mongodb connection Error - ' + err);
		process.exit(1);
	}

	debug('Mongodb connected.');

	var tcpServer = new TcpSocketServer(tcpServerPort);

	tcpServer.on('data', function (data){		
		if (!data || !data.header || !data.payload) {
			debug('Bad data format.');
		}
		else
		{
			db.collection(data.header).insert(data.payload, function (err, docs){
				if (err) {
					debug('collection['+data.header+'] insert Error - ' + err);
				}
			});
		}
	});
});
