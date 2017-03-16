var express     = require('express'),
userCtrl        = require('../controllers/user'),
sessionCtrl     = require('../controllers/session'),
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
  /*              Sesions               */
  /**************************************/

  router.post('/sessions', sessionCtrl.deleteExistingSession, sessionCtrl.createSession);
  router.delete('/sessions', sessionCtrl.verifySession, sessionCtrl.deleteSession);

  return router;

})();