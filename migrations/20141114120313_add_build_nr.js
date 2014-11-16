'use strict';

exports.up = function(knex, Promise) {
	Promise.all([
		knex.schema.table('builds', function(table) {
			table.integer('build_nr');
		})
	]);
};

exports.down = function(knex, Promise) {
  
};
