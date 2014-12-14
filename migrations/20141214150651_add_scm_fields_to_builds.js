'use strict';

exports.up = function(knex, Promise) {
	Promise.all([
		knex.schema.table('builds', function(table) {
			table.renameColumn('commit', 'hash');
			table.text('msg');
			table.string('author', 255);
			table.string('committer', 255);
		})
	]);
};

exports.down = function(knex, Promise) {

};
