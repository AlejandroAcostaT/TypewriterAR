// app.js
var app = angular.module('booksAR', [
	'ui.router',
	'ui.bootstrap',
	'ngFileUpload'
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
            console.log($rootScope.bodyClass);
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
            console.log(error);

            if (error === "home") {
                
                $rootScope.bodyClass = 'home-page';
                console.log($rootScope.bodyClass);
                $rootScope.state = 'home';
                $state.go("home");
             }

        });

    });


        



//Setting API Address
app.service('API', function(){
    return {
        bookAddress: 'http://192.168.1.12:3000/books/',
        address : 'http://192.168.1.12:3000/api/'
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

