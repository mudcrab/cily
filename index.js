var express = require('express');
var app = express();
var config = require('./config');

// TODO move this somewhere better
var Builder = require('./app/lib/builder');

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

for(var i = 0; i < 5; i++)
	config.builders.push(new Builder(i));