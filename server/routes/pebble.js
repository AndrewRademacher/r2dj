var express = require('express');
var router = express.Router();

router.post('/log', function (req, res) {
    console.log(JSON.stringify(req.body, null, 2));
    res.json({});
});

module.exports = router;
