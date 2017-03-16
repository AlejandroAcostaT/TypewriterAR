/*****************************************************
*		Project: Typewriter AR - 2017				 *
*													 *
*		Controller: User 							 *
*													 *
*		Author: Alejandro Acosta					 *
*****************************************************/

/***************
* Requirements *
***************/

var User 		= require('../models/user'), 	//User model
	validator 	= require("email-validator"),	//Email valiator
	bcrypt 		= require('bcrypt');			//Module for password encrypting 

/************
* Functions *
************/

module.exports = {

	/*****************************************************
	*		Function: getUsers	/ Method: GET 			 *
	*													 *
	*		Description: Get All users from database	 *
	*													 *
	*		Parameters: NONE							 *
	*****************************************************/

	getUsers : function(req, res){
		User.forge()
		.fetchAll({columns: ['id', 'name', 'lastName', 'username', 'email']})
		.then(function(Users){
			res.status(200)
			.json({
				error : false,
				data : Users.toJSON()
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
	*		Function: getUserById / Method: GET 		 *
	*													 *
	*		Description: Get User by its Id 			 *
	*													 *
	*		Parameters: 								 *
	*			- id: integer (params)	 				 *
	*****************************************************/

	getUserById : function(req, res){
		User.forge({
			id : req.params.id
		})
		.fetch({columns: ['id', 'name', 'lastName', 'username', 'email']})
		.then(function(user){
			if(!user){
				res.status(404)
				.json({
					error : true,
					data : {message: "user doesn't exist"}
				})
			}else{
				res.json({
					error : false,
					data : user.toJSON()
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
	*		Function: createUser / Method: POST 		  *
	*													  *
	*		Description: Create a new user  			  *
	*													  *
	*		Parameters: 								  *
	*			- name 		: string (body)			 	  *
	*			- lastName	: string (body)		 		  *
	*			- username 	: string / 8 - 16 char (body) *
	*			- password 	: string / 8 - 16 char (body) *
	*			- email 	: string (body)			 	  *
	******************************************************/

	createUser :  function(req, res){

		var password = req.body.password,
			username = req.body.username,
			email	 = req.body.email,
			salt = bcrypt.genSaltSync(10);

		//Password length validation
		if(password.length < 8 || password.length > 16){
			res.status(400)
			.json({
				error : true,
				data : { message : "Password length must be between 8 and 16 characters" }
			})
		}	

		//Username length validation
		if(username.length < 8 || username.length > 16){
			res.status(400)
			.json({
				error : true,
				data : { message : "Username length must be between 8 and 16 characters" }
			})
		}	

		//Email validation
		if(!validator.validate(email)){
			res.status(400)
			.json({
				error : true,
				data : { message : "Invalid Email" }
			})
		}

		//Encrypting password;
		var hash = bcrypt.hashSync(password, salt); 

		//Creating User in database
		User.forge({
			name: req.body.name,
			lastName: req.body.lastName,
			username: req.body.username,
			password: hash,
			email	: req.body.email
		})
		.save()
		.then(function(user){
			res.status(201)
			.json({
				error: false,
				data: {
					id : user.get('id'),
					name : user.get('name'),
					lastName : user.get('lastName'),
					username : user.get('username'),
					email : user.get('email')
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
	*		Function: updateUser / Method: PUT	 		  *
	*													  *
	*		Description: Update user 		  			  *
	*													  *
	*		Parameters: 								  *
	*			- id 		: integer (params)		 	  *
	*			- name 		: string (body)			 	  *
	*			- lastName	: string (body)		 		  *
	*			- username 	: string / 8 - 16 char (body) *
	*			- email 	: string (body)			 	  *
	******************************************************/

	updateUser : function(req, res){

		var username = req.body.username,
			email	 = req.body.email;

		if(username.length < 8 || username.length > 16){
			res.status(400)
			.json({
				error : true,
				data : { message : "Username length must be between 8 and 16 characters" }
			})
		}	

		if(!validator.validate(email)){
			res.status(400)
			.json({
				error : true,
				data : { message : "Invalid Email" }
			})
		}

		User.where('id', req.params.id)
		.fetch({ require : true })
		.then(function(user){
			user.save({
				name: req.body.name || user.get('name'),
				lastName: req.body.lastName || user.get('lastName'),
				username: req.body.username || user.get('username'),
				email: req.body.email || user.get('email')
			},
			{
				method: "update"
			})
			.then(function(){
				res.status(204)
				.json({
					error : false,
					data : { message : 'User deatils update'}
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
	*		Function: deleteUser / Method: DELETE 		  *
	*													  *
	*		Description: Delete user 		  			  *
	*													  *
	*		Parameters: 								  *
	*			- id: integer (params)		 	  		  *
	******************************************************/

	deleteUser : function(req, res){
		User.forge({id : req.params.id})
		.fetch({require : true})
		.then(function(user){
			user.destroy()
			.then(function(){
				res.status(204)
				.json({
					error : false,
					data : {message : 'User successfully deleted'}
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