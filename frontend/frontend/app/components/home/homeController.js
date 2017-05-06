
angular.module('booksAR')

.controller('homeController', function($state, userService, sessionService){

	// new user
	this.user = {};

	// log in user
	this.loginUser = {
		device: "web"
	};

	// error to show in alert
	this.err = {
		show: false
	};

	//New user functions

	this.createUser = function(){

		var error = this.err,
			user = this.user;

		userService.createUser(user).then(function successCallback(response) {

			var login = {
				username: user.username,
				password: user.password,
				device : "web"
			}

			sessionService.logIn(login).then(function successCallback(response) {

				//Session Storage
				sessionStorage.token = response.data.data.token;
				sessionStorage.loggedIn =  true;
				sessionStorage.user = JSON.stringify(response.data.data.user);

				$state.go('book');
			}, function errorCallback(response) {
				error.message = response.data.data.message;
				error.show = true;
			});

		}, function errorCallback(response) {
			error.message = response.data.data.message;
			error.show = true;
		});
		
	};

	this.addError = function(message){
		this.err.message = message;
		this.err.show=true;
		return true;
	};

	this.removeError = function(){
		this.err.message = '';
		this.err.show=false;
		return true;
	};

	this.verifyName = function(valid){
		if(valid){
			this.removeError();
		}else{
			this.addError('All fields are requiered to sign up.');
		}
	};

	this.verifyLastName = function(valid){
		if(valid){
			this.removeError();
		}else{
			this.addError('All fields are requiered to sign up.');
		}
	};

	this.verifySpecialCharacters = function(){
		return /^[a-zA-Z0-9]*$/.test(this.user.username) == false;
	}

	this.verifyUsername = function(){
		if(this.user.username.length >= 8 && this.user.username.length <= 16){
			if(/^[a-zA-Z0-9]*$/.test(this.user.username) == false){
				this.addError('Username must not contain white spaces or special characters.');
			}else{
				this.removeError();
			}
		}else{
			this.addError('Username length must be between 8 and 16 characters.');
		}
	};

	this.verifyEmail = function(valid){
		if(valid){
			this.removeError();
		}else{
			this.addError('Email must be valid.');
		}
	};

	this.verifyPassword = function(){
		if(this.user.password.length >= 8 && this.user.password.length <= 16){
			this.removeError();
		}else{
			this.addError('Password length must be between 8 and 16 characters.');
		}
	};

	//Log In Functions

	this.verifyLoginUsername = function(){
		if(this.loginUser.username.length >= 8 && this.loginUser.username.length <= 16){
			this.removeError();
		}else{
			this.addError('Username length must be between 8 and 16 characters.');
		}
	};

	this.verifyLoginPassword = function(){
		if(this.loginUser.password.length >= 8 && this.loginUser.password.length <= 16){
			this.removeError();
		}else{
			this.addError('Password length must be between 8 and 16 characters.');
		}
	};

	this.logIn = function(){

		var error = this.err;

		sessionService.logIn(this.loginUser).then(function successCallback(response) {

			//Session Storage
			sessionStorage.token = response.data.data.token;
			sessionStorage.loggedIn =  true;
			sessionStorage.user = JSON.stringify(response.data.data.user);

			$state.go('book');
		}, function errorCallback(response) {
			error.message = response.data.data.message;
			error.show = true;
		});
	};

});