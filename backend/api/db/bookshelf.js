var configDB = require('./knexfile.js');
var Knex = require('knex')(configDB);
var Bookshelf = require('bookshelf')(Knex);
Bookshelf.plugin( 'registry' );
Bookshelf.plugin('pagination');

module.exports = Bookshelf;