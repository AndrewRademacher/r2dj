var express = require('express');
var schema = require('json-schema');
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

router.get('/channel', function(req, res) {});

router.get('/channel/:id', function(req, res) {});

router.post('/channel', function(req, res) {
    var report = schema.validate(req.body, newChannel);
    if (!report.valid) return app.json(400, report.errors);

    var manager = req.app.get('db').manager,
        channel = req.app.get('db').channel;
    // TODO: start here 
});

router.delete('/channel/:id', function(req, res) {});

module.exports = router;
