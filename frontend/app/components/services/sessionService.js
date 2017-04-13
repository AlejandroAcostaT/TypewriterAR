angular.module('booksAR')

.service('sessionService', function($http, API, $state, $window){

	var logIn = function(data){
		return $http.post(API.address + "sessions", data);
	};

	var logOut = function(){

		var token = sessionStorage.token;

		$http.delete(API.address + "sessions", {headers:{'token': token}}).then(function successCallback(response) {

			delete sessionStorage.user;
      		delete sessionStorage.token;
      		delete sessionStorage.loggedIn;

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