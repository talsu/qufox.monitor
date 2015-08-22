var format = require('util').format;    
var debug = require('debug')('qufoxMonitor:Database');
var MongoClient = require('mongodb').MongoClient;
var tools = require('./tools');

module.exports = (function() {
	function Database(mongodbUrl) {
		var self = this;
		self.mongodbUrl = mongodbUrl;
	}

	Database.prototype.connect = function (callback) {
		var self = this;

		debug('Try Mongodb connect ... (' + self.mongodbUrl + ')');

		MongoClient.connect(self.mongodbUrl, function (err, db){
			if (!err) {
				self.db = db;
				debug('Mongodb connected.');
			}
			else {
				debug('Mongodb connection Error - ' + err);
			}

			if (tools.isFunction(callback)) callback(err, db);
		});
	};

	Database.prototype.AddTelegram = function (telegram, callback) {
		var self = this;
		if (!telegram || !telegram.type || !telegram.data) {
			debug('Bad telegram format.');
		}
		else
		{
			var type = telegram.type;
			delete telegram.type;
			self.db.collection(type).insert(telegram, function (err, docs){
				if (err) {
					debug('collection['+type+'] insert Error - ' + err);
				}

				if (tools.isFunction(callback)) callback(err, docs);
			});
		}
	};

	return Database;
})();


// var mongodbUrl = 'mongodb://127.0.0.1:27017/qufoxMonitor';
// var tcpServerPort = 3200;


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
