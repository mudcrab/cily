var Bookshelf  = require('bookshelf');
var Knex = require('knex');

var knex = Knex.initialize(require('../knexfile.js').production);

var db = {
    cnx: Bookshelf(knex)
};

db.models = {
    Project: db.cnx.Model.extend({
        tableName: 'projects'
    }),

    Task: db.cnx.Model.extend({
        tableName: 'tasks'
    }),

    Build: db.cnx.Model.extend({
        tableName: 'builds'
    }),

    User: db.cnx.Model.extend({
        tableName: 'users'
    }),

    UserProject: db.cnx.Model.extend({
        tableName: 'users_projects'
    })
};

db.collections = {
    Projects: db.cnx.Collection.extend({
        model: db.models.Project
    }),

    Tasks: db.cnx.Collection.extend({
        model: db.models.Task
    }),

    Builds: db.cnx.Collection.extend({
        model: db.models.Build
    }),

    Users: db.cnx.Collection.extend({
        model: db.models.User
    }),

    UserProjects: db.cnx.Collection.extend({
        model: db.models.UserProject
    })
};

module.exports = db;