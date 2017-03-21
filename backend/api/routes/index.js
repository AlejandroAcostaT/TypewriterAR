var express     = require('express'),
userCtrl        = require('../controllers/user'),
sessionCtrl     = require('../controllers/session'),
bookCtrl        = require('../controllers/book'),
router          = express.Router();

module.exports = (function () {

  router.get('/', function (req, res) {
    res.send('hello world')
  })

  /**************************************/
  /*               User                 */
  /**************************************/

	router.get('/users', sessionCtrl.verifySession, userCtrl.getUsers);
	router.post('/users', userCtrl.createUser);
	router.get('/users/:id', sessionCtrl.verifySession, userCtrl.getUserById);
	router.put('/users/:id', sessionCtrl.verifySession, userCtrl.updateUser);
	router.delete('/users/:id', sessionCtrl.verifySession, userCtrl.deleteUser);

  /**************************************/
  /*              Session               */
  /**************************************/

  router.post('/sessions', sessionCtrl.deleteExistingSession, sessionCtrl.createSession);
  router.delete('/sessions', sessionCtrl.verifySession, sessionCtrl.deleteSession);

  /**************************************/
  /*               Book                 */
  /**************************************/

  router.get('/books', sessionCtrl.verifySession, bookCtrl.getBooks);
  router.post('/books', sessionCtrl.verifySession, bookCtrl.createBook);
  router.get('/books/:id', sessionCtrl.verifySession, bookCtrl.getBookById);
  router.put('/books/:id', sessionCtrl.verifySession, bookCtrl.updateBook);
  router.put('/books/:id/publish', sessionCtrl.verifySession, bookCtrl.publishBook);
  router.delete('/books/:id', sessionCtrl.verifySession, bookCtrl.deleteBook);

  return router;

})();