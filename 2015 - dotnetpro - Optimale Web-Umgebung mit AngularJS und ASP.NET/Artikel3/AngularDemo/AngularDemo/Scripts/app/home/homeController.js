define(['angular', 'angular-partition'], function(angular) {

    return angular.module('home', ['partition'])
        .controller('homeController', [
            '$scope', '$http', function($scope) {

                $scope.model = {
                    listings: [
                        {
                            title: 'Beispiel 1',
                            description: 'Daten laden per Web API',
                            url: '#/example1/42'
                        },
                        {
                            title: 'Beispiel 2',
                            description: 'Daten laden per OData/breeze.js - ohne gespeicherte Metadaten, schwer testbar',
                            url: '#/example2'
                        },
                        {
                            title: 'Beispiel 3',
                            description: 'Daten laden per OData/breeze.js - mit gespeicherten Metadaten',
                            url: '#/example3'
                        }
                    ]
                }
        }
        ]);
});