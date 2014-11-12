'use strict';

exports.seed = function(knex, Promise) {
  return knex.table('projects').insert({
    name: 'Test project',
    repo_address: 'git@github.com:mudcrab/redoit.git',
    repo_type: 'git',
    repo_branch: 'master'
  })
};