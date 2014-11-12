var express = require('express');
var fs = require('fs');

module.exports = function(parent, options)
{
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