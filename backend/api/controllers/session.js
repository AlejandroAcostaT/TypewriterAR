/*****************************************************
*		Project: Typewriter AR - 2017				 *
*													 *
*		Controller: Session							 *
*													 *
*		Author: Alejandro Acosta					 *
*****************************************************/

var Session = require('../models/session'),
	User 	= require('../models/user'),
	jwt		= require('jsonwebtoken'),
	async	= require('async'),
	config	= require('../config.js'),
	bcrypt 	= require('bcrypt');

module.exports = {

	/******************************************************
	*		Function: verifySession (MIDDLEWARE)	 	  *
	*													  *
	*		Description: Verify existing session  		  *
	*													  *
	******************************************************/

	verifySession : function(req, res, next){
		
		var token = req.headers['token'];

		if(!token){

			res.status(403)
			.json({error : true, data : {message : "The token was not provided"}});

		}else{
			// verifies secret and checks exp
		    jwt.verify(token, config.secret, function(err, decoded) {      
		      if (err) {
		      	console.log("Failed to authenticate token.");
		        return res.status(400)
		        		.json({ success: false, message: "Failed to authenticate token."});    
		      } else {
		        // if everything is good, save to request for use in other routes
		        req.decoded = decoded;    
		        next();
		      }
		    });

		}		
	},

	/******************************************************
	*		Function: deleteExistingSession (MIDDLEWARE)  *
	*													  *
	*		Description: If session exist it's deleted	  *
	*													  *
	******************************************************/

	deleteExistingSession : function(req, res, next){
	
		var username = req.body.username,
			device 	= req.body.device;
		Session.forge({
			username : username,
			type : device
		})
		.fetch()
		.then(function(session){
			if(!session){
				next();
			}else{
				session.destroy()
				.then(function(){
					next();
				})
				.catch(function(err){
					res.status(500)
					.json({error : true, data : {message : err.message}})
				});
			}
		})
		.catch(function(err){
			res.status(500)
			.json({
				error : true,
				data : {message : err.message}
			})
		})

	},

	/******************************************************
	*		Function: createSession / Method: POST 		  *
	*													  *
	*		Description: Create a new session  			  *
	*													  *
	*		Parameters: 								  *
	*			- username 		: string (body)		 	  *
	*			- password 		: string (body)		 	  *
	*			- device 		: string (body)		 	  *
	******************************************************/

	createSession :  function(req, res){
		var password = req.body.password,
			username = req.body.username,
			device	 = req.body.device; // "web" or "mobile"
			
		async.series({
		    verifyUser: function(callback) {
		    	//get user by username
		    	User.forge({
					username : username
				})
				.fetch({withRelated: ['books']})
				.then(function(user){
					if(!user){ 
					//verify user exist in database
					if(device == "web"){
						res.status(404)
						.json({
							error : true,
							data : {message: "Username or password are incorrect"}
						})
					}else if(device == "mobile"){
						res.status(404)
						.json({
							message: "Username or password are incorrect"
						})
					}
						
					}else{
						user_json = user.toJSON();
						if(!bcrypt.compareSync(password, user_json.password)){ 
						//verify password match the database one
							if(device == "web"){
								res.status(404)
								.json({
									error : true,
									data : {message: "Username or password are incorrect"}
								})
							}else if(device == "mobile"){
								res.status(404)
								.json({
									message: "Username or password are incorrect"
								})
							}
						}else{
						// No error, pass user to callback	
							delete user_json.password;
							callback(null, user_json);
						}
					}
				})
				.catch(function(err){
					console.log(err);
					res.status(500)
					.json({
						error : true,
						data : {message : err.message}
					})
				});
		    },
		    createNewSession: function(callback){
		    	//Creating Session in database
				Session.forge({
					username: username,
					type: device
				})
				.save()
				.then(function(session){
					//create token
					var date  	= new Date(),
						token 	= {};

					if(device=='web'){
						token 	= jwt.sign({
											username: username,
										 	sessionId: session.get('id'),
										 	device: 'web',
										 	date: date
										},
										config.secret,
										{
								         	expiresIn: '24h' // expires in 24 hours
								        });
					}else if(device=='mobile'){
						token 	= jwt.sign({
											username: username,
										 	sessionId: session.get('id'),
										 	device: 'mobile',
										 	date: date
										},
										config.secret
										);
					}
					 	
					//pass token to callback
					callback(null, token);
				})
				.catch(function (err) {
					res.status(500)
					.json({
						error: true,
						data: {message: err.message}
					});
				});
		    }
		}, 
		function(err, results) {
		    // results is now equal to: {verifyUser: user_json, createNewSession: token}
		    if(device=='mobile'){

		    	res.status(201)
				.json({
					user: {
						id: results.verifyUser.id,
						name : results.verifyUser.name,
						lastName : results.verifyUser.lastName,
						username: results.verifyUser.username,
						email: results.verifyUser.email
					},
					token : results.createNewSession
				});

		    }else if(device=='web'){
		    	res.status(201)
				.json({
					error: false,
					data: {
						user : results.verifyUser,
						token : results.createNewSession
					}
				});
		    }
		    
		});
		
	},

	/******************************************************
	*		Function: deleteSession / Method: DELETE	  *
	*													  *
	*		Description: Delete session		  			  *
	*													  *
	*		Parameters: 								  *
	*			- token: json-web-token (headers)  		  *
	******************************************************/

	deleteSession : function(req, res){

		var token 	= req.headers['token'],
			decoded = jwt.verify(token, config.secret);

		console.log(token);
		console.log(decoded.sessionId);

		Session.forge({id : decoded.sessionId})
		.fetch({require : true})
		.then(function(session){
			session.destroy()
			.then(function(){
				res.status(204)
				.json({
					error : false,
					data : {message : 'Session successfully deleted'}
				})
			})
			.catch(function(err){
				res.status(500)
				.json({error : true, data : {message : err.message}})
			});
		})
		.catch(function(err){
			res.status(500)
			.json({error : true, data : {message : err.message}})
		});
	}
	
}