requirejs.config({
    baseUrl: '/Scripts',
    paths: {
        'jquery': 'jquery-2.1.1'
    },
    shim: {
        angular: {
            exports: 'angular',
            deps: ['jquery']
        }
    }
});