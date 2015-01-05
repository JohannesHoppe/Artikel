define([
    'angular',
    'app/entityMetadata',
    'breeze.angular'
], function(angular, entityMetdata) {

    return angular.module('entityManager', ['breeze.angular'])
        .provider('entityManager', function() {

            var config = {
                withoutWebApiOData: false,
                enableLocalCache: false
            };

            return {
                setConfig: function(conf) {
                    angular.extend(config, conf);
                },

                $get: [
                    'breeze', function(breeze) {

                        // (1)
                        if (!config.withoutWebApiOData) {
                            breeze.config.initializeAdapterInstance('dataService', 'webApiOData', true);
                        }

                        // (2)
                        var dataService = new breeze.DataService({
                            serviceName: '/odata',
                            hasServerMetadata: false // don't ask the server for metadata
                        });

                        var metadataStore = new breeze.MetadataStore();
                        metadataStore.importMetadata(JSON.stringify(entityMetdata));

                        var entityManager = new breeze.EntityManager({
                            dataService: dataService,
                            metadataStore: metadataStore
                        });

                        // (3)
                        entityManager.from = function(resourceName) {

                            var query =
                                new breeze.EntityQuery()
                                    .from(resourceName)
                                    .using(entityManager);


                            if (config.enableLocalCache) {
                                query = query.using(breeze.FetchStrategy.FromLocalCache);
                            }

                            return query;
                        };

                        return entityManager;
                    }
                ]
            };
        });
});