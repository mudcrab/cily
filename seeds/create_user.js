'use strict';

exports.seed = function(knex, Promise) {
  return knex.table('users').insert({
  	email: 'jevgeni@pitfire.eu',
  	pw: '$2a$10$SF/N9YrPlmVusm9Q1C6Xhe1lODAzMWZMr/cJzvzwea9VQfmtOu44.',
  	token: 'redoit1234'
  })
};