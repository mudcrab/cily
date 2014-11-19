var db = require('../db.js');
var appRoot = require('app-root-path');
var helper = require('./helpers.js');
var Promise_ = require('bluebird');
var Moment = require('moment-timezone');
var Git = require('git-wrapper');
var exec = require('child_process').exec;
var fs = require('fs');

var Builder = function(client)
{
	var self = this;
	this.socket = client;
	this.status = 'available';

	this.tempBuildData = {};

	this.socket.on('message', function(data) {
		var message = JSON.parse(data) || { type: 'none' };

		switch(message.type)
		{
			case 'status':
			
				this.status = message.data.status;

			break;

			case 'buildComplete':
				self.finishBuild(message.data);
			break;

			default:
			console.log('Unknown message type: %s', message.type);
		}
	});
};

Builder.prototype.getStatus = function()
{
	// 
};

Builder.prototype.sync = function()
{
	// 
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
			var data = {
				project: project.toJSON(),
				task: task.toJSON(),
				build: build.toJSON()
			};

			self.tempBuildData = data;

			self.socket.send(helper.socketData('build', data));
			resolve(true);
		});
	});
};

Builder.prototype.finishBuild = function(data)
{
	var self = this;

	db.models.Build.forge({ id: self.tempBuildData.build.id })
	.save(data, { method: 'update' });
};

module.exports = Builder;