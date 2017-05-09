angular.module('booksAR')

.service('bookService', function($http, API){


	var createBook= function(token, data){ 
		return $http.post(API.address + "books", data, {
			headers: {'token': token,
					  'Content-Type': undefined
					}
			});
	};

	var getAllBooks= function(token, offset, q){
		return $http.get(API.address + "books", {
	    	headers: {'token': token},
	    	params : {
	    				'offset': offset,
	    				'q': q
	    			 }
		});
	};

	var updateBook= function(token, id, data){ 
		return $http.put(API.address + "books/" + id, data, {
			headers: {'token': token,
					  'Content-Type': undefined
					}
			});
	};

	var saveBook= function(token, id, data){ 
		return $http.put(API.address + "books/" + id + '/save', data, {
			headers: {'token': token}
			});
	};

	var getBook= function(token, id){
		return $http.get(API.address + "books/" + id, {
	    	headers: {'token': token}
		});
	};

	var publishBook= function(token, id){
		return $http.put(API.address + "books/" + id + "/publish", null, {
	    	headers: {'token': token}
		});
	};

	var deleteBook= function(token, id){
		return $http.delete(API.address + "books/" + id, {
	    	headers: {'token': token}
		});
	};

	var savePDF= function(token, id, data){ 
		return $http.put(API.address + "books/" + id + "/pdf", data, {
			headers: {'token': token,
					  'Content-Type': undefined
					}
			});
	};

	var downloadBook= function(token, id){
		return $http.get(API.address + "books/" + id + "/pdf", {
	    	headers: {'token': token,
	    			  'Accept': "Content-Type/pdf"
	    			 },
	    	responseType: 'arraybuffer'
		});
	};

	return {
	    createBook: createBook,
	    getAllBooks: getAllBooks,
	    updateBook: updateBook,
	    getBook: getBook,
	    publishBook: publishBook,
	    deleteBook: deleteBook,
	    saveBook: saveBook,
	    savePDF: savePDF,
	    downloadBook: downloadBook
    };
	
});