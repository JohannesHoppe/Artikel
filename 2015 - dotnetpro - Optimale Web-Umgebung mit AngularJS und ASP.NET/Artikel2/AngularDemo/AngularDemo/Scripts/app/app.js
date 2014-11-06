define([
    'require',
    'angular',
    'angular-route',
    'app/home/homeController',
    'app/listing1/listing1Controller'
], function(require, angular) {

    angular.module('app', ['ngRoute', 'home', 'listing1'])
        .config([
            '$routeProvider', function($routeProvider) {

                $routeProvider
                    .when('/', {
                        templateUrl: '/Scripts/app/home/home.html',
                        controller: 'homeController'
                    })
                    .when('/listing1', {
                        templateUrl: '/Scripts/app/listing1/listing1.html',
                        controller: 'listing1Controller'
                    })
                    .otherwise({ redirectTo: '/' });
            }
        ]);


    // bootstrap Angular after require.js and DOM are ready
    require(['domReady!'], function(domReady) {
        angular.bootstrap(domReady, ['app']);
    });
});