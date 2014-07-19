var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.json({
        name: 'R2DJ',
        serverTime: new Date(),
        version: '0.1.0'
    });
});

module.exports = router;
