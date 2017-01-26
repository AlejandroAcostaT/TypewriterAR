(function(){
	var app = angular.module('booksAR', [
		'ui.router'
		]);

	app.controller('signInController', function(){
		this.user = {};

		this.createUser = function(){
			console.log(this.user);
			this.user = {};
		};

		this.validatePasswords = function(){
			return this.user.password === this.user.passwordVerif;
		}
	});
	
})();