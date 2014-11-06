requirejs.config({
    baseUrl: '/Scripts',
    paths: {
        'jquery': 'jquery-2.1.1',
        'breeze': 'breeze.debug',
        'OData': 'datajs-1.1.3'
    },
    shim: {
        angular: {
            exports: 'angular',
            deps: ['jquery']
        },
        'angular-route': {
            exports: 'angular',
            deps: ['angular']
        },
        'angular-mocks': {
            exports: 'angular',
            deps: ['angular']
        },
        'breeze.angular': {
            deps: ['breeze']
        },
        breeze: {
            deps: ['angular', 'OData']
        }
    }
});