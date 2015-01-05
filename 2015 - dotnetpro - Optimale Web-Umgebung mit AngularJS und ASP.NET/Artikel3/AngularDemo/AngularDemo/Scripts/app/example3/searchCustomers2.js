define([
    'angular',
    'app/entityManager',
    'breeze.angular'
], function(angular) {

    return angular.module('example3', ['breeze.angular', 'entityManager'])
        .controller('searchCustomers2', [
            '$scope', 'entityManager', function($scope, entityManager) {

                entityManager
                    .from("Customers")
                    .orderBy("FirstName")
                    .where("FirstName", "eq", "Jack")
                    .execute()
                    .then(function(data) {
                        $scope.customers = data.results;
                    });
            }
        ]);
});