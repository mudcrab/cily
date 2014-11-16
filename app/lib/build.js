var db = require('../db.js');
var appRoot = require('app-root-path');
var helper = require('./helpers.js');
var Promise_ = require('bluebird');
var Moment = require('moment-timezone');

var Build = function(project) {
	var self = this;
	this.id = 0;
	this.task_id = null;

	this.project = project;
	this.task = null;
	this.build = null;
	this.project_id = project.get('id');

	return new Promise_(function(resolve) {
		db.models.Task.forge({
			project_id: self.project_id,
			active: true
		})
		.fetch()
		.then(function(task) {
			if(task)
			{
				self.task_id = task.get('id');
				self.task = task;

				db.models.Build.forge({
					task_id: task.get('id'),
					project_id: 1
				})
				.query(function(qb) {
					qb.orderBy('build_nr', 'DESC')
					.limit(1);
				})
				.fetch()
				.then(function(build) {
					if(build)
						self.id = parseInt(build.get('build_nr')) + 1;
					resolve(self);
				});
			}
			else
				resolve(null);
		});
	});
};

Build.prototype.start = function()
{
	var self = this;

	return new Promise_(function(resolve) {
		db.models.Build.forge({
			task_id: self.task_id,
			project_id: self.project_id,
			build_nr: self.id,
			start_time: Moment.tz("Europe/Tallinn").format("YYYY-MM-DD HH:MM:ss")
		})
		.save()
		.then(function(build) {
			var builder = helper.getBuilder();
			builder.build(self.project, self.task, build)
			.then(function(status) {
				resolve(status);
			});
		});
	});
	/*db.models.Build.forge({
		task_id: 1,
		project_id: 1
	})
	.query(function())*/

	/*db.models.Build.buildNr(1, 1)
	.then(function(build) {
		// console.log(build)
	})*/
	/*
		0. create project dir in /builds/
		1. get the prj (clone, fetch?)
		2. cd to prj
		3. run cmd
	*/
	/*helper.mkdirpSync('./builds/1');
	db.models.Task.forge({ project_id: this.id })
		.fetchAll()
		.then(function(data) {

		});*/
};

Build.prototype.fetchRepo = function()
{
	//
};

Build.prototype.cloneRepo = function()
{
	//
};

module.exports = Build;