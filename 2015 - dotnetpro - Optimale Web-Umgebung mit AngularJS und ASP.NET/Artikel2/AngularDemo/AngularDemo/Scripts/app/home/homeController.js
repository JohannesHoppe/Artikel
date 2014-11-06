define(['angular', 'angular-partition'], function(angular) {

    return angular.module('home', ['partition'])
        .controller('homeController', [
            '$scope', '$http', function($scope, $http) {

                $scope.model = {
                    listings: [
                        {
                            title: 'Listing 1',
                            description: 'Daten laden per Web API',
                            url: '#/listing1'
                        }
                    ]
                }
        }
        ]);
});