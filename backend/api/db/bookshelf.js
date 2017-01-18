var configDB = require('./knexfile.js');
var Knex = require('knex')(configDB);
var Bookshelf = require('bookshelf')(Knex);

module.exports = Bookshelf;