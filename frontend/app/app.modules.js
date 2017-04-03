// app.js
var app = angular.module('booksAR', [
	'ui.router',
	'ui.bootstrap',
	'ngFileUpload'
	])
    .run(function($rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, toState) {      
            /*if (toState.name === 'landingpage') {              
                if (!isAuthenticated()) { // Check if user allowed to transition                  
                    event.preventDefault();   // Prevent migration to default state                  
                    $state.go('home.dashboard');           
                }
            }*/
            $rootScope.bodyClass = toState.name + '-page';
            console.log($rootScope.bodyClass);
            //Change this when user login services are ready
            $rootScope.state = toState.name;
        });
    }); 



//Setting API Address
app.service('API', function(){
    return {
        bookAddress: 'http://192.168.1.10:3000/books/',
        address : 'http://192.168.1.10:3000/api/'
    };
});

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

