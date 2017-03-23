/*****************************************************
*		Project: Typewriter AR - 2017				 *
*													 *
*		Controller: Book 							 *
*													 *
*		Author: Alejandro Acosta					 *
*****************************************************/

/***************
* Requirements *
***************/

var Book = require('../models/book'), 	//Book model
	fs 	 = require('fs-extra');


/************
* Functions *
************/

module.exports = {

	/*****************************************************
	*		Function: getBooks	/ Method: GET 			 *
	*													 *
	*		Description: Get all books from database	 *
	*													 *
	*		Parameters: NONE							 *
	*****************************************************/

	getBooks : function(req, res){
		Book.forge()
		.fetchAll({withRelated: ['user']})
		.then(function(Books){
			res.status(200)
			.json({
				error : false,
				data : Books.toJSON()
			});
		})
		.catch(function (err) {
	     	res.status(500)
			.json({
				error: true,
				data: {message: err.message}
			});
	    });
	},

	/*****************************************************
	*		Function: getBookById / Method: GET 		 *
	*													 *
	*		Description: Get Book by its Id 			 *
	*													 *
	*		Parameters: 								 *
	*			- id: integer (params)	 				 *
	*****************************************************/

	getBookById : function(req, res){
		Book.forge({
			id : req.params.id
		})
		.fetch()
		.then(function(book){
			if(!book){
				res.status(404)
				.json({
					error : true,
					data : {message: "book doesn't exist"}
				})
			}else{
				res.json({
					error : false,
					data : book.toJSON()
				})
			}
		})
		.catch(function(err){
			res.status(500)
			.json({
				error : false,
				data : {message : err.message}
			})
		})
	},

	/******************************************************
	*		Function: createBook / Method: POST 		  *
	*													  *
	*		Description: Create a new book  			  *
	*													  *
	*		Parameters: 								  *
	*			- title 		: string (body)			  *
	*			- description	: string (body)		 	  *
	*			- cover 		: string (body/file url)  *
	*			- idUser 		: integer (body)		  *
	******************************************************/

	createBook :  function(req, res){

		if(!req.file){
			res.status(400)
			.json({
				error: true,
				data: {message: "Cover file missing"}
			});
		}

		
		var dir = './public/books/'+req.decoded.username+'-'+req.body.title+'/content',
			file = req.file,
			cover = './public/books/'+req.decoded.username+'-'+req.body.title+'/'+req.file.filename;

		//create new book folder in public folder	
		fs.ensureDirSync(dir);

		// move cover file to book folder
		fs.moveSync(req.file.path, cover);

		Book.forge({
			title: req.body.title,
			description: req.body.description,
			cover: cover,
			publish: false,
			idUser	: req.body.idUser
		})
		.save()
		.then(function(book){
			res.status(201)
			.json({
				error: false,
				data: {
					id : book.get('id'),
					title : book.get('title'),
					description : book.get('description'),
					cover : book.get('cover'),
					idUser : book.get('idUser')
				}
			});
		})
		.catch(function (err) {
			res.status(500)
			.json({
				error: true,
				data: {message: err.message}
			});
		});
	},

	/******************************************************
	*		Function: updateBook / Method: PUT	 		  *
	*													  *
	*		Description: Update book 		  			  *
	*													  *
	*		Parameters: 								  *
	*			- id 			: integer (params)		  *
	*			- description 	: string (body)			  *
	*			- cover			: string (body)		 	  *
	******************************************************/

	updateBook : function(req, res){
		console.log(req.body);
		Book.where('id', req.params.id)
		.fetch({ require : true })
		.then(function(book){
			// if new cover image comes

			if(req.file){

				var file = req.file,
				cover = './public/books/'+req.decoded.username+'-'+book.get('title')+'/'+req.file.filename;

				// copy cover file to book folder
				fs.moveSync(req.file.path, cover);

				// remove cover file from its original path
				fs.removeSync(book.get('cover'));
			}

			book.save({
				description: req.body.description || book.get('description'),
				cover: 	cover || book.get('cover')
			},
			{
				method: "update"
			})
			.then(function(){
				res.status(204)
				.json({
					error : false,
					data : { message : 'Book details update'}
				});
			})
			.catch(function(err){
				res.status(400)
				.json({
					error : true,
					data : { message : err.message }
				})
			})
		})
		.catch(function(err){
			res.status(500)
			.json({
				error : true,
				data : { message : err.message }
			})
		})
	},

	/******************************************************
	*		Function: publishBook / Method: PUT	 		  *
	*													  *
	*		Description: Publish or unpublish book		  *
	*													  *
	*		Parameters: 								  *
	*			- id 		: integer (params)		  	  *
	*			- publish 	: boolean (body)		  	  *
	******************************************************/

	publishBook : function(req, res){

		Book.where('id', req.params.id)
		.fetch({ require : true })
		.then(function(book){
			book.save({
				publish: !book.get('publish')
			},
			{
				method: "update"
			})
			.then(function(){
				res.status(204)
				.json({
					error : false,
					data : { message : 'Book publish attribute changed'}
				});
			})
			.catch(function(err){
				res.status(400)
				.json({
					error : true,
					data : { message : err.message }
				})
			})
		})
		.catch(function(err){
			res.status(500)
			.json({
				error : true,
				data : { message : err.message }
			})
		})
	},

	/******************************************************
	*		Function: deleteBook / Method: DELETE 		  *
	*													  *
	*		Description: Delete book 		  			  *
	*													  *
	*		Parameters: 								  *
	*			- id: integer (params)		 	  		  *
	******************************************************/

	deleteBook : function(req, res){
		Book.forge({id : req.params.id})
		.fetch({require : true})
		.then(function(book){
			book.destroy()
			.then(function(){
				res.status(204)
				.json({
					error : false,
					data : {message : 'Book successfully deleted'}
				})
			})
			.catch(function(err){
				res.status(500)
				.json({error : true, data : {message : err.message}})
			})
		})
		.catch(function(err){
			res.status(500)
			.json({error : true, data : {message : err.message}})
		})
	}
}