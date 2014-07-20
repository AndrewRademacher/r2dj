var express = require('express');
var router = express.Router();

var exampleSongs = [
    { artist: 'Bastille', title: 'Pompeii', id: 1},
    { artist: 'Pink Floyd', title: 'Wish you were here', id: 2 }
];

router.get('/channel/:id', function (req, res) {
    var stationId = req.params.id;

    res.json({
        name: stationId,
        id: stationId
    });
});

router.get('/playlist/:id', function (req, res) {
    var stationId = req.params.id;

    res.json({
        stationId: stationId,
        currentSong: { artist: 'Adela', title: 'Rolling in the Deep', id: 3 },
        playlist: exampleSongs
    });
});

router.post('/log', function (req, res) {
    console.log(JSON.stringify(req.body, null, 2));
    res.json({});
});

router.post('/vote', function (req, res) {
    var vote = req.body;
    res.json({ message: 'Success' });
});

module.exports = router;
