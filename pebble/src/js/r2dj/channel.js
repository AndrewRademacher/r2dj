var config = require('app-config');
var Log = require('logger');
var ajax = require('ajax');
var Song = require('song');

var Channel = function (c) {
    this.id = c._id;
    this.name = c.name;
};

Channel.prototype.info = function (cb) {
    Log('getting channel info');
    
    ajax.get(config.apiUrl + '/channel/' + this.id, function (err, data) {
        if (err) return cb(err);

        data.history = (data.history || [])
        .map(function (s) { 
            return Song.new(s); 
        });
        
        data.queue = (data.queue || [])
        .map(function (s) { 
            return Song.new(s); 
        });

        data.currentSong = data.history.slice(-1)[0];

        cb(null, data);
    });
};

Channel.prototype.vote = function (song, vote, cb) {
    var headers = { 
        'Content-Type': 'application/json'
    };

    if (this.listenerId) {
        headers.Listener = this.listenerId;
    }

    Log(song);
    
    ajax.put(config.apiUrl + '/channel/queue/' + this.id, {
        vote: vote ? 1 : -1,
        songId: song.id
    }, headers, function (err, data) {
        Log(arguments);
        if (data.listenerId) {
            this.listenerId = data.listenerId;
        }
        cb(err);
    }.bind(this));
};

Channel.new = function (info) {
    return new Channel(info);
};

Channel.list = function (cb) {
    ajax.get(config.apiUrl + '/channel', function (err, chans) {
        chans = chans || [];
        cb(null, chans.map(function (c) {
            return Channel.new(c);
        }));
    });
};

module.exports = Channel;