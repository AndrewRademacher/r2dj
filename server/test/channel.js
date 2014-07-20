var should = require('should');
var request = require('request');

var hostname = 'localhost',
    port = 3000,
    domain = 'http://' + hostname + ':' + port;

describe('R2DJ', function() {
    describe('Channel', function() {
        var creds = null;
        it('should login with foauth', function(done) {
            request({
                url: domain + '/manager',
                method: 'POST',
                json: {
                    rdioKey: 'fokey'
                }
            }, function(err, res, body) {
                should.not.exist(err);
                should(res.statusCode).equal(200);
                creds = body;
                done();
            });
        });

        it('should create a new channel', function(done) {
            request({
                url: domain + '/channel',
                method: 'POST',
                headers: {
                    User: creds._id,
                    RdioKey: creds.rdioKey
                },
                json: {
                    name: 'So much dub step.'
                }
            }, function(err, res, body) {
                console.log(err);
                console.log(res.statusCode);
                console.log(body);
                done();
            });
        });
    });
});
