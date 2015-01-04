define(['helloWorld'], function(sut) {

    describe('helloWorldTest', function () {
        it('should says hello', function() {
            expect(sut.helloWorld()).toEqual("Hello World");
        });
    });

});