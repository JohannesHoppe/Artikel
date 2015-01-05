define(['angular'], function(angular) {

    return angular.module('example1', [])

        .controller('customerDetailsController', [
            '$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

                $http.get('/api/CustomersApi/' + $routeParams.customerId)
                    .success(function(customer) {
                        $scope.customer = customer;
                    })
                    .error(function() {
                        $scope.message = "an error occurred!";
                    });
            }
        ]);
});