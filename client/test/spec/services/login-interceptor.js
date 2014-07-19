'use strict';

describe('Service: LoginInterceptor', function() {

    // load the service's module
    beforeEach(module('clientApp'));

    // instantiate service
    var LoginInterceptor;
    beforeEach(inject(function(_LoginInterceptor_) {
        LoginInterceptor = _LoginInterceptor_;
    }));

    it('should do something', function() {
        expect( !! LoginInterceptor).toBe(true);
    });

});
