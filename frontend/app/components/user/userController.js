angular.module('booksAR')

.controller('userController', function($state, tokenService, userService, sessionService){

	this.editUser = false;
	this.user = tokenService.getUser();

	this.updUser = {
		name: this.user.name,
		lastName: this.user.lastName,
		username: this.user.username,
		email: this.user.email,
		password: ""
	};

	this.logOut = function(){
		sessionService.logOut();
	};

	this.changeUpdate = function(){
		this.editUser = true;
	};

	var setUser = (function(data){
		this.user = data;
		this.updUser = {
			name: this.user.name,
			lastName: this.user.lastName,
			username: this.user.username,
			email: this.user.email,
			password: ""
		};
		this.editUser = false;
	}).bind(this);

	this.updateUser = function(){
		var token = tokenService.getToken(),
		id = this.user.id,
		user = this.updUser;

		userService.updateUser(token, id, user).then(function successCallback(response) {

			userService.getUser(token, id).then(function successCallback(response) {

				setUser(response.data.data);

			}, function errorCallback(response) {
				//error
				console.log(response.data.data.message);
			});
			
		}, function errorCallback(response) {
			//error
			console.log(response.data.data.message);
		});

	};

	this.cancelUpdate = function(){
		this.updUser = this.user;
		this.editUser = false;
	};


	//verify user has logged in
	this.verifySession = function(){
		if(tokenService.getToken()==""){
			$state.go('home');
		}
	};

	this.verifySession();

});