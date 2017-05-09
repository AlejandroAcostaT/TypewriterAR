angular.module('booksAR')

.directive('pagePreview', function(){
	return{
		restrict: 'E',
		templateUrl: './app/components/directives/page/page-preview.html'
	};
})

.directive('textEditor', function(){
	return{
		restrict: 'E',
		templateUrl: './app/components/directives/page/text-editor.html'
	};
});