module.exports = function(config) {
    config.set({

        basePath: 'AngularDemo/Scripts',
        frameworks: ['jasmine', 'requirejs'],
        files: [
            'require.config.karma.js',
            { pattern: '**/*.js', included: false }
        ],
        browsers: ['Chrome']
    });
};
