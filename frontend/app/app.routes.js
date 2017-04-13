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
                verifySession:  function($q){
                    //console.log(tokenService.getToken());
                    var deferred = $q.defer();

                    if (sessionStorage.token) {
                        return sessionStorage.token;
                    } else {
                        return $q.reject("home");
                    }
                },
                Book:  function($q, bookService){

                    if (!sessionStorage.token) {
                        return $q.reject("home");
                    }

                    var id = JSON.parse(sessionStorage.book).id; 

                    return bookService.getBook(sessionStorage.token, id).then(function successCallback(response) {
                        return response.data;

                    }, function errorCallback(response) {
                        //error
                        return response.data;
                    });
                }
            }
        })
        .state('user', {
            url: '/user',
            templateUrl: './app/components/user/userView.html',
            controller: 'userController',
            controllerAs: 'userCtrl',
            resolve: {
                verifySession:  function($q){
                    //console.log(tokenService.getToken());
                    var deferred = $q.defer();

                    if (sessionStorage.token) {
                        return sessionStorage.token;
                    } else {
                        return $q.reject("home")
                    }
                }
            }
        })
        .state('book', {
            url: '/book',
            templateUrl: './app/components/book/bookView.html',
            controller: 'bookController',
            controllerAs: 'bookCtrl',
            resolve: {
                verifySession:  function($q){
                    //console.log(tokenService.getToken());
                    var deferred = $q.defer();

                    if (sessionStorage.token) {
                        return sessionStorage.token;
                    } else {
                        return $q.reject("home")
                    }
                }
            }
        });
        
});