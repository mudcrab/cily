var db = require('../db.js');
var _ = require('lodash');
var Build = require('../lib/build.js');
var fs = require('fs');

exports.getBuild = {
	
	path: '/build/:id/:project',
	method: 'get',

	handler: function(req, res)
	{
		var retData = {
			status: false
		};

		db.models.Build.forge({
			id: req.params.id,
			project_id: req.params.project
		})
		.fetch()
		.then(function(build) {
			if(build)
			{
				db.models.Project.forge({ id: req.params.project }).fetch()
				.then(function(project) {
					fs.readFile('./logs/' + project.get('name') + '/' + build.get('build_nr') + '.log', {
						encoding: 'utf8'
					}, function(err, file) {

						if(!err)
						{
							retData = {
								status: true,
								build: build.toJSON(),
								log: file
							};
						}

						res.json(retData);
					});
				});
			}
			else
			{
				res.json(retData);
			}
		});
	}
};