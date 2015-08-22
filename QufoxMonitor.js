var format = require('util').format;    
var debug = require('debug')('qufoxMonitor');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var TcpSocketServer = require('./TcpSocketServer');
var Database = require('./Database');


var mongodbUrl = 'mongodb://127.0.0.1:27017/qufoxMonitor';
var tcpServerPort = 3200;

var database = new Database(mongodbUrl);
var tcpServer = new TcpSocketServer(tcpServerPort);
async.waterfall([
		function (callback) { database.connect(callback); }, 
		function (callback) { tcpServer.listen(callback); }
	],
	function (err, result) {
		if (err) {
			debug(err);
		}
		else {
			tcpServer.on('data', database.AddTelegram);
		}
	});


// debug('Try Mongodb connect ... (' + mongodbUrl + ')');
// MongoClient.connect(mongodbUrl, function(err, db) {
// 	if(err) {
// 		debug('Mongodb connection Error - ' + err);
// 		process.exit(1);
// 	}

// 	debug('Mongodb connected.');

// 	var tcpServer = new TcpSocketServer(tcpServerPort);

// 	tcpServer.on('data', function (telegram){		
// 		if (!telegram || !telegram.type || !telegram.data) {
// 			debug('Bad telegram format.');
// 		}
// 		else
// 		{
// 			var type = telegram.type;
// 			delete telegram.type;
// 			db.collection(type).insert(telegram, function (err, docs){
// 				if (err) {
// 					debug('collection['+type+'] insert Error - ' + err);
// 				}
// 			});
// 		}
// 	});
// });
