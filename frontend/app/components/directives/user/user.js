angular.module('booksAR')


.directive('userNavbar', function(){
	return{
		restrict: 'E',
		templateUrl: './app/components/directives/user/user-navbar.html'
	};
});