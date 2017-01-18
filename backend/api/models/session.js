var Bookshelf = require('../db/bookshelf');

var Session = Bookshelf.Model.extend({
  tableName: 'session',
  hasTimestamps: true
});

module.exports = Session;