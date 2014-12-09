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
		console.log(req.method, req.originalUrl);
		next();
	});

	/*
		Controllers.Users
	*/

	app.post('/users/auth', Users.auth);
	app.get('/users/:id', Users.view);
	app.post('/users/:id/save', Users.save);
	app.put('/users/:id/save', Users.save);
	app.delete('/users/:id/remove', Users.remove);
	app.get('/users/:id/projects', Users.projects);

	/*
		Controllers.Projects
	*/

	app.get('/projects/:id', Project.view);
	app.get('/projects/:id/builds', Project.builds);
	app.get('/projects/:id/last', Project.lastBuild);
	app.post('/projects/:id/save', Project.save);
	app.put('/projects/:id/save', Project.save);
	app.delete('/projects/:id/remove', Project.remove);
	app.get('/projects/:id/:token/build', Project.build);

	/*
		Controllers.Build
	*/

	app.get('/build/:id/:project', Build.getBuild);
};