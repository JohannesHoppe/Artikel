requirejs.config({
    baseUrl: '/Scripts',
    paths: {
        'jquery': 'jquery-2.1.1',
        '/bundles/templateCache': '/bundles/templateCache#.js' // this is a template bundle (not a file on disk), see BundleConfig.cs
    },
    shim: {
        angular: {
            exports: 'angular',
            deps: ['jquery']
        }
    }
});