angular.module('booksAR')

.service('contentService', function($http, API, tokenService, $state){

	var addContent = function(token, id, data){
		return $http.post(API.address + "books/" + id + "/content", data, {
			headers: {'token': token,
					  'Content-Type': undefined
					}
			});
	};

	return {
    	addContent: addContent
    };

	
});