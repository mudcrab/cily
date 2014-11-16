'use strict';

exports.up = function(knex, Promise) {
	Promise.all([
		knex.schema.table('tasks', function(table) {
			table.boolean('active');
		}),

		knex.schema.table('builds', function(table) {
			table.integer('project_id').unsigned().index().references('id').inTable('projects');
			table.string('commit', 255);
			table.dateTime('start_time');
			table.dateTime('end_time');
		})
	])
};

exports.down = function(knex, Promise) {

};
