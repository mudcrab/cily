var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
homeDir += '/.cily';
var fs = require('fs');
var path = require('path');
var config = getConfig();

function getConfig()
{
	try
	{
		return require(homeDir + '/cily');
	}
	catch(e)
	{
		console.log('Config file at %s/cily.js not found, using the default.', homeDir);
		return require('./config');
	}
}

exports.mkdirpSync = function (dirpath) 
{
	var parts = dirpath.split(path.sep);

	for( var i = 1; i <= parts.length; i++ )
	{
		try
		{
			fs.mkdirSync( path.join.apply(null, parts.slice(0, i)) );
		}
		catch(e)
		{
			// 
		}
	}
};

exports.getBuilder = function()
{
	for(var i = 0; i < config.builders.length; i++)
	{
		if(config.builders[i].status === 'available')
			return config.builders[i];
	}
};

exports.removeBuilder = function(socket)
{
	for(var i = 0; i < config.builders.length; i++)
	{
		if(config.builders[i].socket == socket)
		{
			config.builders.splice(i, 1);
			break;
		}
	}
};

exports.socketData = function(type, data)
{
	return JSON.stringify({
		type: type,
		data: data || {}
	});
};

exports.getConfig = getConfig;
exports.config = config;
exports.appDir = homeDir;