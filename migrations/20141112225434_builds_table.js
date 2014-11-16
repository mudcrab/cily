'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('tasks', function(table) {
            table.increments('id').primary().unsigned();
            table.integer('project_id').unsigned().index().references('id').inTable('projects');
            table.text('cmd');
        }),
        knex.schema.createTable('builds', function(table) {
            table.increments('id').primary().unsigned();
            table.integer('task_id').unsigned().index().references('id').inTable('tasks');
            table.boolean('status');
        })
    ]);
};

exports.down = function(knex, Promise) {
  
};
