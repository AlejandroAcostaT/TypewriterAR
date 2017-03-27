angular.module('booksAR')

.controller('bookController', function($state, tokenService, sessionService, bookService, API){
	//server address 
	this.bookAddress = API.bookAddress;
	this.books = {};

	var setBooks = (function(data){
		this.books = data;
		console.log(data[2]);
	}).bind(this);

	this.getBooks =function(){
		var token = tokenService.getToken();
		bookService.getAllBooks(token).then(function successCallback(response) {

			setBooks(response.data.data);

		}, function errorCallback(response) {
			//error
			console.log(response.data.data.message);
		});
	};

	//verify user has logged in
	this.verifySession = function(){
		if(tokenService.getToken()==""){
			$state.go('home');
		}
	};

	//log out
	this.logOut = function(){
		sessionService.logOut();
	}

	this.verifySession();
	this.getBooks();

});