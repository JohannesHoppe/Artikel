define([
    'angular',
    'angular-mocks',
    'app/example3/searchCustomers2'
], function() {

    describe('searchCustomers2', function() {

        var $scope, searchCustomers2;

        // set up the module
        beforeEach(module('example3', function(entityManagerProvider) {
            entityManagerProvider.setupForUnitTest();
        }));

        beforeEach(inject(function(breeze, entityManager) {

            entityManager.createEntity('Customer', { FirstName: 'James' });
            entityManager.createEntity('Customer', { FirstName: 'Jack' });
        }));

        beforeEach(inject(function($rootScope, $controller) {

            $scope = $rootScope.$new();
            searchCustomers2 = $controller('searchCustomers2', { '$scope': $scope });
        }));

        it('should only resolve customer with the FirstName "Jack"', inject(function($rootScope) {

            // AngularJS promises will not resolve until a digest cycle is triggered!
            $rootScope.$digest();

            expect($scope.customers.length).toBe(1);
            expect($scope.customers[0].FirstName).toBe('Jack');
        }));

    });
});