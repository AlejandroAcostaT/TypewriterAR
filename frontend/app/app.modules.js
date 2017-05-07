// app.js
var app = angular.module('booksAR', [
	'ui.router',
	'ui.bootstrap',
	'ngFileUpload',
    'angular-loading-bar'
	])
    .run(function($rootScope, $state) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, from, fromParams, error) {      
            /*if (toState.name === 'landingpage') {              
                if (!isAuthenticated()) { // Check if user allowed to transition                  
                    event.preventDefault();   // Prevent migration to default state                  
                    $state.go('home.dashboard');           
                }
            }*/
            $rootScope.bodyClass = toState.name + '-page';

            //Change this when user login services are ready
            $rootScope.state = toState.name;

        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, from, fromParams, error) {      
            /*if (toState.name === 'landingpage') {              
                if (!isAuthenticated()) { // Check if user allowed to transition                  
                    event.preventDefault();   // Prevent migration to default state                  
                    $state.go('home.dashboard');           
                }
            }*/


            if (error === "home") {
                
                $rootScope.bodyClass = 'home-page';

                $rootScope.state = 'home';
                $state.go("home");
             }

        });

    });


        



//Setting API Address
app.service('API', function(){
    return {
        bookAddress: 'https://typewriterar-tartaretalex.c9users.io/books/', //'http://192.168.1.12:3000/books/',
        address : 'https://typewriterar-tartaretalex.c9users.io/api/' //'http://192.168.1.12:3000/api/'
    };
});

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

app.filter('range', function() {
  return function(input, min, max) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    for (var i=min; i<=max; i++)
      input.push(i);
    return input;
  };
});

