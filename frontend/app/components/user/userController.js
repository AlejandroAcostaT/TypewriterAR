angular.module('booksAR')

.controller('userController', function($state, userService, sessionService, bookService, API, verifySession){

	//server address 
	this.bookAddress = API.bookAddress;

	//user
	this.editUser = false;
	this.user = JSON.parse(sessionStorage.user);

	console.log(this.user.books);

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

	//ALERTS
	this.alertSuccess = { 
		show: false,
	 	msg: '' 
	};

	this.alertDanger = {
		show: false,
	 	msg: '' 
	};

	this.closeSuccessAlert = function(){
		this.alertSuccess.show = false;
		this.alertSuccess.msg = '';
	};

	this.showSuccessAlert = function(msg){
		this.alertSuccess.show = true;
		this.alertSuccess.msg = msg;
	};

	this.closeDangerAlert = function(){
		this.alertDanger.show = false;
		this.alertDanger.msg = '';
	};

	this.showDangerAlert = function(msg){
		this.alertDanger.show = true;
		this.alertDanger.msg = msg;
	};

	var showSuccessMessage = (function(msg){
		this.showSuccessAlert(msg);
	}).bind(this);

	var showDangerMessage = (function(msg){
		this.showDangerAlert(msg);
	}).bind(this);

	// User functions

	this.logOut = function(){
		sessionService.logOut();
	};

	this.changeUpdate = function(){
		this.editUser = true;
	};

	var setUser = (function(data){
		sessionStorage.user = JSON.stringify(data);
		this.user = JSON.parse(sessionStorage.user);
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
		var token = sessionStorage.token,
		id = this.user.id,
		user = this.updUser;

		userService.updateUser(token, id, user).then(function successCallback(response) {

			userService.getUser(token, id).then(function successCallback(response) {

				setUser(response.data.data);
				showSuccessMessage('User has been updated!');

			}, function errorCallback(response) {
				//error
				showDangerMessage(response.data.data.message);
				console.log(response.data.data.message);
			});
			
		}, function errorCallback(response) {
			//error
			showDangerMessage(response.data.data.message);
			console.log(response.data.data.message);
		});

	};

	this.cancelUpdate = function(){
		this.updUser = this.user;
		this.editUser = false;
	};

	// Book functions

	this.publishBook = function(book){
		var token = sessionStorage.token,
		bookId = book.id,
		userId = this.user.id,
		bookPublish = book.publish;

		bookService.publishBook(token, bookId).then(function successCallback(response) {

			userService.getUser(token, userId).then(function successCallback(response) {
				
				if(bookPublish == true){
					showSuccessMessage('Book has been unpublished!');
				}else{
					showSuccessMessage('Book has been published!');
				}
				
				setUser(response.data.data);

			}, function errorCallback(response) {
				//error
				showDangerMessage(response.data.data.message);
				console.log(response.data.data.message);
			});
			
		}, function errorCallback(response) {
			//error
			showDangerMessage(response.data.data.message);
			console.log(response.data.data.message);
		});
	};

	this.deleteBook = function(book){
		var token = sessionStorage.token,
		bookId = book.id,
		userId = this.user.id;

		bookService.deleteBook(token, bookId).then(function successCallback(response) {

			userService.getUser(token, userId).then(function successCallback(response) {

				showSuccessMessage('Book has been deleted!');
				setUser(response.data.data);

			}, function errorCallback(response) {
				//error
				showDangerMessage(response.data.data.message);
				console.log(response.data.data.message);
			});
			
		}, function errorCallback(response) {
			//error
			showDangerMessage(response.data.data.message);
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
		var token = sessionStorage.token,
		id = this.user.id,
		data = new FormData();

	    data.append("title", this.newBook.title);
	    data.append('description', this.newBook.description);
	    data.append('cover', this.newBook.cover);
	    data.append('idUser', id);

		bookService.createBook(token, data).then(function successCallback(response) {

			userService.getUser(token, id).then(function successCallback(response) {

				showSuccessMessage('Book has been created!');
				setUser(response.data.data);
				bookCreated();

			}, function errorCallback(response) {
				//error
				console.log(response.data.data.message);
				console.log(response.status);
				showDangerMessage(response.data.data.message);
				
			});
			
		}, function errorCallback(response) {
			//error
			showDangerMessage(response.data.data.message);
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
		var token = sessionStorage.token,
		idUser = this.user.id,
		idBook = this.updBook.id,
		data = new FormData();

	    data.append("title", this.updBook.title);
	    data.append('description', this.updBook.description);
	    data.append('cover', this.updBook.cover);
	    data.append('idUser', idUser);

		bookService.updateBook(token, idBook, data).then(function successCallback(response) {

			userService.getUser(token, idUser).then(function successCallback(response) {

				showSuccessMessage('Book has been updated!');
				setUser(response.data.data);
				bookUpdated();

			}, function errorCallback(response) {
				//error
				showDangerMessage(response.data.data.message);
				console.log(response.data.data.message);
			});
			
		}, function errorCallback(response) {
			//error
			showDangerMessage(response.data.data.message);
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
	this.downloadBook =function(book){
		var token = sessionStorage.token,
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

			document.body.appendChild(anchor);
			anchor.click();
			showSuccessMessage('Your download should start soon!');

			setTimeout(function(){
		        document.body.removeChild(anchor);
		        window.URL.revokeObjectURL(blobURL);  
		    }, 100);

		}, function errorCallback(response) {
			//error
			console.log(response.data.data.message);
		});
	};

	this.goToTypewriter = function(book){
		sessionStorage.book = JSON.stringify(book);

		$state.go('typewriter');
	};

});