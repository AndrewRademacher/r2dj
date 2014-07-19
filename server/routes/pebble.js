var express = require('express');
var router = express.Router();

var exampleSongs = [
    { artist: 'Bastille', name: 'Pompeii', id: 1},
    { artist: 'Pink Floyd', name: 'Wish you were here', id: 2 }
];

router.get('/playlist/:id', function (req, res) {
    var stationId = req.params.id;
    res.json(exampleSongs);
});

router.post('/log', function (req, res) {
    console.log(JSON.stringify(req.body, null, 2));
    res.json({});
});

router.post('/vote', function (req, res) {
    var vote = req.body;
    console.log(vote);
    res.end();
});

module.exports = router;
