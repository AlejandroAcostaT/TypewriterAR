angular.module('booksAR')

.directive('pagePreview', function(){
	return{
		restrict: 'E',
		templateUrl: './app/components/directives/typewriter/page-preview.html'
	};
})

.directive('textEditor', function(){
	return{
		restrict: 'E',
		templateUrl: './app/components/directives/typewriter/text-editor.html'
	};
})

.directive('typewriterNavbar', function(){
	return{
		restrict: 'E',
		templateUrl: './app/components/directives/typewriter/typewriter-navbar.html'
	};
})

.directive('imageEditor', function(){
	return{
		restrict: 'E',
		templateUrl: './app/components/directives/typewriter/image-editor.html'
	};
});