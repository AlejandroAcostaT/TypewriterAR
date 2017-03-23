var Bookshelf = require('../db/bookshelf');
	require('./book');

var User = Bookshelf.Model.extend({
  tableName: 'user',
  hasTimestamps: true,
  books: function(){
  	return this.hasMany('Book', 'idUser');
  }
});

module.exports = Bookshelf.model('User', User);