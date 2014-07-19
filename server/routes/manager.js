var express = require('express');
var schema = require('json-schema');
var router = express.Router();

router.post('/', function(req, res) {
    var report = schema.validate(req.body, req.app.get('schema').Manager);
    if (!report.valid) return app.json(400, report.errors);

    var manager = req.app.get('db').manager;
    manager.findOne({ rdio_oauth: req.body.rdio_oauth }, { _id: 1, rdio_oauth: 1 })
    .then(function(doc) {
        if (doc) res.json(doc);
        else return manager.insert(req.body);
    })
    .then(function(doc) {
        res.json({
            _id: doc._id,
            rdio_oauth: rdio_oauth
        });
    }, function(err) {
        res.json(500, err);
    })
});

module.exports = router;
