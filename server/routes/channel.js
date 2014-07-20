var _ = require('lodash');
var express = require('express');
var schema = require('json-schema');
var ObjectId = require('promised-mongo').ObjectId;
var router = express.Router();

// Message Formats

var newChannel = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            required: true
        }
    },
    additionalProperties: false
};

// Routes

router.get('/', function(req, res) {
    var channel = req.app.get('db').channel;
    channel.find({}, {
        _id: 1,
        name: 1
    }).sort({
        name: 1
    }).toArray()
        .then(function(docs) {
            res.json(200, docs);
        }, function(err) {
            res.json(500, err);
        });
});

router.get('/:id', function(req, res) {
    var channel = req.app.get('db').channel;
    channel.findOne({
        _id: ObjectId(req.param('id'))
    }, {
        ownerId: 0
    })
        .then(function(doc) {
            doc.queue = _.sortBy(doc.queue, function (s) {
                console.log(s)
                return -s.vote;
            });

            res.json(200, doc);
        }, function(err) {
            res.json(500, err);
        })
});

router.post('/', function(req, res) {
    var report = schema.validate(req.body, newChannel);
    if (!report.valid) return app.json(400, report.errors);

    var manager = req.app.get('db').manager,
        channel = req.app.get('db').channel;
    manager.findOne({
        _id: ObjectId(req.header('User')),
        rdioUser: req.header('RdioUser')
    })
        .then(function(doc) {
            if (!doc) return res.json(401, {
                message: 'User not found'
            });

            return channel.insert({
                ownerId: ObjectId(req.header('User')),
                name: req.body.name,
                history: [],
                queue: []
            });
        })
        .then(function(channel) {
            res.json(200, channel);
        }, function(err) {
            res.json(500, err);
        });
});

router.delete('/:id', function(req, res) {
    var manager = req.app.get('db').manager,
        channel = req.app.get('db').channel;
    manager.findOne({
        _id: ObjectId(req.header('User')),
        rdioUser: req.header('RdioUser')
    })
        .then(function(user) {
            if (!user) return res.json(401, {
                message: 'User not found'
            });

            return channel.remove({
                _id: ObjectId(req.param('id'))
            });
        })
        .then(function() {
            res.send(204);
        }, function(err) {
            console.log(err);
            res.json(500, err);
        });
});

module.exports = router;
