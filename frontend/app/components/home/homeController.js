
angular.module('routerApp')

.controller('homeController', function(){

	// new user
	this.user = {};

	// log in user
	this.loginUser = {};

	// error to show in alert
	this.err = {
		show: false
	};

	//New user functions

	this.createUser = function(){
		console.log(this.user);
		this.user = {};
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

	this.verifyUsername = function(){
		if(this.user.username.length >= 8 && this.user.username.length <= 16){
			this.removeError();
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
		console.log(this.loginUser);
		this.loginUser = {};
	};

});