define([
    'angular',
    'angular-mocks',
    'app/example3/searchCustomers2'
], function() {

    describe('searchCustomers2', function() {

        var $scope;

        // set up the module
        beforeEach(module('example3', function(entityManagerProvider) {
            entityManagerProvider.setupForUnitTest();
        }));

        beforeEach(inject(function (entityManager, $rootScope, $controller) {

            entityManager.createEntity('Customer', { FirstName: 'James' });
            entityManager.createEntity('Customer', { FirstName: 'Jack' });

            $scope = $rootScope.$new();
            $controller('searchCustomers2', { '$scope': $scope });
        }));

        it('should only resolve customers with the FirstName "Jack"', inject(function($rootScope) {

            // AngularJS promises will not resolve until a digest cycle is triggered!
            $rootScope.$digest();

            expect($scope.customers.length).toBe(1);
            expect($scope.customers[0].FirstName).toBe('Jack');
        }));

    });
});