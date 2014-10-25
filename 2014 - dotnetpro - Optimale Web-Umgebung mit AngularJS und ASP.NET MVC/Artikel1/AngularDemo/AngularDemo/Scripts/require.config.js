requirejs.config({
    baseUrl: '/Scripts',
    paths: {
        'jquery': 'jquery-2.1.1',
        '/bundles/templateCache': '/bundles/templateCache#.js' // this is a template bundle, see BundleConfig.cs - that file does not really exists!
    },
    shim: {
        angular: {
            exports: 'angular',
            deps: ['jquery']
        }
    }
});