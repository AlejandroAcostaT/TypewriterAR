angular.module('booksAR')

.service('sessionService', function($http, API, tokenService, $state){

	return {
		logIn: function(data){
			return $http.post(API.address + "sessions", data);
		},

		logOut: function(){

			var token = tokenService.getToken();
			console.log(token);

			$http.delete(API.address + "sessions", {headers:{'token': token}}).then(function successCallback(response) {

				tokenService.deleteToken();
				tokenService.deleteUser();

				$state.go('home');
			}, function errorCallback(response) {
				console.log("error");
				console.log(response.data.data.message);
			});
		}

	};
	
});