var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
homeDir += '/.cily';
var fs = require('fs');
var path = require('path');
var config = getConfig();
var bcrypt = require('bcryptjs');
var db = require('../db');
var Promise_ = require('bluebird');

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

exports.createUser = function(email, password)
{
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt);

	db.models.User.forge({
		email: email,
		pw: hash
	})
	.save();
};

exports.authUser = function(email, password, cb)
{
	return new Promise_(function(resolve) {
		db.models.User.forge({
			email: email
		})
		.fetch()
		.then(function(user) {
			if(user)
			{
				var status = bcrypt.compareSync(password, user.get('pw'));

				resolve(status);
				if(typeof cb !== 'undefined') cb(status);
			}
			else
			{
				resolve(false);
				if(typeof cb !== 'undefined') cb(false);
			}
		});
	});
};

exports.checkUserToken = function(token)
{
	// 
};

exports.addUserProject = function(uid, pid)
{
	// 
};

exports.getConfig = getConfig;
exports.config = config;
exports.appDir = homeDir;