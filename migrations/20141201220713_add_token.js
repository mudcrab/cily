'use strict';

exports.up = function(knex, Promise) {
	Promise.all([
		knex.schema.table('projects', function(table) {
			table.string('token', 255);
		})
	]);
};

exports.down = function(knex, Promise) {
  
};
