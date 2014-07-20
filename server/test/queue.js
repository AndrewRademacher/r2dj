var should = require('should');
var request = require('request');

var hostname = 'localhost',
    port = 3000,
    domain = 'http://' + hostname + ':' + port;

describe('R2DJ', function() {
    describe('Queue', function() {
        var creds = null,
            channel = null,
            listenerId1 = null,
            listenerId2 = null;
        it('should login and create a channel', function(done) {
            request({
                url: domain + '/manager',
                method: 'POST',
                json: {
                    rdioKey: 'queuekey'
                }
            }, function(err, res, body) {
                should.not.exist(err);
                should(res.statusCode).equal(200);
                creds = body;

                request({
                    url: domain + '/channel',
                    method: 'POST',
                    headers: {
                        User: creds._id,
                        RdioKey: creds.rdioKey
                    },
                    json: {
                        name: 'No dub Step.'
                    }
                }, function(err, res, body) {
                    should.not.exist(err);
                    should(res.statusCode).equal(200);
                    channel = body;

                    done();
                });
            });
        });

        // Begin Test

        it('should add to queue with no listener', function(done) {
            request({
                url: domain + '/channel/queue/' + channel._id,
                method: 'PUT',
                json: {
                    songId: 'song1',
                    title: 'Song1',
                    artist: 'Artist1',
                    album: 'Album1',
                    vote: 1
                }
            }, function(err, res, body) {
                should.not.exist(err);
                should(res.statusCode).equal(200);
                should(body).have.property('listenerId');

                listenerId1 = body.listenerId;
                done();
            });
        });

        it('should add to queue with existing listener', function(done) {
            request({
                url: domain + '/channel/queue/' + channel._id,
                method: 'PUT',
                headers: {
                    Listener: listenerId1
                },
                json: {
                    songId: 'song2',
                    title: 'Song2',
                    artist: 'Artist2',
                    album: 'Album2',
                    vote: 1
                }
            }, function(err, res, body) {
                should.not.exist(err);
                should(res.statusCode).equal(200);

                done();
            });
        });

        it('should allow a downvote', function(done) {
            request({
                url: domain + '/channel/queue/' + channel._id,
                method: 'PUT',
                json: {
                    songId: 'song1',
                    vote: -1
                }
            }, function(err, res, body) {
                should.not.exist(err);
                should(res.statusCode).equal(200);
                should(body).have.property('listenerId');

                listenerId2 = body.listenerId;
                done();
            });
        });

        it('should allow a manager to deque a song', function(done) {
            request({
                url: domain + '/channel/queue/' + channel._id,
                method: 'DELETE',
                header: {
                    User: creds._id,
                    RdioKey: creds.rdioKey
                },
                json: {
                    songId: 'song2'
                }
            }, function(err, res, body) {
                should.not.exist(err);
                should(res.statusCode).equal(204);
                done();
            });
        }); 
    });
});
