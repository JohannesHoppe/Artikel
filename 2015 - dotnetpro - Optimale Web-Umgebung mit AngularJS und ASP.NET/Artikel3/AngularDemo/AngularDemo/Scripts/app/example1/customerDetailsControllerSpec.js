define([
    'angular',
    'angular-mocks',
    'app/example1/customerDetailsController'
], function () {

    describe('customerDetailsController', function () {

        var $scope, customerDetailsController;

        // set up the module
        beforeEach(module('example1'));

        beforeEach(inject(function ($rootScope, $controller) {

            $scope = $rootScope.$new();

            customerDetailsController = $controller('customerDetailsController', {
                '$scope': $scope,
                '$routeParams': { customerId: 42 }
            });
        }));

        it('should store received data on HTTP 200', inject(function ($httpBackend) {

            $httpBackend.whenGET("/api/CustomersApi/42").respond({ Id: 42 });
            $httpBackend.flush();

            expect($scope.customer).toBeDefined();
        }));

        it('should show a message on error 404', inject(function ($httpBackend) {

            $httpBackend.whenGET("/api/CustomersApi/42").respond(404);
            $httpBackend.flush();

            expect($scope.errorMessage).toBeDefined();
        }));

    });
});