(function(){
	var app = angular.module('booksAR', [
		'ui.router'
		]);

	app.controller('signUpController', function(){
		this.user = {};
		this.err = {
			show: false
		};

		this.createUser = function(){
			console.log(this.user);
			this.user = {};
		};

		this.validatePasswords = function(){
			return this.user.password === this.user.passwordVerif;
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

		this.verifyUsername = function(valid){
			if(valid && this.user.username.length >= 8 && this.user.username.length <= 16){
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

		this.verifyPassword = function(valid){
			if(valid && this.user.password.length >= 8 && this.user.password.length <= 16){
				this.removeError();
			}else{
				this.addError('Password length must be between 8 and 16 characters.');
			}
		};

		this.verifyPasswordVerif = function(valid){
			if(valid && (this.user.passwordVerif.length >= 8) && (this.user.passwordVerif.length <= 16)){
				if(this.validatePasswords()){
					this.removeError();
				}else{
					this.addError('Both passwords must be equals.');
				}
			}else{
				this.addError('Password length must be between 8 and 16 characters.');
			}
		};



	});
	
})();