var cily = require('./app/lib/helpers');
var config = cily.config;

var express = require('express');
var app = express();
var WebSocketServer = require('ws').Server;
var Events = require('minivents');
var Builder = require('./app/lib/builderclient');

config.events = new Events();
config.builderServer = new WebSocketServer({ port: 1337 });

config.logs = config.logs || cily.appDir + '/logs/';
config.builds = config.builds || cily.appDir + '/builds/';

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

require('./app/routes')(app);

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
			try
			{
				if(config.token === msg.data.token)
					config.builders.push(new Builder(builder));
				else
					console.log('Wrong access token');
			}
			catch(e) {}
		}
	});

	builder.on('close', function() {
		cily.removeBuilder(builder);
	});
});