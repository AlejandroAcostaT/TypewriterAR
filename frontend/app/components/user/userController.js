angular.module('booksAR')

.controller('userController', function($state, tokenService, userService, sessionService, bookService, API, verifySession){
	//server address 
	this.bookAddress = API.bookAddress;

	//user
	this.editUser = false;
	this.user = tokenService.getUser();

	this.updUser = {
		name: this.user.name,
		lastName: this.user.lastName,
		username: this.user.username,
		email: this.user.email,
		password: ""
	};

	//book
	this.bookCreation = false;
	this.newBook = {};

	this.bookUpdate = false;
	this.updBook = {};

	// User functions

	this.logOut = function(){
		sessionService.logOut();
	};

	this.changeUpdate = function(){
		this.editUser = true;
	};

	var setUser = (function(data){
		this.user = tokenService.setUser(data);
		this.user = tokenService.getUser();
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

	// Book functions

	this.publishBook = function(book){
		var token = tokenService.getToken(),
		bookId = book.id,
		userId = this.user.id;

		bookService.publishBook(token, bookId).then(function successCallback(response) {

			userService.getUser(token, userId).then(function successCallback(response) {

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

	this.deleteBook = function(book){
		var token = tokenService.getToken(),
		bookId = book.id,
		userId = this.user.id;

		bookService.deleteBook(token, bookId).then(function successCallback(response) {

			userService.getUser(token, userId).then(function successCallback(response) {

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

	this.uploadCover = function (file) {
        Upload.upload({
            url: '',
            data: {file: file}
        }).then(function (resp) {
            console.log('Success');
        }, function (resp) {
            console.log('Error status: ');
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };

    var bookCreated = (function(){
		this.newBook = {};
		this.bookCreation = false;
	}).bind(this);

    this.createBook = function(){
		var token = tokenService.getToken(),
		id = this.user.id,
		data = new FormData();

	    data.append("title", this.newBook.title);
	    data.append('description', this.newBook.description);
	    data.append('cover', this.newBook.cover);
	    data.append('idUser', id);

		bookService.createBook(token, data).then(function successCallback(response) {

			userService.getUser(token, id).then(function successCallback(response) {

				setUser(response.data.data);
				bookCreated();

			}, function errorCallback(response) {
				//error
				console.log(response.data.data.message);
			});
			
		}, function errorCallback(response) {
			//error
			console.log(response.data.data.message);
		});

	};

	this.changeBookCreation = function(){
		this.bookCreation = true;
	};

	this.cancelCreateBook = function(){
		this.newBook = {};
		this.bookCreation = false;
	};

	var bookUpdated = (function(){
		this.updBook = {};
		this.bookUpdate = false;
		this.updBook.cover = "";
	}).bind(this);

	this.updateBook = function(){
		var token = tokenService.getToken(),
		idUser = this.user.id,
		idBook = this.updBook.id,
		data = new FormData();

	    data.append("title", this.updBook.title);
	    data.append('description', this.updBook.description);
	    data.append('cover', this.updBook.cover);
	    data.append('idUser', idUser);

		bookService.updateBook(token, idBook, data).then(function successCallback(response) {

			userService.getUser(token, idUser).then(function successCallback(response) {

				setUser(response.data.data);
				bookUpdated();

			}, function errorCallback(response) {
				//error
				console.log(response.data.data.message);
			});
			
		}, function errorCallback(response) {
			//error
			console.log(response.data.data.message);
		});

	};

	this.changeBookUpdate = function(book){
		this.bookUpdate = true;
		this.updBook = Object.assign({}, book);
		this.updBook.cover = API.bookAddress + book.cover;
	};

	this.cancelUpdateBook = function(){
		this.updBook = {};
		this.updBook.cover = "";
		this.bookUpdate = false;
	};

	this.goToTypewriter = function(){
		$state.go('typewriter');
	}

	//verify user has logged in
	if(verifySession){
		$state.go('home');
	}

});