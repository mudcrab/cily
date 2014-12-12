var db = require('../db.js');
var _ = require('lodash');
var cily = require('../lib/helpers');

exports.auth = function(req, res)
{
	var retData = {
		status: false
	};

	var data = req.body || { user: null, pw: null };

	if(data.user && data.pw)
	{
		cily.authUser(data.user, data.pw)
		.then(function(data) {
			retData = data;
			return res.json(retData);
		})
		.catch(function(e) {
			console.log(e);
		});
	}

	// return res.json(retData)
};

exports.view = function(req, res)
{
	var retData = {
		status: false
	};

	var headerToken = req.get('X-Cily-Token') || null;

	
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
	
};

exports.save = function(req, res)
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
};

exports.remove = function(req, res)
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
};

exports.projects = function(req, res)
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
				db.collections.Projects.forge()
				.query(function(qb) {
					qb.where('id', '=', project.get('project_id'));
				})
				.fetch()
				.then(function(data) {
					if(data)
					{
						retData = {
							status: true,
							data: data.toJSON()
						};
					}
					return res.json(retData);
				});

			});
		}
	});
};