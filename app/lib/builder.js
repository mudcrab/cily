var db = require('../db.js');
var appRoot = require('app-root-path');
var helper = require('./helpers.js');
var Promise_ = require('bluebird');
var Moment = require('moment-timezone');
var Git = require('git-wrapper');
var exec = require('child_process').exec;

var Builder = function(id)
{
	this.id = id;
	this.available = true;

	console.log('builder #%d ready', id);
};

Builder.prototype.build = function(project, task, build)
{
	var self = this;

	return new Promise_(function(resolve) {
		db.models.Project.forge({
			id: project.get('id')
		})
		.fetch()
		.then(function(project) {
			var repoLocation = './builds/' + project.get('name') + '/' + build.get('build_nr');
			var git = new Git({
				'git-dir': repoLocation + '/.git'
			});

			git.exec('clone', [project.get('repo_address'), repoLocation], function(e, o) {
				if(e === null)
				{
					self.runCommands(repoLocation, task.get('cmd').split('\n'))
					.then(function() {
						git.exec('rev-parse --verify HEAD', function(gitHashErr, gitHash) {
							build
							.save({
								status: true,
								end_time: Moment.tz("Europe/Tallinn").format("YYYY-MM-DD HH:MM:ss"),
								commit: gitHash
							}, { method: 'update' });
							resolve(true);
						});
					});
				}
				else
					resolve(false);
			});
		});
	});
};

Builder.prototype.runCommands = function(path, commands)
{
	return new Promise_(function(resolve) {
		var done = commands.length - 1;
		commands.forEach(function(cmd, i) {
			exec(cmd, { cwd: path }, function(error, stdout, stderr) {
				if(i === done)
					resolve();
			});
		});
	});
};

module.exports = Builder;