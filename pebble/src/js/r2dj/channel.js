var config = require('app-config');
var Log = require('logger');
var ajax = require('ajax');

var Channel = function (c) {
    this.id = c._id;
    this.name = c.name;
};

Channel.prototype.getPlaylist = function (cb) {
    Log('getting songs');
    ajax.get(config.apiUrl + '/playlist/' + this.id, cb);
};

Channel.prototype.vote = function (song, vote, cb) {
    ajax.post(config.apiUrl + '/vote', {
        vote: vote,
        song_id: song.id,
        pebble_id: Pebble.getAccountToken(),
        channel_id: this.id
    }, function (err) {
        Log('Vote complete: ' + JSON.stringify(err || "Success!"));
        cb(err);
    });
};

Channel.new = function (info) {
    return new Channel(info);
};

Channel.list = function (cb) {
    cb(null, [ Channel.new({name: 'test', _id: 123 }), Channel.new({name: 'test2', _id: 111})]);
    //ajax.get(config.apiUrl + '/channels', cb);
};

module.exports = Channel;