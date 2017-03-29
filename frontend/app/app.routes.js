angular.module('booksAR')

.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
        // Routes
        .state('home', {
            url: '/',
            templateUrl: './app/components/home/homeView.html',
            controller: 'homeController',
            controllerAs: 'homeCtrl'
        })
        .state('typewriter', {
            url: '/typewriter',
            templateUrl: './app/components/typewriter/typewriterView.html',
            controller: 'typewriterController',
            controllerAs: 'typewriterCtrl',
            resolve: {
                verifySession:  function(tokenService){
                    return tokenService.getToken()=="";
                }
            }
        })
        .state('user', {
            url: '/user',
            templateUrl: './app/components/user/userView.html',
            controller: 'userController',
            controllerAs: 'userCtrl',
            resolve: {
                verifySession:  function(tokenService){
                    return tokenService.getToken()=="";
                }
            }
        })
        .state('book', {
            url: '/book',
            templateUrl: './app/components/book/bookView.html',
            controller: 'bookController',
            controllerAs: 'bookCtrl',
            resolve: {
                verifySession:  function(tokenService){
                    return tokenService.getToken()=="";
                }
            }
        });
        
});