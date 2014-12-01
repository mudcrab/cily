var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
homeDir += '/.cily';

var express = require('express');
var app = express();
try 
{
	var config = require(homeDir + '/cily');
}
catch(e)
{
	console.log('Config file at %s/cily.js not found, using the default.', homeDir);
	var config = require('./config');
}
var WebSocketServer = require('ws').Server;
var Events = require('minivents');
var helper = require('./app/lib/helpers');
var wsBuilder = require('cily-builder-node');

config.events = new Events();
config.builderServer = new WebSocketServer({ port: 1337 });

config.logs = config.logs || homeDir + '/logs/';
config.builds = config.builds || '/builds/';

// TODO move this somewhere better
var Builder = require('./app/lib/builderclient');

require('./app/routes')(app);

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var server = app.listen(config.base.port, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('http://%s:%s', host, port);
});

config.builderServer.on('connection', function(builder) {
	builder.on('message', function(json) {
		var msg = JSON.parse(json);

		if(msg.type == 'addBuilder')
		{
			// init builder
			config.builders.push(new Builder(builder));
		}
		else
		{
			// console.log(json)
		}
		// builder.removeAllListeners('message');
	});

	builder.on('close', function() {
		// 
	});
});

// var bldr = wsBuilder();

