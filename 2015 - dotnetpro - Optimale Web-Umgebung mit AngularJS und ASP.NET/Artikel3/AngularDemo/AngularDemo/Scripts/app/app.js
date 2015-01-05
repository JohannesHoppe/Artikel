define([
    'require',
    'angular',
    'angular-route',
    'app/home/homeController',
    'app/example1/customerDetails',
    'app/example2/searchCustomers',
    'app/example3/searchCustomers2'
], function(require, angular) {

    angular.module('app', ['ngRoute', 'home', 'example1', 'example2', 'example3'])
        .config([
            '$routeProvider', function($routeProvider) {

                $routeProvider
                    .when('/', {
                        templateUrl: '/Scripts/app/home/home.html',
                        controller: 'homeController'
                    })
                    .when('/example1/:customerId', {
                        templateUrl: '/Scripts/app/example1/customerDetails.html',
                        controller: 'customerDetails'
                    })
                    .when('/example2', {
                        templateUrl: '/Scripts/app/example2/searchCustomers.html',
                        controller: 'searchCustomers'
                    })
                    .when('/example3', {
                        templateUrl: '/Scripts/app/example3/searchCustomers2.html',
                        controller: 'searchCustomers2'
                    })
                    .otherwise({ redirectTo: '/' });
            }
        ]);


    // bootstrap Angular after require.js and DOM are ready
    require(['domReady!'], function(domReady) {
        angular.bootstrap(domReady, ['app']);
    });
});