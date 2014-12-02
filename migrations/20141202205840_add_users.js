'use strict';

exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('users', function(table) {
			table.increments('id').primary().unsigned();
			table.string('email', 255).unique();
			table.string('pw', 60);
			table.string('token', 60);
		}),

		knex.schema.createTable('user_projects', function(table) {
			table.increments('id').primary().unsigned();
			table.integer('user_id').unsigned().index().references('id').inTable('users');
			table.integer('project_id').unsigned().index().references('id').inTable('projects');
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('user_projects'),
		knex.schema.dropTable('users')
	]);
};
