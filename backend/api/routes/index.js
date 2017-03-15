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

	router.get('/users', userCtrl.getUsers);
	router.post('/users', userCtrl.createUser);
	router.get('/users/:id', userCtrl.getUserById);
	router.put('/users/:id', userCtrl.updateUser);
	router.delete('/users/:id', userCtrl.deleteUser);

  /**************************************/
  /*              Sesions               */
  /**************************************/


  return router;

})();