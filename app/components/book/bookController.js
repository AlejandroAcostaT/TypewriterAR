angular.module('booksAR')

.controller('bookController', function($state, tokenService, sessionService, bookService, API){
	//server address 
	this.bookAddress = API.bookAddress;
	this.books = {};
	this.offset = 1;
	this.q = '';
	this.total = 0;

	var setBooks = (function(data){
		var div = Math.floor(data.total / 12),
			mod = data.total % 12;

		this.books = data.data;

		if(mod > 0){
			this.total = div + 1;
		}else{
			this.total = div;
		}

	}).bind(this);

	this.next = function(){
		this.offset++;
		if(this.offset > this.total){
			this.offset = this.total;
		}
		this.getBooks();
	};

	this.previous = function(){
		this.offset--;
		if(this.offset < 1){
			this.offset = 1;
		}
		this.getBooks();
	};

	this.getBooks =function(){
		var token = tokenService.getToken();
		bookService.getAllBooks(token, this.offset, this.q).then(function successCallback(response) {

			setBooks(response.data);

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