define([
    'require',
    'angular',
    'angular-route',
    'app/home/homeController',
    'app/example1/customerDetailsController'
], function(require, angular) {

    angular.module('app', ['ngRoute', 'home', 'example1'])
        .config([
            '$routeProvider', function($routeProvider) {

                $routeProvider
                    .when('/', {
                        templateUrl: '/Scripts/app/home/home.html',
                        controller: 'homeController'
                    })
                    .when('/example1/:customerId', {
                        templateUrl: '/Scripts/app/example1/customerDetails.html',
                        controller: 'customerDetailsController'
                    })


                    .otherwise({ redirectTo: '/' });
            }
        ]);


    // bootstrap Angular after require.js and DOM are ready
    require(['domReady!'], function(domReady) {
        angular.bootstrap(domReady, ['app']);
    });
});