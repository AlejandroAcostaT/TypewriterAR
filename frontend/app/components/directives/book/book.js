angular.module('booksAR')

.directive('bookNavbar', function(){
	return{
		restrict: 'E',
		templateUrl: './app/components/directives/book/book-navbar.html'
	};
});