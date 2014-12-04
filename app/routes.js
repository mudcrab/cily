var express = require('express');
var fs = require('fs');
var cily = require('./lib/helpers');

var authorize = function(req, res, next)
{
	var path = req.originalUrl.substring(1).split('/');

	try
	{
		var route = require(__dirname + '/controllers/' + path[0])[path[path.length - 1]];

		if(typeof route.auth !== 'undefined' && !route.auth)
		{
			console.log('noauth')
			next();
		}
	}
	catch(e)
	{

	}

	var headerToken = req.get('X-Cily-Token') || null;
	cily.checkUserToken(1, 'asdf1234', res)
	.then(function(user) {
		if(!user) throw new Error();
		return user;
	})
	.then(function(user) {
		next();
	})
	.catch(function(e) {
		return res.json(retData);
	});
};

module.exports = function(parent, options)
{
	parent.use(authorize);
	fs.readdirSync(__dirname + '/controllers').forEach(function(name) {
		var ctrl = require(__dirname + '/controllers/' + name);
		name = ctrl.name || name;
		var prefix = ctrl.prefix || '';
		var app = express();
		var handler;
		var method;
		var path;

		for(var fn in ctrl)
		{
			if(ctrl.hasOwnProperty(fn))
			{
				path = prefix + ctrl[fn].path;
				handler = ctrl[fn].handler;
				method = ctrl[fn].method;

				if(method.indexOf('|') >= 0)
				{
					method.split('|').forEach(setRoute);
				}
				else
					app[method](path, handler);
			}
		}

		function setRoute(_method)
		{
			app[_method](path, handler);
		}

		parent.use(app);
	});
};