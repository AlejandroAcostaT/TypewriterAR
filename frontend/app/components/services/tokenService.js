angular.module('booksAR')

.service('tokenService', function(){

	return {
        getToken: function () {
            return token;
        },
        setToken: function(data) {
            token = data;
        },
        deleteToken: function(){
			token = "";
		},
		getUser: function () {
            return user;
        },
        setUser: function(data) {
            user = data;
        },
        deleteUser: function(){
			user = "";
		}
    };
	
});