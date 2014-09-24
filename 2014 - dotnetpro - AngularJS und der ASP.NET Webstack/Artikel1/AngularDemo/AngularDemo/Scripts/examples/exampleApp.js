define(['require', 'angular'], function (require, angular) {

    var app = angular.module('exampleApp', [])
        .controller('exampleController', function ($scope) {

            $scope.model = {
                text: 'Hello World'
            }
        });

    // bootstrap Angular after require.js and DOM are ready
    require(['domReady!'], function (domReady) {
        angular.bootstrap(domReady, ['exampleApp']);
    });

    return app;
});