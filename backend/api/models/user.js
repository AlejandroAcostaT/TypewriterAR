var Bookshelf = require('../db/bookshelf');

var User = Bookshelf.Model.extend({
  tableName: 'user',
  hasTimestamps: true
});

module.exports = User;