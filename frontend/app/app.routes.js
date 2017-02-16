angular.module('booksAR')

.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
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
            controllerAs: 'typewriterCtrl'
        });
        
});