var db = require('../db.js');
var appRoot = require('app-root-path');
var helper = require('./helpers.js');
var Promise_ = require('bluebird');
var Moment = require('moment-timezone');
var Git = require('git-wrapper');
var exec = require('child_process').exec;
var fs = require('fs');

var Builder = function(id)
{
	this.id = id;
	this.available = true;
	this.projectName = '';
	this.buildNr = '';

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
			self.projectName = project.get('name');
			self.buildNr = build.get('build_nr');

			var repoLocation = './builds/' + project.get('name') + '/' + build.get('build_nr');
			var git = new Git({
				'git-dir': repoLocation + '/.git'
			});

			git.exec('clone', [project.get('repo_address'), repoLocation], function(e, o) {
				if(e === null)
				{
					self.runCommands(repoLocation, task.get('cmd').split('\n'))
					.then(function(buildStatus) {
						git.exec('rev-parse --verify HEAD', function(gitHashErr, gitHash) {
							build
							.save({
								status: buildStatus,
								end_time: Moment.tz("Europe/Tallinn").format("YYYY-MM-DD HH:MM:ss"),
								commit: gitHash
							}, { method: 'update' });
							resolve(buildStatus);
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
	var self = this;
	return new Promise_(function(resolve) {
		var done = commands.length - 1;
		commands.forEach(function(cmd, i) {
			exec(cmd, { cwd: path }, function(error, stdout, stderr) {
				self.saveLog(stdout);

				if(error)
				{
					resolve(false);
				}
				else
				{
					if(i === done)
						resolve(true);
				}
			});
		});
	});
};

Builder.prototype.saveLog = function(msg)
{
	var self = this;
	var logsLocation = './logs/' + this.projectName;
	helper.mkdirpSync(logsLocation);

	fs.appendFile(logsLocation + '/' + this.buildNr + '.log', msg, function (err) {
		// log error
	});
};

module.exports = Builder;