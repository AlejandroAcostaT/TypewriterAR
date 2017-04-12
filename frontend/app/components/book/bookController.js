angular.module('booksAR')

.controller('bookController', function($state, tokenService, sessionService, bookService, API, verifySession){
	//server address 
	this.bookAddress = API.bookAddress;
	this.books = {};
	this.offset = 1;
	this.q = '';
	this.pages = 0;
	this.total = 0;
	this.bookPerPage = 12;
	this.amountBookPerPage = 12;
	this.bookDetail = {};
	this.detail = false;

	var setBooks = (function(data){
		var div = Math.floor(data.total / 12),
			mod = data.total % 12;

		this.books = data.data;
		this.total = data.total;

		//amount of pages
		if(mod > 0){
			this.pages = div + 1;
		}else{
			this.pages = div;
		}

		//books per pages
		if(this.bookPerPage * this.offset > this.total){
			this.amountBookPerPage = this.total
		}else{
			this.amountBookPerPage = this.bookPerPage * this.offset;
		}

	}).bind(this);

	this.next = function(){
		this.offset++;
		if(this.offset > this.pages){
			this.offset = this.pages;
		}
		
		//books per pages
		if(this.bookPerPage * this.offset > this.total){
			this.amountBookPerPage = this.total
		}else{
			this.amountBookPerPage = this.bookPerPage * this.offset;
		}

		this.getBooks();
	};

	this.previous = function(){
		this.offset--;
		if(this.offset < 1){
			this.offset = 1;
		}

		//books per pages
		if(this.bookPerPage * this.offset > this.total){
			this.amountBookPerPage = this.total
		}else{
			this.amountBookPerPage = this.bookPerPage * this.offset;
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

	//Show selected Book's Detail
	this.selectedBook = function(book){
		this.bookDetail = book;
		this.detail = true;
	}

	//deselect Book
	this.deselectBook = function(){
		this.bookDetail = {};
		this.detail = false;
	}

	//log out
	this.logOut = function(){
		sessionService.logOut();
	};

	//verify user has logged in
	if(verifySession){
		$state.go('home');
	}

	//set books
	this.getBooks();

	this.downloadBook =function(){
		var token = tokenService.getToken(),
		id = this.bookDetail.id,
		title = this.bookDetail.title;
		bookService.downloadBook(token, id).then(function successCallback(response) {

			console.log(response.data);

			var file = new Blob([response.data], {type: 'application/pdf'});
       		//var fileURL = URL.createObjectURL(file);
       		//window.open(fileURL);
       		var blobURL = (window.URL || window.webkitURL).createObjectURL(file);
			var anchor = document.createElement("a");
			anchor.download = title+".pdf";
			anchor.href = blobURL;
			anchor.click();
			

		}, function errorCallback(response) {
			//error
			console.log(response.data.data.message);
		});
	};

	this.downloadBook =function(book){
		var token = tokenService.getToken(),
		id = book.id,
		title = book.title;
		bookService.downloadBook(token, id).then(function successCallback(response) {

			var file = new Blob([response.data], {type: 'application/pdf'});
       		//var fileURL = URL.createObjectURL(file);
       		//window.open(fileURL);
       		var blobURL = (window.URL || window.webkitURL).createObjectURL(file);
			var anchor = document.createElement("a");
			anchor.download = title+".pdf";
			anchor.href = blobURL;
			anchor.click();

		}, function errorCallback(response) {
			//error
			console.log(response.data.data.message);
		});
	};

});