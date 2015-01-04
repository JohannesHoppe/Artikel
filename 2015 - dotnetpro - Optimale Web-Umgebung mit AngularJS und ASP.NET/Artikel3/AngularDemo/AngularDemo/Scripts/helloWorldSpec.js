define(['helloWorld'], function(helloWorld) {

    describe('helloWorld', function () {
        it('should say hello', function() {
            expect(helloWorld.say()).toEqual("Hello World");
        });
    });

});