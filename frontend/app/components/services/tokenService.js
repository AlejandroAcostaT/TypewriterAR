angular.module('booksAR')

.service('tokenService', function(){

    var token = "";
    var user = {};

    var getToken= function () {
        return token;
    };

    var setToken= function(data) {
        token = data;
    };

    var deleteToken= function(){
		token = "";
	};

	var getUser= function () {
        return user;
    };

    var setUser= function(data) {
        user = data;
    };

    var deleteUser= function(){
		user = {};
	};

    return {
        setToken: setToken,
        getToken: getToken,
        deleteToken: deleteToken,
        setUser: setUser,
        getUser: getUser,
        deleteUser: deleteUser
    };
	
});