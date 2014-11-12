var Bookshelf  = require('bookshelf');
var Knex = require('knex');

var knex = Knex.initialize(require('../knexfile.js').production);

var db = {
    cnx: Bookshelf(knex)
};

db.models = {
    Projects: db.cnx.Model.extend({
        tableName: 'projects'
    })
};

module.exports = db;
/*
module.exports = {

    cnx: Bookshelf(knex),

    models: {
        Projects: this.cnx.Model.extend({
            tableName: 'projects'
        })
    }
};*/
