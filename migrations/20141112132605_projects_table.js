'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('projects', function(table) {
            table.increments('id').primary().unsigned();
            table.string('name', 255);
            table.string('repo_address', 255);
            table.enum('repo_type', [ 'git', 'svn', 'hg' ]);
            table.string('repo_branch', 255);
        })
    ]);
};

exports.down = function(knex, Promise) {

};
