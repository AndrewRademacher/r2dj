var should = require('should');
var request = require('request');

var hostname = 'localhost',
    port = 3000,
    domain = 'http://' + hostname + ':' + port;

describe('R2DJ', function() {
    describe('Manager', function() {


        it('should create a user with RDIO oauth.', function(done) {
            request({
                url: domain + '/manager',
                method: 'POST',
                json: {
                    rdioOauth: 'foauth234'
                }
            }, function(err, res, body) {
                should.not.exist(err);
                should(res.statusCode).equal(200);
                should(body).have.property('_id');
                should(body).have.property('rdioOauth');
                done();
            });
        });
    });
});
