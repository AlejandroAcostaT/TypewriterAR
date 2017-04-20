/*****************************************************
*            Project: Typewriter AR - 2017           *
*                                                    *
*            Routes: Web                             *
*                                                    *
*            Author: Alejandro Acosta                *
*****************************************************/

var express     = require('express'),
    userCtrl    = require('../controllers/user'),
    sessionCtrl = require('../controllers/session'),
    bookCtrl    = require('../controllers/book'),
    router      = express.Router(),
    multer      = require('multer'),
    coverUpload = multer({ dest: 'uploads/',
                          fileFilter: function (req, file, cb) {
                            var filetypes = /jpeg|jpg|png/,
                                mimetype = filetypes.test(file.mimetype);

                            if (mimetype) {
                              return cb(null, true);
                            }
                            cb("Error: File upload only supports the following filetypes - " + filetypes);
                          } 
                        }),
    contentUpload = multer({ dest: 'uploads/',
                          fileFilter: function (req, file, cb) {
                            var filetypes = /jpeg|jpg|png|mp4|mp3|wav|3gp|octet-stream/,
                                mimetype = filetypes.test(file.mimetype);

                            if (mimetype) {
                              return cb(null, true);
                            }
                            cb("Error: File upload only supports the following filetypes - " + filetypes);
                          } 
                        }),
    cpUpload = contentUpload.fields([{ name: 'marker', maxCount: 1 }, { name: 'content', maxCount: 1 }, { name: 'texture', maxCount: 1 }]),
    pdfUpload = multer({ dest: 'uploads/',
                          fileFilter: function (req, file, cb) {
                            var filetypes = /pdf/,
                                mimetype = filetypes.test(file.mimetype);

                            if (mimetype) {
                              return cb(null, true);
                            }
                            cb("Error: File upload only supports the following filetypes - " + filetypes);
                          } 
                        });

module.exports = (function () {

  router.get('/', function (req, res) {
    res.send('hello world')
  })

  /************************************************************************************************************************/
  /*                                              Web Routes
  /************************************************************************************************************************/

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
  router.post('/books', sessionCtrl.verifySession, coverUpload.single('cover'), bookCtrl.createBook);
  router.get('/books/:id', sessionCtrl.verifySession, bookCtrl.getBookById);
  router.put('/books/:id', sessionCtrl.verifySession, coverUpload.single('cover'), bookCtrl.updateBook);
  router.put('/books/:id/publish', sessionCtrl.verifySession, bookCtrl.publishBook);
  router.put('/books/:id/save', sessionCtrl.verifySession, bookCtrl.updateBookPages);
  router.get('/books/:id/pdf', sessionCtrl.verifySession, bookCtrl.getPDF);
  router.put('/books/:id/pdf', sessionCtrl.verifySession, pdfUpload.single('pdf'), bookCtrl.savePDF);
  router.delete('/books/:id', sessionCtrl.verifySession, bookCtrl.deleteBook);

  /**************************************/
  /*               Content              */
  /**************************************/
  router.post('/books/:id/content', sessionCtrl.verifySession, cpUpload, bookCtrl.addContent);

  /************************************************************************************************************************/
  /*                                              Mobile Routes
  /************************************************************************************************************************/

  /**************************************/
  /*               User                 */
  /**************************************/


  /**************************************/
  /*               Book                 */
  /**************************************/
  

  return router;

})();