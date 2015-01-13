var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var cily = require('./lib/helpers');

var Build = require('./controllers/build');
var Project = require('./controllers/project');
var Users = require('./controllers/users');

module.exports = function(app)
{
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use(function(req, res, next) {
		var noAuth = {
			'/users/auth': true,
		};

		if(noAuth[req.path] || req.method === 'OPTIONS')
		{
			next();
		}
		else
		{
			cily.checkUserToken(req.headers['x-cily-uid'], req.headers['x-cily-token'])
			.then(function(data) {
				if(data)
					next();
				else
					res.status(401).end();
			});
		}
	});

	/*
		Controllers.Users
	*/

	app.post('/users/auth', Users.auth);
	app.get('/users/projects', Users.projects);
	app.get('/users/:id', Users.view);
	app.post('/users/:id/save', Users.save);
	app.put('/users/:id/save', Users.save);
	app.delete('/users/:id/remove', Users.remove);

	/*
		Controllers.Projects
	*/

	app.post('/projects', Project.save);
	app.get('/projects/:id', Project.view);
	app.put('/projects/:id', Project.save);
	app.get('/project/:id/settings', Project.getSettings);
	app.put('/project/:id/settings', Project.saveSettings);
	app.post('/project/:id/maketoken', Project.generateToken);
	app.get('/projects/:id/builds', Project.builds);
	app.get('/projects/:id/last', Project.lastBuild);
	app.delete('/projects/:id/remove', Project.remove);
	app.get('/projects/:id/:token/build', Project.build);

	/*
		Controllers.Build
	*/

	app.get('/build/:id/:project', Build.getBuild);
};