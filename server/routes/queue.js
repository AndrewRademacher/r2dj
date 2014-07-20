var _ = require('lodash');
var Q = require('q');
var express = require('express');
var schema = require('json-schema');
var ObjectId = require('promised-mongo').ObjectId;
var router = express.Router();

// Message Formats

var putVote = {
    type: 'object',
    properties: {
        songId: {
            type: 'string',
            required: true
        },
        title: {
            type: 'string'
        },
        artist: {
            type: 'string'
        },
        album: {
            type: 'string'
        },
        vote: {
            type: 'integer',
            required: true
        }
    },
    additionalProperties: false
};

var deleteVote = {
    type: 'object',
    properties: {
        songId: {
            type: 'string',
            required: true
        }
    },
    additionalProperties: false
};

// Routes

router.put('/:id', function(req, res) {
    var report = schema.validate(req.body, putVote);
    if (!report.valid) return res.json(400, report.errors);

    var channel = req.app.get('db').channel,
        listener = req.app.get('db').listener;
    Q.all([
        channel.findOne({
            _id: ObjectId(req.param('id'))
        }, {}),
        listener.findOne({
            _id: (req.header('Listener')) ? ObjectId(req.header('Listener')) : ''
        }, {})
    ])
        .spread(function(c, l) {
            if (!c) return res.json(404, {
                message: 'Channel not found.'
            });

            var lNew = false;
            if (!l) {
                lNew = true;
                l = {
                    channelId: c._id,
                    votes: [{
                        songId: req.body.songId,
                        vote: req.body.vote
                    }]
                };
            }

            var song = _.find(c.queue, function(song) {
                return song.songId === req.body.songId;
            })

            var vote = _.find(l.votes, function(vote) {
                return vote.songId === req.body.songId;
            });

            var nL;
            if (lNew) nL = listener.insert(l);
            else {
                if (vote) {
                    nL = listener.update({
                        _id: l._id,
                        'votes.songId': vote.songId
                    }, {
                        $set: {
                            'votes.$.vote': req.body.vote
                        }
                    });
                } else {
                    nL = listener.update({
                        _id: l._id
                    }, {
                        $push: {
                            votes: {
                                songId: req.body.songId,
                                vote: req.body.vote
                            }
                        }
                    });
                }
            }

            var nC = null;
            if (song && !vote) {
                nC = channel.update({
                    _id: c._id,
                    'queue.songId': song.songId
                }, {
                    $set: {
                        'queue.$.vote': song.vote + req.body.vote
                    }
                });
            } else {
                nC = channel.update({
                    _id: c._id
                }, {
                    $push: {
                        queue: req.body
                    }
                });
            }

            return Q.all([nC, nL]);
        })
        .spread(function(nC, nL) {
            res.json(200, {
                listenerId: nL._id
            });
        }, function(err) {
            res.json(500, err);
        });
});

router.post('/:id/next', function(req, res) {
    var manager = req.app.get('db').manager,
        channel = req.app.get('db').channel;

    manager.findOne({
        _id: ObjectId(req.header('User')),
        rdioUser: req.header('RdioUser')
    })
        .then(function(m) {
            if (!m) return res.json(401, {
                message: 'User not found'
            });

            return channel.findOne({
                _id: ObjectId(req.param('id'))
            });
        })
        .then(function(c) {
            if (!c) {
                return res.send(404, {
                    message: 'Channel not found.'
                });
            }

            var nextSong = _.sortBy(c.queue, function(s) {
                return s.votes;
            }).splice(-1)[0];

            if (!nextSong) {
                return res.json(null);
            }

            return channel.update({
                _id: ObjectId(c._id)
            }, {
                $pull: {
                    queue: {
                        songId: nextSong.songId
                    }
                },
                $push: {
                    history: nextSong
                }
            })
                .then(function() {
                    res.json(nextSong);
                });
        })
        .fail(function(err) {
            res.send(err);
        });
});

router.delete('/:id', function(req, res) {
    var report = schema.validate(req.body, deleteVote);
    if (!report.valid) return res.json(400, report.errors);

    var channel = req.app.get('db').channel;
    channel.update({
        _id: ObjectId(req.param('id'))
    }, {
        $pull: {
            queue: {
                songId: req.body.songId
            }
        }
    })
        .then(function() {
            res.send(204);
        }, function(err) {
            res.json(500, err);
        });
});

module.exports = router;
