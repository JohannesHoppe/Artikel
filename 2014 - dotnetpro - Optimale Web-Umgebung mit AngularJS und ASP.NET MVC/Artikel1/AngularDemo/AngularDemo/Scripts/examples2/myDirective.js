define([
    'angular',
    'examples2/directives'
], function(angular) {

    return angular.module('directives')
        .directive('myDirective', function() {
            return {
                restrict: 'AE',
                scope: {
                    message: '@'
                },
                templateUrl: '/Scripts/examples2/myDirective.html'
            };
        });
});