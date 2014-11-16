'use strict';

exports.seed = function(knex, Promise) {
  return knex.table('tasks').insert({
    project_id: 1,
    cmd: 'ls -l'
  })
};