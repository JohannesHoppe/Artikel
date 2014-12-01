define([
    'require',
    'angular',
    'angular-route',
    'app/home/homeController',
    'app/listing1/listing1Controller',
    'app/listing2/listing2Controller' ,
    'app/listing3/listing3Controller'
], function(require, angular) {

    angular.module('app', ['ngRoute', 'home', 'listing1', 'listing2', 'listing3'])
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
                    .when('/listing2', {
                        templateUrl: '/Scripts/app/listing2/listing2.html',
                        controller: 'listing2Controller'
                    })
                    .when('/listing3', {
                        templateUrl: '/Scripts/app/listing3/listing3.html',
                        controller: 'listing3Controller'
                    })
                    .otherwise({ redirectTo: '/' });
            }
        ]);


    // bootstrap Angular after require.js and DOM are ready
    require(['domReady!'], function(domReady) {
        angular.bootstrap(domReady, ['app']);
    });
});