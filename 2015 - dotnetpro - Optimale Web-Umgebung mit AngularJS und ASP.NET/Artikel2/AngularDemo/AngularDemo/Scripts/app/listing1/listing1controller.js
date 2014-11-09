define(['angular'], function(angular) {

    return angular.module('listing1', [])
        .controller('listing1Controller', [
            '$scope', '$http', function($scope, $http) {

            $http.get('/api/Customers').
                success(function(data, status, headers, config) {

                $scope.customers = data;
            });
        }
        ]);
});