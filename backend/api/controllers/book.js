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

		var offset = req.query.offset ? parseInt(req.query.offset): 0,
			q 	   = req.query.q ? req.query.q+'%' : undefined;

		Book.query(function(qb){
			qb.innerJoin('user', 'book.idUser', 'user.id');
			if(q){
				qb.where('book.title', 'LIKE', q);
				qb.orWhere('user.name',  'LIKE', q);
				qb.orWhere('user.lastName',  'LIKE', q);
			}
		})
		.fetchPage({
			pageSize: 12,
			page: offset,
			withRelated: ['user']
		})
		.then(function(Books){
			res.status(200)
			.json({
				error : false,
				data : Books.toJSON(),
				total : Books.pagination.rowCount
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
				var book_json = book.toJSON();
				res.json({
					error : false,
					data : book_json,
					pages : fs.readJsonSync(book_json.pages)
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
	*			- cover 		: file (body/file)  	  *
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
			userDir = './public/books/'+req.decoded.username+'-'+req.body.title+'/',
			cover = req.decoded.username+'-'+req.body.title+'/'+req.file.filename,
			coverDir = './public/books/'+cover;

		//create new book folder in public folder	
		fs.ensureDirSync(dir);

		// move cover file to book folder
		fs.moveSync(req.file.path, coverDir);

		//create json files in book folder
		fs.writeJsonSync(userDir+'pages.json', []);
		fs.writeJsonSync(userDir+'content/content.json', []);

		Book.forge({
			title: req.body.title,
			description: req.body.description,
			cover: cover,
			pages: userDir+'pages.json',
			content: userDir+'content/content.json',
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
					pages : book.get('pages'),
					content : book.get('content'),
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
	*			- cover			: file (body/file url)    *
	******************************************************/

	updateBook : function(req, res){

		Book.where('id', req.params.id)
		.fetch({ require : true })
		.then(function(book){
			// if new cover image comes

			if(req.file){

				var file = req.file,
				previous = './public/books/'+book.get('cover'),
				cover = req.decoded.username+'-'+req.body.title+'/'+req.file.filename;

				// copy cover file to book folder
				fs.moveSync(req.file.path, './public/books/'+cover);

				// remove cover file from its original path
				console.log(previous);
				fs.remove(previous, err =>{
					if(err) console.log(err);
					console.log('success');
				});
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
			var folder = './public/books/'+req.decoded.username+'-'+book.get('title');

			// remove cover file from its original path
			fs.removeSync(folder);

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
	},

	/******************************************************
	*		Function: updateBookPages / Method: PUT 	  *
	*													  *
	*		Description: update pages.json 		  		  *
	*													  *
	*		Parameters: 								  *
	*			- id 	: integer (params)		 	  	  *
	*			- pages : json object (body)	 	  	  *
	******************************************************/

	updateBookPages : function(req, res){

		Book.forge({id : req.params.id})
		.fetch({require : true})
		.then(function(book){
			var folder = './public/books/'+req.decoded.username+'-'+book.get('title')+'/';

			//create json files in book folder
			fs.writeJsonSync(folder+'pages.json', req.body.pages);

			res.status(204)
			.json({
				error : false,
				data : {message : 'Book pages successfully updated'}
			});

		})
		.catch(function(err){
			res.status(500)
			.json({error : true, data : {message : err.message}})
		})
	},

	/************************************************************
	*		Function: addContent / Method: POST		 	  		*
	*													  		*
	*		Description: add marker and content to book folder 	*
	*													  		*
	*		Parameters: 								  		*
	*			- id 		: integer (params)		 			*
	*			- marker 	: file (body/file) 					*
	*			- content	: file (body/file) 					*
	*************************************************************/

	addContent : function(req, res){

		if(!req.files){
			res.status(400)
			.json({
				error: true,
				data: {message: "AR content files are missing"}
			});
		}

		Book.where('id', req.params.id)
		.fetch({ require : true })
		.then(function(book){

			var markerFile = req.files['marker'][0],
			contentFile = req.files['content'][0],
			path = './public/books/'+ req.decoded.username+'-'+book.get('title')+'/content',
			userPath = req.decoded.username+'-'+book.get('title')+'/content';

			// copy marker file to book's content folder
			fs.moveSync(markerFile.path, path+'/'+markerFile.filename);
			// copy content file to book's content folder
			fs.moveSync(contentFile.path, path+'/'+contentFile.filename);

			res.status(200)
			.json({
				error : false,
				data : {
					markerPath: userPath+'/'+markerFile.filename,
					contentPath: userPath+'/'+contentFile.filename,
					message : 'Page content successfully uploaded'
				}
			});
			
		})
		.catch(function(err){
			res.status(500)
			.json({
				error : true,
				data : { message : err.message }
			})
		});
	}
}