angular.module('routerApp')

.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: './app/components/home/homeView.html',
            controller: 'homeController',
            controllerAs: 'homeCtrl'
        });
        
});