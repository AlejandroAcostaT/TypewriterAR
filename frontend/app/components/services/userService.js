angular.module('booksAR')

.service('userService', function($http, API){

	return {
		createUser: function(data){
			return $http.post(API.address + "users", data);
		},

		getAllUsers: function(token){
			return $http.get(API.address + "users", {
		    	headers: {'token': token}
			});
		}
	};
	
});