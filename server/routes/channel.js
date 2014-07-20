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

router.get('/', function(req, res) {});

router.get('/:id', function(req, res) {});

router.post('/', function(req, res) {
    var report = schema.validate(req.body, newChannel);
    if (!report.valid) return app.json(400, report.errors);

    var manager = req.app.get('db').manager,
        channel = req.app.get('db').channel;
    manager.findOne({
        _id: ObjectId(req.header('User')),
        rdioKey: req.header('Rdiokey')
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

router.delete('/:id', function(req, res) {});

module.exports = router;
