var db = require('../db.js');
var _ = require('lodash');
var Build = require('../lib/build.js');

exports.view = {

	path: '/:id',
	method: 'get',

	handler: function(req, res)
	{
		var retData = {
			status: false
		};

		db.models.Project.forge({
			id: req.params.id
		})
			.fetch().then(function(data) {
				if(data) retData = {
					status: true,
					data: data.toJSON()
				};

				return res.json(retData);
			});
	}
};

exports.save = {

	path: '/:id/save',
	method: 'post|patch|get',

	handler: function(req, res)
	{
		var retData = {
			status: false
		};

		var modelData = _.merge(req.query, req.params);

		db.models.Project.forge(modelData)
			.save()
			.then(function(data) {
				if(data) retData = {
					status: true,
					data: data
				};

				return res.json(retData);
			});
	}
};

exports.remove = {

	path: '/:id/remove',
	method: 'delete|get',

	handler: function(req, res)
	{
		var retData = {
			status: false
		};

		db.models.Project.forge({ id: req.params.id })
			.fetch()
			.then(function(project) {
				if(project)
				{
					project.destroy();
					retData.status = true;
				}

				return res.json(retData);
			});
	}
};

exports.build = {

	path: '/:id/build',
	method: 'get',

	handler: function(req, res)
	{
		var retData = {
			status: false
		};

		db.models.Project.forge({
			id: req.params.id
		})
		.fetch().then(function(data) {
			new Build(data)
			.then(function(build) {
				if(build)
				{
					build.start()
					.then(function(status) {
						console.log(status)
						retData.status = status;
					});
				}
			});
		});

		return res.json(retData);
	}
};