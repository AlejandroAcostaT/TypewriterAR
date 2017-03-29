angular.module('booksAR')

.service('sessionService', function($http, API, tokenService, $state){

	var logIn = function(data){
		return $http.post(API.address + "sessions", data);
	};

	var logOut = function(){

		var token = tokenService.getToken();

		$http.delete(API.address + "sessions", {headers:{'token': token}}).then(function successCallback(response) {

			tokenService.deleteToken();
			tokenService.deleteUser();

			$state.go('home');
		}, function errorCallback(response) {
			console.log("error");
			console.log(response.data.data.message);
		});
	};

	return {
    	logIn: logIn,
    	logOut: logOut
    };

	
});