var _ = require('lodash');
var should = require('should');
var request = require('request');
var pmongo = require('promised-mongo');
var ObjectId = pmongo.ObjectId;

var hostname = 'localhost',
    port = 3000,
    domain = 'http://' + hostname + ':' + port;

var db = pmongo(process.env.MONGO_CONN_STRING, ['manager', 'channel', 'listener']);

describe('R2DJ', function() {
    describe('Queue', function() {
        var creds = null,
            channel = null,
            listenerId1 = null,
            listenerId2 = null,
            listenerId3 = null;
        it('should login and create a channel', function(done) {
            request({
                url: domain + '/manager',
                method: 'POST',
                json: {
                    rdioUser: 'queuekey'
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
                        RdioUser: creds.rdioUser
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
                    RdioUser: creds.rdioUser
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

        it('should add a new song with positive votes', function(done) {
            request({
                url: domain + '/channel/queue/' + channel._id,
                method: 'PUT',
                header: {
                    Listener: listenerId1
                },
                json: {
                    songId: 'song3',
                    title: 'Song3',
                    artist: 'Artist3',
                    album: 'Album3',
                    vote: 1
                }
            }, function(err, res, body) {
                should.not.exist(err);
                should(res.statusCode).equal(200);
                done();
            });
        });

        it('should select the next song', function(done) {
            request({
                url: domain + '/channel/queue/' + channel._id + '/next',
                method: 'POST',
                headers: {
                    User: creds._id,
                    RdioUser: creds.rdioUser
                }
            }, function(err, res, body) {
                should.not.exist(err);
                should(res.statusCode).equal(200);
                var body = JSON.parse(body);
                should(body).have.property('songId');

                done();
            });
        });

        it('should not allow a user to vote twice', function(done) {
            request({
                url: domain + '/channel/queue/' + channel._id,
                method: 'PUT',
                json: {
                    songId: 'song4',
                    title: 'Song4',
                    artist: 'Artist4',
                    album: 'Album4',
                    vote: 1
                }
            }, function(err, res, body) {
                should.not.exist(err);
                should(res.statusCode).equal(200);
                should(body).have.property('listenerId');

                listenerId3 = body.listenerId;

                request({
                    url: domain + '/channel/queue/' + channel._id,
                    method: 'PUT',
                    json: {
                        songId: 'song4',
                        vote: 1
                    }
                }, function(err, res, body) {
                    should.not.exist(err);
                    should(res.statusCode).equal(200);

                    db.channel.findOne({
                        _id: ObjectId(channel._id)
                    }, function(err, doc) {
                        var s4 = _.find(doc.queue, function(qItem) {
                            return qItem.songId === 'song4';
                        });

                        should(s4.vote).equal(1);
                        done();
                    });
                });
            });
        });
    });
});
