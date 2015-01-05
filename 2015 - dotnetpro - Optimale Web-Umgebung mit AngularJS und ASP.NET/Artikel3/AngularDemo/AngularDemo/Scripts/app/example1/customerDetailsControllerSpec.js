define([
    'angular',
    'angular-mocks',
    'app/example1/customerDetailsController'
], function () {

    describe('customerDetailsController', function () {

        var $scope, customerDetailsController;

        beforeEach(module('example1'));

        beforeEach(inject(function ($rootScope, $controller) {

            $scope = $rootScope.$new();

            customerDetailsController = $controller('customerDetailsController', {
                '$scope': $scope,
                '$routeParams': { customerId: 42 }
            });
        }));

        it('should store received data on HTTP 200', inject(function ($httpBackend) {

            $httpBackend.whenGET("/api/CustomersApi/42").respond(200);
            $httpBackend.flush();

            expect($scope.customer).toBeDefined();
        }));

        it('should indicate an internal server error', inject(function ($httpBackend) {

            $httpBackend.whenGET("/api/CustomersApi/42").respond(404);
            $httpBackend.flush();

            expect($scope.message).toBeDefined();
        }));

    });
});