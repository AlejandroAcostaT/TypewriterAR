angular.module('booksAR')


.directive('userNavbar', function(){
	return{
		restrict: 'E',
		templateUrl: './app/components/directives/user/user-navbar.html'
	};
})

.directive('userBooksTable', function(){
    return{
        restrict: 'E',
        templateUrl: './app/components/directives/user/user-books-table.html'
    };
})

.directive('userTable', function(){
    return{
        restrict: 'E',
        templateUrl: './app/components/directives/user/user-table.html'
    };
})

.directive('userProfileInfo', function(){
    return{
        restrict: 'E',
        templateUrl: './app/components/directives/user/user-profile-info.html'
    };
})

.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}]);