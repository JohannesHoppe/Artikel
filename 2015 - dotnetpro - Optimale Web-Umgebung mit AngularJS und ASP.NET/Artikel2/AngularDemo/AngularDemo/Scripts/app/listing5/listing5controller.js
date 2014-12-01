define(['angular', 'breeze.angular'], function(angular) {

    return angular.module('listing5', ['breeze.angular'])
        .controller('listing5Controller', [
            '$scope', 'breeze', function($scope, breeze) {

                breeze.config.initializeAdapterInstance('dataService', 'webApiOData', true);
                var manager = new breeze.EntityManager('/odataFixed');

                new breeze.EntityQuery()
                    .using(manager)
                    .from("Customers")
                    .where("Id", "eq", 42)
                    .expand("Invoices")
                    .execute()
                    .then(function(data) {
                        $scope.customer = data.result;
                    });
            }
        ]);
});