var should = require('should');
var request = require('request');

var hostname = 'localhost',
    port = 3000,
    domain = 'http://' + hostname + ':' + port;

describe('R2DJ', function() {
    describe('Channel', function() {
        var creds = null,
            channel = null;
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
                should.not.exist(err);
                should(res.statusCode).equal(200);
                should(body).have.property('_id');
                should(body).have.property('ownerId');
                should(body).have.property('name');
                should(body).have.property('history');
                should(body).have.property('queue');

                channel = body._id;
                done();
            });
        });

        it('should get the open channels', function(done) {
            request({
                url: domain + '/channel',
                method: 'GET',
            }, function(err, res, body) {
                should.not.exist(err);
                should(res.statusCode).equal(200);
                var body = JSON.parse(body);
                should(body[0]).have.property('_id');
                should(body[0]).have.property('name');
                done();
            });
        });

        it('should get a single open channel', function(done) {
            request({
                url: domain + '/channel/' + channel,
                method: 'GET'
            }, function(err, res, body) {
                should.not.exist(err);
                should(res.statusCode).equal(200);
                var body = JSON.parse(body);
                should(body).have.property('_id');
                should(body).not.have.property('ownerId');
                should(body).have.property('name');
                should(body).have.property('history');
                should(body).have.property('queue');
                done();
            });
        });
    });
});
