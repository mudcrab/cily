var db = require('../db.js');
var _ = require('lodash');
var cily = require('../lib/helpers');

exports.view = {

	path: '/users/:id',
	method: 'get',

	handler: function(req, res)
	{
		var retData = {
			status: false
		};

		var headerToken = req.get('X-Cily-Token') || null;

		cily.checkUserToken(req.params.id, headerToken, res)
		.then(function(user) {
			if(!user) throw new Error();
			return user;
		})
		.then(function(user) {
			db.models.User.forge({
				id: req.params.id
			})
			.fetch({
				columns: [
					'id',
					'email',
					'token'
				]
			})
			.then(function(data) {
				if(data) retData = {
					status: true,
					data: data.toJSON()
				};
				return res.json(retData);
			});
		})
		.catch(function(e) {
			return res.json(retData);
		});
	}
};

exports.save = {

	path: '/users/:id/save',
	method: 'post|patch|get',

	handler: function(req, res)
	{
		var retData = {
			status: false
		};

		var modelData = _.merge(req.query, req.params);

		db.models.User.forge(modelData)
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

	path: '/users/:id/remove',
	method: 'delete|get',

	handler: function(req, res)
	{
		var retData = {
			status: false
		};

		db.models.User.forge({ id: req.params.id })
		.fetch()
		.then(function(user) {
			if(user)
			{
				user.destroy();
				retData.status = true;
			}

			return res.json(retData);
		});
	}
};

exports.getProjects = {
	
	path: '/users/:id/projects',
	method: 'get',

	handler: function(req, res)
	{
		var retData = {
			status: false
		};

		db.models.User.forge({ id: req.params.id })
		.fetch({
			columns: [
				'id',
				'email',
				'token'
			],
			withRelated: ['projects']
		})
		.then(function(user) {
			if(user)
			{
				var projects = [];

				user.related('projects').each(function(project) {
					projects.push({
						id: project.get('id'),
						pid: project.get('project_id')
					});
				});

				retData = {
					status: true,
					data: projects
				};
			}

			return res.json(retData);
		});
	}

};