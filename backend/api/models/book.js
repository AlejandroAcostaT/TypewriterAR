var Bookshelf = require('../db/bookshelf');
	require('./user');

var Book = Bookshelf.Model.extend({
  tableName: 'book',
  hasTimestamps: true,
  user: function(){
  	return this.belongsTo('User', 'idUser');
  }
});

module.exports = Bookshelf.model('Book', Book);