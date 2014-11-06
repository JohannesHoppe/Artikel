﻿define([
    'require',
    'angular',
    'angular-route'
], function(require, angular) {

    angular.module('app', ['ngRoute', 'views'])
        .config([
            '$routeProvider', function($routeProvider) {

                $routeProvider
                    .when('/', {
                        templateUrl: appConfig.angularTemplateUrls.home,
                        controller: 'homeController'
                    })
                    .otherwise({ redirectTo: appConfig.angularRoutes.error404 });
            }
        ]);


    // bootstrap Angular after require.js and DOM are ready
    require(['domReady!'], function(domReady) {
        angular.bootstrap(domReady, ['app']);
    });
});