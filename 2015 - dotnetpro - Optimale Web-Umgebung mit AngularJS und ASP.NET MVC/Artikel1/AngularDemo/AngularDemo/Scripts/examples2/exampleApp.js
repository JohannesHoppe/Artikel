define([
    'require',
    'angular',
    '/bundles/templateCache',
    'examples2/myDirective'
], function(require, angular) {

    var app = angular.module('exampleApp', ['directives', 'bundleTemplateCache'])
        .controller('exampleController', function($scope) {

            $scope.model = {
                text: 'Bundling mit Angular-Templates',
                message: 'Das verwendete Template kommt aus dem $templateCache!'
            }
        });

    // bootstrap Angular after require.js and DOM are ready
    require(['domReady!'], function(domReady) {
        angular.bootstrap(domReady, ['exampleApp']);
    });

    return app;
});