var Bookshelf = require('../db/bookshelf');

var Book = Bookshelf.Model.extend({
  tableName: 'book',
  hasTimestamps: true
});

module.exports = Book;