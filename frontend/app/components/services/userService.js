angular.module('booksAR')

.service('userService', function($http, API){

	var createUser= function(data){
		return $http.post(API.address + "users", data);
	};

	var getAllUsers= function(token){
		return $http.get(API.address + "users", {
	    	headers: {'token': token}
		});
	};

	var updateUser= function(token, id, data){
		return $http.put(API.address + "users/" + id, data, {
			headers: {'token': token}
			});
	};

	var getUser= function(token, id){
		return $http.get(API.address + "users/" + id, {
	    	headers: {'token': token}
		});
	};

	return {
	    createUser: createUser,
	    getAllUsers: getAllUsers,
	    updateUser: updateUser,
	    getUser: getUser
    };
	
});