define(['angular', 'angular-partition'], function(angular) {

    return angular.module('home', ['partition'])
        .controller('homeController', [
            '$scope', '$http', function($scope, $http) {

                $scope.model = {
                    listings: [
                        {
                            title: 'Beispiel 1',
                            description: 'Daten laden per Web API',
                            url: '#/example1/42'
                        }


                        ,
                        {
                            title: 'Listing 4',
                            description: 'Daten laden per breeze.js',
                            url: '#/listing4'
                        },
                        {
                            title: 'Listing 5',
                            description: 'Daten laden per breeze.js',
                            url: '#/listing5'
                        }
                    ]
                }
        }
        ]);
});