// app.js
var app = angular.module('booksAR', ['ui.router']);

app.controller('GlobalCtrl', function($scope) {
    // Event listener for state change.
    $scope.$on('$stateChangeStart', function(event, toState, toParams) {
        $scope.bodyClass = toState.name + '-page';
    });
});